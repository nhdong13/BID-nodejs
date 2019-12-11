import models from '@models';
import { sendSingleMessage } from '@utils/pushNotification';
import {
    invitationMessages,
    noticeMessages,
} from '@utils/notificationMessages';
import {
    getScheduleTime,
    checkBabysitterSchedule,
    checkRequestTime,
} from '@utils/schedule';
import Scheduler from '@services/schedulerService';
import Sequelize, { Op } from 'sequelize';
import env, { checkEnvLoaded } from '@utils/env';
import { titleMessages } from '@utils/notificationMessages';

checkEnvLoaded();
const { dbHost, dbUser, dbPass, dbName, dbDialect } = env;

const sequelize = new Sequelize(dbName, dbUser, dbPass, {
    host: dbHost,
    dialect: dbDialect,
    define: {
        paranoid: false,
        underscored: false,
        timestamps: false,
        freezeTableName: false,
    },
    logging: false,
});

export function acceptSitter(requestId, sitterId, distance) {
    return sequelize.transaction((t) => {
        return lockBabysitterForUpdate(sitterId, t).then((babysitter) => {
            return findRequest(requestId, t).then((request) => {
                if (request) {
                    // check available
                    let available = checkAvailable(request, babysitter);
                    if (!available) {
                        throw new Error('OVERLAP');
                    } else {
                        return confirmRequest(
                            requestId,
                            sitterId,
                            distance,
                            t,
                        ).then(async (res) => {
                            if (request.repeatedRequestId) {
                                request.acceptedBabysitter = sitterId;
                                const repeatedRequest = await models.repeatedRequest.findOne(
                                    {
                                        where: {
                                            id: request.repeatedRequestId,
                                        },
                                    },
                                );

                                Scheduler.createRepeatedRequest(
                                    repeatedRequest,
                                    request,
                                );
                            } else {
                                // create sitter schedule for this sitting
                                await createSchedule(
                                    request,
                                    sitterId,
                                    requestId,
                                    t,
                                );
                            }
                            // confirm the sitter invitation
                            await confirmInvitaion(requestId, sitterId, t);

                            // update any invitations of this babysitter that overlap with this request
                            await updateInvitations(
                                sitterId,
                                requestId,
                                request,
                                t,
                            );
                            // notify to the accepted babysitter
                            await notifyBabysitter(requestId, sitterId, t);
                            // expire other invitation of this request
                            return expireInvitations(requestId, sitterId, t);
                        });
                    }
                }
            });
        });
    });
}

function lockBabysitterForUpdate(sitterId, transaction) {
    return models.babysitter.findOne({
        where: {
            userId: sitterId,
        },
        include: [
            {
                model: models.user,
                as: 'user',
                include: [
                    {
                        model: models.schedule,
                        as: 'schedules',
                    },
                ],
            },
        ],
        transaction: transaction,
        lock: transaction.LOCK.UPDATE,
    });
}

function findRequest(requestId, transaction) {
    return models.sittingRequest.findOne({
        where: {
            id: requestId,
        },
        transaction: transaction,
        lock: transaction.LOCK.UPDATE,
    });
}

function checkAvailable(request, babysitter) {
    let available = checkBabysitterSchedule(babysitter, request);

    return available;
}

function confirmRequest(requestId, sitterId, distance, transaction) {
    // update sitting request
    return models.sittingRequest.update(
        {
            status: 'CONFIRMED',
            acceptedBabysitter: sitterId,
            distance: distance,
        },
        {
            where: {
                id: requestId,
            },
            transaction: transaction,
            lock: transaction.LOCK.UPDATE,
        },
    );
}

function confirmInvitaion(requestId, sitterId, transaction) {
    // update the accepted babysitter's invitation status to CONFIRMED
    let selector = {
        where: {
            requestId: requestId,
            receiver: sitterId,
        },
        transaction: transaction,
        lock: transaction.LOCK.UPDATE,
    };
    models.invitation.update(
        {
            status: 'CONFIRMED',
        },
        selector,
    );
}

function createSchedule(request, sitterId, requestId, transaction) {
    // create a schedule for the accepted babysitter'schedules
    try {
        let scheduleTime = getScheduleTime(request);
        let schedule = {
            userId: sitterId,
            requestId: requestId,
            scheduleTime: scheduleTime,
            type: 'FUTURE',
        };
        models.schedule.create(schedule, {
            transaction: transaction,
            lock: transaction.LOCK.UPDATE,
        });

        Scheduler.createReminder(sitterId, requestId, scheduleTime);
        Scheduler.createCheckinPoint(requestId, scheduleTime);
    } catch (error) {
        console.log(error);
    }
}

function updateInvitations(sitterId, requestId, request, transaction) {
    // update invitations of the accepted babysitter that colission with this request
    // first find all invitations sent to this babysitter from sitting-requests with the same date as this request
    models.invitation
        .findAll({
            where: {
                receiver: sitterId,
                status: {
                    [Sequelize.Op.or]: ['ACCEPTED', 'PENDING'],
                },
            },
            include: [
                {
                    model: models.sittingRequest,
                    as: 'sittingRequest',
                    where: {
                        sittingDate: request.sittingDate,
                        id: {
                            [Sequelize.Op.ne]: requestId,
                        },
                    },
                },
            ],
            transaction: transaction,
            lock: transaction.LOCK.UPDATE,
        })
        .then((unavailableInvitations) => {
            // then set EXPIRED status for those invitations
            // first check if the time is overlap each other or not
            unavailableInvitations.forEach((invite) => {
                if (checkRequestTime(invite.sittingRequest, request)) {
                    models.invitation.update(
                        {
                            status: 'OVERLAP',
                        },
                        {
                            where: {
                                id: invite.id,
                            },
                            transaction: transaction,
                            lock: transaction.LOCK.UPDATE,
                        },
                    );
                }
            });
        });
}

function notifyBabysitter(requestId, sitterId, transaction) {
    // notify the accepted babysitter
    models.invitation
        .findOne({
            where: {
                requestId: requestId,
                receiver: sitterId,
            },
            include: [
                {
                    model: models.user,
                    as: 'user',
                    include: [
                        {
                            model: models.tracking,
                            as: 'tracking',
                        },
                    ],
                },
            ],
            transaction: transaction,
            lock: transaction.LOCK.UPDATE,
        })
        .then((invitation) => {
            if (invitation) {
                if (invitation.user != null) {
                    if (invitation.user.tracking != null) {
                        const notification = {
                            id: invitation.id,
                            pushToken: invitation.user.tracking.token,
                            title: titleMessages.parentAcceptedBabysitter,
                            message:
                                invitationMessages.parentAcceptedBabysitter,
                            option: {
                                showConfirm: true,
                                textConfirm: 'Tiếp tục',
                                showCancel: true,
                                textCancel: 'Ẩn',
                            },
                        };
                        sendSingleMessage(notification);
                    }
                }
            }
        });
}

function expireInvitations(requestId, sitterId, transaction) {
    // then update other babysitter's invitation status to EXPIRED
    let selector = {
        where: {
            requestId: requestId,
        },
    };

    if (typeof sitterId !== 'undefined' && typeof transaction !== 'undefined') {
        selector = {
            where: {
                requestId: requestId,
                receiver: {
                    [Sequelize.Op.ne]: sitterId,
                },
            },
            transaction: transaction,
            lock: transaction.LOCK.UPDATE,
        };
    }

    return models.invitation.update(
        {
            status: 'EXPIRED',
        },
        selector,
    );
}

export async function handleForgotToCheckout(requestId) {
    let request = await models.sittingRequest.findOne({
        where: {
            id: requestId,
            status: 'ONGOING',
        },
    });
    console.log('Duong: handleForgotToCheckout -> request', request);

    if (request) {
        await models.sittingRequest.update(
            {
                status: 'DONE_UNCONFIMRED',
            },
            {
                where: {
                    id: requestId,
                },
            },
        );

        notifyForgotToCheckoutParent(requestId);
        notifyForgotToCheckoutSitter(request.acceptedBabysitter, requestId);
    }
}

async function notifyForgotToCheckoutParent(requestId) {
    models.sittingRequest
        .findOne({
            where: {
                id: requestId,
            },
            include: [
                {
                    model: models.user,
                    as: 'user',
                    include: [
                        {
                            model: models.tracking,
                            as: 'tracking',
                        },
                    ],
                },
            ],
        })
        .then((request) => {
            if (request) {
                if (request.user.tracking != null) {
                    try {
                        const notification = {
                            id: request.id,
                            pushToken: request.user.tracking.token,
                            message:
                                noticeMessages.sitterForgotToCheckout_Parent,
                            title: noticeMessages.titleForgotCheckout,
                            option: {
                                showConfirm: false,
                                textConfirm: '',
                                showCancel: true,
                                textCancel: 'Đóng',
                            },
                        };
                        sendSingleMessage(notification);
                    } catch (error) {}
                }
            }
        });
}

async function notifyForgotToCheckoutSitter(sitterId, requestId) {
    models.invitation
        .findOne({
            where: {
                receiver: sitterId,
                requestId: requestId,
            },
            include: [
                {
                    model: models.user,
                    as: 'user',
                    include: [
                        {
                            model: models.tracking,
                            as: 'tracking',
                        },
                    ],
                },
            ],
        })
        .then((invitation) => {
            if (invitation) {
                if (invitation.user.tracking != null) {
                    try {
                        const notification = {
                            id: invitation.id,
                            pushToken: invitation.user.tracking.token,
                            message:
                                noticeMessages.sitterForgotToCheckout_Sitter,
                            title: noticeMessages.titleForgotCheckout,
                            option: {
                                showConfirm: false,
                                textConfirm: '',
                                showCancel: true,
                                textCancel: 'Đóng',
                            },
                        };
                        sendSingleMessage(notification);
                    } catch (error) {}
                }
            }
        });
}

export async function checkForSittingTime(request) {
    if (request.id > 0) {
        throw new Error('Request already created.');
    }

    let overlapRequests = [];

    try {
        if (request.createdUser) {
            const result = await models.sittingRequest.findAll({
                where: {
                    createdUser: request.createdUser,
                    sittingDate: request.sittingDate,
                    status: {
                        [Op.or]: ['PENDING', 'CONFIRMED', 'ONGOING'],
                    },
                },
            });

            if (result) {
                result.forEach((oldReq) => {
                    if (checkRequestTime(oldReq, request)) {
                        overlapRequests.push(oldReq);
                    }
                });
            }
        }

        return overlapRequests;
    } catch (error) {
        console.log('Duong: checkForSittingTime -> error', error);
    }
}

export async function handleNotCheckingIn(requestId) {
    let request = await models.sittingRequest.findOne({
        where: {
            id: requestId,
            status: 'CONFIRMED',
        },
    });

    if (request) {
        await models.sittingRequest.update(
            {
                status: 'SITTER_NOT_CHECKIN',
            },
            {
                where: {
                    id: requestId,
                },
            },
        );

        notifyParentCheckin(requestId);
        notifyBabysitterCheckin(request.acceptedBabysitter, requestId);
    }
}

async function notifyParentCheckin(requestId) {
    models.sittingRequest
        .findOne({
            where: {
                id: requestId,
            },
            include: [
                {
                    model: models.user,
                    as: 'user',
                    include: [
                        {
                            model: models.tracking,
                            as: 'tracking',
                        },
                    ],
                },
            ],
        })
        .then((request) => {
            if (request) {
                if (request.user.tracking != null) {
                    try {
                        const notification = {
                            id: request.id,
                            pushToken: request.user.tracking.token,
                            message: noticeMessages.sitterNotCheckin_Parent,
                            title: noticeMessages.titleNotCheckin,
                            option: {
                                showConfirm: false,
                                textConfirm: '',
                                showCancel: true,
                                textCancel: 'Đóng',
                            },
                        };
                        sendSingleMessage(notification);
                    } catch (error) {}
                }
            }
        });
}

async function notifyBabysitterCheckin(sitterId, requestId) {
    models.invitation
        .findOne({
            where: {
                receiver: sitterId,
                requestId: requestId,
            },
            include: [
                {
                    model: models.user,
                    as: 'user',
                    include: [
                        {
                            model: models.tracking,
                            as: 'tracking',
                        },
                    ],
                },
            ],
        })
        .then((invitation) => {
            if (invitation) {
                if (invitation.user.tracking != null) {
                    try {
                        const notification = {
                            id: invitation.id,
                            pushToken: invitation.user.tracking.token,
                            message: noticeMessages.sitterNotCheckin_Sitter,
                            title: noticeMessages.titleNotCheckin,
                            option: {
                                showConfirm: false,
                                textConfirm: '',
                                showCancel: true,
                                textCancel: 'Đóng',
                            },
                        };
                        sendSingleMessage(notification);
                    } catch (error) {}
                }
            }
        });
}

export async function handleRequestExpired(requestId) {
    let request = await models.sittingRequest.findOne({
        where: {
            id: requestId,
            status: 'PENDING',
        },
        include: [
            {
                model: models.user,
                as: 'user',
                include: [
                    {
                        model: models.tracking,
                        as: 'tracking',
                    },
                ],
            },
        ],
    });

    if (request) {
        await models.sittingRequest
            .update(
                {
                    status: 'EXPIRED',
                },
                {
                    where: {
                        id: requestId,
                    },
                },
            )
            .then((result) => {
                notifyRequestExpired(request);
                expireInvitations(request.id);
            })
            .then((error) => {});
    }
}

/**
 *
 * @param  {} requestId
 * @param  {} scheduleTime
 */
function notifyRequestExpired(request) {
    if (request) {
        if (request.user.tracking != null) {
            try {
                const notification = {
                    id: request.id,
                    pushToken: request.user.tracking.token,
                    message: noticeMessages.parentRequestExpired,
                    title: noticeMessages.titleRequestExpired,
                    option: {
                        showConfirm: false,
                        textConfirm: '',
                        showCancel: true,
                        textCancel: 'Đóng',
                    },
                };
                sendSingleMessage(notification);
            } catch (error) {}
        }
    }
}
