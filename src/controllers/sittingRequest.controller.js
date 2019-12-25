import models from '@models';
import { matching } from '@services/matchingService';
import { recommendToParent } from '@services/recommendService';
import {
    cancelMessages,
    titleMessages,
    invitationMessages,
} from '@utils/notificationMessages';
import { reload } from '@utils/socketIo';
import {
    sendNotificationWithSocket,
    sendMessage,
} from '@utils/pushNotification';
import {
    checkCheckInStatus,
    checkCheckOutStatus,
    checkTime,
} from '@utils/common';
import Scheduler from '@services/schedulerService';
import {
    acceptSitter,
    checkForSittingTime,
} from '@services/sittingRequestService';
import moment from 'moment';

const stripe = require('stripe')('sk_test_ZW2xmoQCisq5XvosIf4zW2aU00GaOtz9q3');

const list = async (req, res, next) => {
    try {
        const listSittings = await models.sittingRequest.findAll({
            include: [
                {
                    model: models.invitation,
                    include: [
                        {
                            model: models.user,
                            as: 'user',
                        },
                    ],
                },
                {
                    model: models.user,
                    as: 'user',
                },
                {
                    model: models.user,
                    as: 'bsitter',
                },
            ],
        });
        res.send(listSittings);
    } catch (err) {
        res.status(400);
        res.send(err);
    }
};

const listForWeb = async (req, res, next) => {
    try {
        const listSittings = await models.sittingRequest.findAll({
            include: [
                {
                    model: models.user,
                    as: 'user',
                    attributes: ['nickname'],
                },
                {
                    model: models.user,
                    as: 'bsitter',
                    attributes: ['nickname'],
                },
            ],
        });
        res.send(listSittings);
    } catch (err) {
        res.status(400);
        res.send(err);
    }
};

const listByParentId = async (req, res, next) => {
    const parentId = req.body.userId;

    const notification = {
        userId: parentId,
        notificationMessage: cancelMessages.parentCancel,
        title: titleMessages.parentCancel,
    };

    try {
        const listSittings = await models.sittingRequest.findAll({
            where: {
                createdUser: parentId,
            },
        });
        // sendNotificationWithSocket(notification);
        res.send(listSittings);
    } catch (err) {
        res.status(400);
        res.send(err);
    }
};

const listByParentAndStatus = async (req, res, next) => {
    const parentId = req.body.userId;
    const status = req.body.status;

    try {
        const listSittings = await models.sittingRequest.findAll({
            where: {
                createdUser: parentId,
                status: status,
            },
            include: [
                {
                    model: models.user,
                    as: 'user',
                },
                {
                    model: models.user,
                    as: 'bsitter',
                },
            ],
        });
        res.send(listSittings);
    } catch (err) {
        res.status(400);
        res.send(err);
    }
};

const listSittingByBabysitterId = async (req, res, next) => {
    const bsId = req.body.bsId;

    try {
        const listSittings = await models.sittingRequest.findAll({
            where: {
                acceptedBabysitter: bsId,
            },
            include: [
                {
                    model: models.user,
                    as: 'user',
                },
            ],
        });
        res.send(listSittings);
    } catch (err) {
        res.status(400);
        res.send(err);
    }
};

// get a list of matched babysitter of a request
const listMatchedBabysitter = async (req, res, next) => {
    const id = req.body.id;
    try {
        const request = await models.sittingRequest.findOne({
            where: {
                id,
            },
        });
        const matchedList = await matching(request);
        console.log(matchedList);
        s;
        res.send(matchedList);
    } catch (err) {
        console.log(err);
        res.status(400);
        res.send(err);
    }
};

// recommend babysitter
const recommendBabysitter = async (req, res, next) => {
    const requestId = req.params.id;
    let request = req.body;
    let listMatched = [];
    let recommendList = [];

    try {
        // find by id
        if (requestId !== undefined && requestId !== null && requestId > 0) {
            request = await models.sittingRequest.findOne({
                where: {
                    id: requestId,
                },
            });
        }

        // matching
        if (request != null && request != undefined) {
            listMatched = await matching(request);
        }
        // recommending
        if (listMatched != null && listMatched != undefined) {
            recommendList = await recommendToParent(request, listMatched);
        }
        // find different between recommended and matched
        if (recommendList.length > 0) {
            recommendList.forEach((recommendSitter) => {
                listMatched = listMatched.filter(
                    (matchedSitter) =>
                        !(matchedSitter.userId == recommendSitter.userId),
                );
            });
        }

        // response
        res.send({
            matchedCount: listMatched.length,
            listMatched,
            recommendCount: recommendList.length,
            recommendList,
        });
    } catch (err) {
        res.status(400);
        res.send(err);
    }
};

//
const acceptBabysitter = async (req, res, next) => {
    const requestId = req.params.requestId;
    const sitterId = req.params.sitterId;
    const distance = req.params.distance;

    try {
        await acceptSitter(requestId, sitterId, distance)
            .then((result) => {
                res.send(result);
            })
            .catch((error) => {
                if (error.message == 'OVERLAP') {
                    res.status(409);
                    res.send(sitterId);
                }
            });
    } catch (err) {
        res.status(400);
        res.send(err);
    }
};

const startSittingRequest = async (req, res, next) => {
    const requestId = req.params.requestId;
    const sitterId = req.params.sitterId;

    try {
        let request = await models.sittingRequest.findOne({
            where: {
                id: requestId,
                acceptedBabysitter: sitterId,
            },
        });

        if (
            request != undefined &&
            request != null &&
            request.status == 'CONFIRMED'
        ) {
            // if there are requests that started but haven't check out then change their status to 'DONE_BY_NEWSTART'
            const unfinishedRequest = await models.sittingRequest.findOne({
                where: {
                    acceptedBabysitter: sitterId,
                    status: 'ONGOING',
                },
            });

            if (unfinishedRequest != undefined && unfinishedRequest != null) {
                models.sittingRequest.update(
                    {
                        status: 'DONE_BY_NEWSTART',
                        checkoutTime: new moment(),
                    },
                    {
                        where: {
                            id: unfinishedRequest.id,
                        },
                    },
                );
            }

            // update sitting request
            let updated = await request.update({
                status: 'ONGOING',
                checkinTime: new moment(),
            });

            if (updated) {
                let schedule = await models.schedule.findOne({
                    where: {
                        requestId: requestId,
                        userId: sitterId,
                    },
                });

                if (schedule) {
                    Scheduler.createCheckoutPoint(
                        requestId,
                        schedule.scheduleTime,
                    );
                }
            }
        }

        res.send(request);
    } catch (err) {
        console.log(err);
        res.status(400);
        res.send(err);
    }
};

const doneSittingRequest = async (req, res, next) => {
    const requestId = req.params.requestId;
    const sitterId = req.params.sitterId;

    try {
        const request = await models.sittingRequest.findOne({
            where: {
                id: requestId,
                acceptedBabysitter: sitterId,
            },
        });

        if (
            (request != undefined) & (request != null) &&
            request.status == 'ONGOING'
        ) {
            // update sitting request
            let updated = await models.sittingRequest.update(
                { status: 'DONE', checkoutTime: new moment() },
                {
                    where: {
                        id: requestId,
                    },
                },
            );

            if (updated) {
                let schedule = await models.schedule.findOne({
                    where: {
                        requestId: requestId,
                        userId: sitterId,
                    },
                });

                if (schedule) {
                    await schedule.update({
                        type: 'DONE',
                    });
                }
            }
        }

        res.send(request);
    } catch (err) {
        console.log(err);
        res.status(400);
        res.send(err);
    }
};

const create = async (req, res) => {
    let newItem = req.body;
    // initial status is PENDING

    try {
        newItem.status = 'PENDING';
        const newSittingReq = await models.sittingRequest.create(newItem);
        // ghi charge vao transaction
        res.send(newSittingReq);
    } catch (err) {
        res.status(400);
        res.send(err);
    }
};

const read = async (req, res) => {
    const id = req.params.id;

    try {
        const sittingReq = await models.sittingRequest.findOne({
            where: {
                id,
            },
            include: [
                {
                    model: models.user,
                    as: 'user',
                },
                {
                    model: models.user,
                    as: 'bsitter',
                },
            ],
        });

        if (sittingReq) {
            // check if this request can check in or check out or not
            const canCheckIn = checkCheckInStatus(sittingReq);
            const canCheckOut = checkCheckOutStatus(sittingReq);

            sittingReq.canCheckIn = canCheckIn;
            sittingReq.canCheckOut = canCheckOut;

            res.status(201);
            res.send(sittingReq);
        } else {
            res.status(404);
            res.send();
        }
    } catch (err) {
        res.status(400);
        res.send(err);
    }
};

const update = async (req, res) => {
    const id = req.params.id;

    const updatingSittingReq = req.body;

    try {
        await models.sittingRequest.update(updatingSittingReq, {
            where: { id },
        });
        res.send(updatingSittingReq);
    } catch (err) {
        res.status(422);
        res.send(err);
    }
};

const destroy = async (req, res) => {
    const id = req.params.id;

    try {
        await models.sittingRequest.destroy({
            where: {
                id,
            },
        });
        res.status(204);
        res.send();
    } catch (err) {
        res.status(422);
        res.send(err);
    }
};

const cancelSittingRequest = async (req, res) => {
    const { requestId: id, status, chargeId, amount } = req.body;

    try {
        // make refund request
        const { refundPercentage } = await models.configuration.findOne();

        if (status == 'PENDING' || chargeId == 0) {
            const updatingSittingReq = {
                id,
                status: 'CANCELED',
            };

            const cancel = await models.sittingRequest
                .update(updatingSittingReq, {
                    where: { id },
                })
                .then(async (response) => {
                    //cancel tat ca loi moi
                    const invitations = await models.invitation.findAll({
                        where: { requestId: id },
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

                    if (invitations) {
                        const updateInvitation = {
                            status: 'PARENT_CANCELED',
                        };

                        await invitations.forEach(async (invitation) => {
                            await models.invitation.update(updateInvitation, {
                                where: { requestId: id },
                            });

                            const token = invitation.user.tracking.token;
                            if (token) {
                                const message = {
                                    to: token,
                                    sound: 'default',
                                    body: cancelMessages.parentCancel,
                                    data: {
                                        id: invitation.id,
                                        message: cancelMessages.parentCancel,
                                        title: titleMessages.parentCancel,
                                        option: {
                                            showConfirm: true,
                                            textConfirm: 'Tiếp tục',
                                            showCancel: true,
                                            textCancel: 'Ẩn',
                                        },
                                    },
                                };
                                console.log(
                                    'PHUC: cancelSittingRequest -> message',
                                    message,
                                );
                                // xu ly notification o day
                                sendMessage(message);
                            }
                        });

                        // reload(notification);
                        res.status(200);
                        res.send({ message: 'Cancel successfully' });
                    }
                })
                .catch((error) =>
                    console.log(
                        'error in sittingRequestController -> cancelRequest ' +
                            error,
                    ),
                );
        } else {
            const updatingSittingReq = {
                id,
                status,
            };

            await models.sittingRequest
                .update(updatingSittingReq, {
                    where: { id },
                })
                .then(async (response) => {
                    //change status of all the invitation
                    const invitations = await models.invitation.findAll({
                        where: { requestId: id },
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
                    if (invitations) {
                        const updateInvitation = {
                            status: 'PARENT_CANCELED',
                        };
                        invitations.forEach(async (invitation) => {
                            await models.invitation.update(updateInvitation, {
                                where: { requestId: id },
                            });

                            if (token) {
                                const message = {
                                    to: token,
                                    sound: 'default',
                                    body: cancelMessages.parentCancel,
                                    data: {
                                        id: invitation.id,
                                        message: cancelMessages.parentCancel,
                                        title: titleMessages.parentCancel,
                                        option: {
                                            showConfirm: true,
                                            textConfirm: 'Tiếp tục',
                                            showCancel: true,
                                            textCancel: 'Ẩn',
                                        },
                                    },
                                };
                                console.log(
                                    'PHUC: cancelSittingRequest -> message',
                                    message,
                                );
                                // xu ly notification o day
                                sendMessage(message);
                            }
                        });
                    }
                    const updatingTransaction = {
                        type: 'REFUND',
                        description: 'requested_by_customer',
                        amount: parseInt(
                            (amount * refundPercentage) / 100,
                            10 || parseInt((amount * 90) / 1000),
                        ),
                    };

                    const schedule = await models.schedule.findOne({
                        where: {
                            requestId: id,
                        },
                    });

                    if (schedule) {
                        await schedule.update({
                            type: 'AVAILABLE',
                        });
                    }

                    await models.transaction
                        .update(updatingTransaction, {
                            where: { chargeId },
                        })
                        .then(async (response) => {
                            console.log(
                                'response after change status in transaction ',
                                response,
                            );
                            const refund = await stripe.refunds.create({
                                charge: chargeId,
                                amount: parseInt(
                                    (amount * refundPercentage) / 100,
                                    10 || parseInt((amount * 90) / 1000),
                                ),
                                reason: 'requested_by_customer',
                            });
                            console.log(
                                'PHUC: cancelSittingRequest -> refund',
                                refund.amount,
                            );

                            if (refund.status == 'succeeded') {
                                // update status "CANCEL" to invitation
                                const notification = {
                                    notificationMessage:
                                        cancelMessages.parentCancel,
                                    title: titleMessages.parentCancel,
                                };
                                reload(notification);
                                res.status(200);
                                res.send(refund);
                            }
                        })
                        .catch((error) =>
                            console.log(
                                'error in sittingRequestController -> cancelRequest ' +
                                    error,
                            ),
                        );
                })
                .catch((error) =>
                    console.log(
                        'error in sittingRequestController -> cancelRequest ' +
                            error,
                    ),
                );
        }

        // update the refund amount
    } catch (error) {
        res.status(400);
        res.send(error);
    }
};

const getOverlapRequests = async (req, res) => {
    const request = req.body;
    try {
        let overlapRequests = [];

        if (checkTime(request)) {
            // check for sitting time in the past
            if (request) {
                overlapRequests = await checkForSittingTime(request); // check for overlapt request
            } else {
                throw new Error('Sitting request is null');
            }
        }

        res.send(overlapRequests);
    } catch (error) {
        if (error.message == 'Date time in the past.') {
            res.status(409);
            res.send(error);
        } else {
            res.status(400);
            res.send(error);
        }
    }
};

export default {
    listByParentId,
    listByParentAndStatus,
    listMatchedBabysitter,
    listSittingByBabysitterId,
    recommendBabysitter,
    acceptBabysitter,
    startSittingRequest,
    doneSittingRequest,
    cancelSittingRequest,
    getOverlapRequests,
    list,
    create,
    read,
    update,
    destroy,
    listForWeb,
};
