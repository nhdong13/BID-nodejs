import models from '@models';
import userController from './user.controller';
import {
    sendSingleMessage,
    sendNotificationWithSocket,
} from '@utils/pushNotification';
import { invitationMessages, titleMessages } from '@utils/notificationMessages';
import Scheduler from '@services/schedulerService';

const list = async (req, res, next) => {
    var invitations = await models.invitation.findAll({
        include: [
            {
                model: models.sittingRequest,
                as: 'sittingRequest',
                include: [
                    {
                        model: models.user,
                        as: 'user',
                    },
                ],
            },
        ],
    });
    res.send(invitations);
};

//
const listByRequestAndStatus = async (req, res) => {
    const requestId = req.params.requestId;
    const status = req.params.status;

    var invitations = await models.invitation.findAll({
        where: {
            requestId: requestId,
            status: status,
        },
        include: [
            {
                model: models.user,
                as: 'user',
                include: [
                    {
                        model: models.babysitter,
                        as: 'babysitter',
                    },
                ],
            },
        ],
    });
    res.send(invitations);
};

const listAllRequestInvitation = async (req, res) => {
    const requestId = req.params.requestId;
    const status = req.params.status;

    var invitations = await models.invitation.findAll({
        where: {
            requestId: requestId,
        },
        include: [
            {
                model: models.user,
                as: 'user',
                include: [
                    {
                        model: models.babysitter,
                        as: 'babysitter',
                    },
                ],
            },
        ],
    });
    res.send(invitations);
};

const listInvitationBySitterId = async (req, res, next) => {
    const sitterId = req.body.id;
    var invitations = await models.invitation.findAll({
        where: {
            receiver: sitterId,
        },
        include: [
            {
                model: models.sittingRequest,
                as: 'sittingRequest',
                include: [
                    {
                        model: models.user,
                        as: 'user',
                    },
                ],
            },
        ],
    });
    res.send(invitations);
};

const create = async (req, res) => {
    const requestId = req.params.requestId;
    const invitation = req.body.invitation;
    const request = req.body.request;
    try {
        let newRequest;
        if (requestId == undefined || requestId == null || requestId == 0) {
            newRequest = await models.sittingRequest.create(request);
            if (newRequest) {
                Scheduler.createRequesExpiredPoint(newRequest);
                invitation.requestId = newRequest.id;
            }
        }
        const newInvitation = await models.invitation
            .create(invitation)
            .then(async (res) => {
                const tracking = await models.tracking.findOne({
                    where: {
                        userId: invitation.receiver,
                    },
                });

                if (tracking) {
                    if (request.repeatedRequestId) {
                        const notification = {
                            userId: invitation.receiver,
                            id: res.id,
                            pushToken: tracking.token,
                            message:
                                invitationMessages.parentSendRepeatedRequest,
                            title: titleMessages.parentSendRepeatedRequest,
                            option: {
                                showConfirm: true,
                                textConfirm: 'Tiếp tục',
                                showCancel: true,
                                textCancel: 'Ẩn',
                            },
                        };
                        sendSingleMessage(notification);
                        sendNotificationWithSocket(notification);
                    } else {
                        const notification = {
                            userId: invitation.receiver,
                            id: res.id,
                            pushToken: tracking.token,
                            message: invitationMessages.parentSendInvitation,
                            title: titleMessages.parentSendInvitation,
                            option: {
                                showConfirm: true,
                                textConfirm: 'Tiếp tục',
                                showCancel: true,
                                textCancel: 'Ẩn',
                            },
                        };
                        sendSingleMessage(notification);
                        sendNotificationWithSocket(notification);
                    }
                } else {
                    console.log(
                        'Duong: Invitation.controller create -> notification not send, tracking data not found',
                    );
                }
            });

        res.send({
            newInvitation: newInvitation,
            newRequest: newRequest,
        });
        console.log(
            'Duong: Invitation.controller create -> create invitation success',
        );
    } catch (err) {
        res.status(400);
        res.send(err);
        console.log('PHUC: create -> err', err);
    }
};

const getInvitation = async (req, res) => {
    const id = req.params.id;

    try {
        const invitation = await models.invitation.findOne({
            where: {
                id,
            },
            include: [
                {
                    model: models.sittingRequest,
                    as: 'sittingRequest',
                    include: [
                        {
                            model: models.user,
                            as: 'user',
                        },
                    ],
                },
            ],
        });
        if (invitation) {
            res.status(200);
            res.send(invitation);
        } else {
            res.status(204);
            res.send();
        }
    } catch (err) {
        res.status(400);
        res.send(err);
    }
};

const update = async (req, res) => {
    const id = req.params.id;

    let updatingInvitation = req.body;

    try {
        updatingInvitation = await models.invitation
            .update(updatingInvitation, {
                where: { id },
            })
            .then(async (result) => {
                const invitation = await models.invitation.findOne({
                    where: {
                        id: id,
                    },
                    include: [
                        {
                            model: models.sittingRequest,
                            as: 'sittingRequest',
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
                        },
                    ],
                });

                // notify the parent with the request
                if (updatingInvitation.status == 'ACCEPTED') {
                    const notification = {
                        userId: invitation.sittingRequest.user.id,
                        pushToken:
                            invitation.sittingRequest.user.tracking.token,
                        message: invitationMessages.babysitterAccepted,
                        id: invitation.requestId,
                        title: titleMessages.babysitterAccepted,
                        option: {
                            showConfirm: true,
                            textConfirm: 'Tiếp tục',
                            showCancel: true,
                            textCancel: 'Ẩn',
                        },
                    };
                    sendSingleMessage(notification);
                    sendNotificationWithSocket(notification);
                } else {
                    const notification = {
                        userId: invitation.sittingRequest.user.id,
                        pushToken:
                            invitation.sittingRequest.user.tracking.token,
                        message: invitationMessages.sitterDecline,
                        id: invitation.requestId,
                        title: titleMessages.sitterDecline,
                        option: {
                            showConfirm: true,
                            textConfirm: 'Tiếp tục',
                            showCancel: true,
                            textCancel: 'Ẩn',
                        },
                    };
                    sendSingleMessage(notification);
                    sendNotificationWithSocket(notification);
                }
            });
        res.send(updatingInvitation);
    } catch (err) {
        console.log(err);
        res.status(422);
        res.send(err);
    }
};

const destroy = async (req, res) => {
    const id = req.params.id;

    try {
        await models.invitation.destroy({
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

export default {
    list,
    create,
    getInvitation,
    update,
    destroy,
    listInvitationBySitterId,
    listByRequestAndStatus,
    listAllRequestInvitation,
};
