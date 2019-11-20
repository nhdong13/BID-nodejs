import models from '@models';
import userController from './user.controller';
import { sendSingleMessage } from '@utils/pushNotification';
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
    // registerPushNotifications(userId).then((response) => {
    //     if (response) {
    //         console.log(
    //             'PHUC: HomeScreen -> registerPushNotifications -> response',
    //             response.data,
    //         );
    //     }
    // });
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
    const newItem = JSON.parse(req.body.newInvite);
    const newRequestItem = JSON.parse(req.body.newRequest);
    console.log('PHUC: create -> newItem', newItem);
    try {
        let newRequest;
        if (requestId == undefined || requestId == null || requestId == 0) {
            newRequest = await models.sittingRequest.create(newRequestItem);
            if (newRequest) {
                Scheduler.createRequesExpiredPoint(newRequest);
                newItem.requestId = newRequest.id;
            }
        }
        const newInvitation = await models.invitation
            .create(newItem)
            .then(async (res) => {
                const tracking = await models.tracking.findOne({
                    where: {
                        userId: newItem.receiver,
                    },
                });

                if (tracking) {
                    console.log(
                        'PHUC: create -> invitations.user',
                        tracking.token,
                    );
                    const notification = {
                        id: res.id,
                        pushToken: tracking.token,
                        message: invitationMessages.parentSendInvitation,
                        title: titleMessages.parentSendInvitation,
                    };
                    console.log(
                        'PHUC: Invitation.controller -> create -> notification',
                        notification,
                    );
                    sendSingleMessage(notification);
                } else {
                    console.log(
                        'Duong: Invitation.controller create -> notification fail, tracking data not found',
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
                const notification = {
                    pushToken: invitation.sittingRequest.user.tracking.token,
                    message: invitationMessages.babysitterAccepted,
                    id: invitation.requestId,
                    title: titleMessages.babysitterAccepted,
                };

                sendSingleMessage(notification);
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
};
