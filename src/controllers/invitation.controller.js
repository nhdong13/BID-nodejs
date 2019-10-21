import models from '@models';
import userController from './user.controller';
import { sendSingleMessage } from '@utils/pushNotification';
import { invitationMessages } from '@utils/notificationMessages';

const list = async (req, res, next) => {
    console.log('PHUC: list -> invitations', invitations.user.tracking.token);
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
    const newItem = req.body;
    console.log('PHUC: create -> newItem', newItem);
    try {
        const newInvitation = await models.invitation
            .create(newItem)
            .then(async (res) => {
                const invitations = await models.invitation.findOne({
                    where: {
                        requestId: newItem.requestId,
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
                const notification = {
                    id: res.id,
                    pushToken: invitations.user.tracking.token,
                    message: invitationMessages.parentSendInvitation,
                };
                console.log(
                    'PHUC: Invitation.controller -> create -> notification',
                    notification,
                );
                sendSingleMessage(notification);
            });
        res.send(newInvitation);
    } catch (err) {
        res.status(400);
        res.send(err);
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
    console.log("Duong: update -> id", id)

    let updatingInvitation = req.body;
    console.log('Duong: update -> updatingInvitation', updatingInvitation);

    try {
        updatingInvitation = await models.invitation
            .update(updatingInvitation, {
                where: { id },
            })
            .then(async (result) => {
                console.log('Duong: update -> result', result);

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
									include: [{
										model: models.tracking,
										as: 'tracking',
									}]
                                },
                            ],
                        },
                    ],
                });
                console.log('Duong: update -> invitations', invitation);

                const notification = {
                    pushToken: invitation.sittingRequest.user.tracking.token,
                    message: invitationMessages.babysitterAccepted,
                    id: invitation.requestId,
                };
                console.log('Duong: update -> notification', notification);

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
