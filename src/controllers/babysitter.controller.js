import models from '@models';
import { hashPassword } from '@utils/hash';
import { checkSittingTime, dateInRange } from '@utils/common';

const list = async (req, res, next) => {
    const listSitters = await models.babysitter.findAll({
        where: {},
        include: [
            {
                model: models.user,
                as: 'user',
            },
        ],
    });
    res.status(200);
    res.send(listSitters);
};

const create = async (req, res) => {
    const newUser = req.body.user;
    const newSitter = req.body.sitter;

    try {
        // Create user first
        newUser.password = await hashPassword(newUser.password);

        const createdUser = await models.user
            .create(newUser)
            .then(async (res) => {
                let newTracking = {};
                const token = await models.tracking.create(newTracking);
                const createdSitter = await models.babysitter.create(newSitter);
                return newSitter;
            });
        res.send(createdSitter);
    } catch (err) {
        res.status(400);
        res.send(err);
    }
};

const readByRequest = async (req, res) => {
    const sitterId = req.params.sitterId;
    const requestId = req.params.requestId;

    try {
        const sitter = await models.babysitter.findOne({
            where: {
                userId: sitterId,
            },
            include: [
                {
                    model: models.user,
                    as: 'user',
                },
            ],
        });
        if (sitter) {
            await models.invitation
                .findOne({
                    where: {
                        requestId: requestId,
                        receiver: sitterId,
                    },
                })
                .then((result) => {
                    if (result != null) {
                        sitter.isInvited = true;
                    }
                    res.status(200);
                    res.send(sitter);
                });
        } else {
            res.status(404);
            res.send();
        }
    } catch (err) {
        res.status(400);
        res.send(err);
    }
};

const read = async (req, res) => {
    const id = req.params.id;

    try {
        const sitter = await models.babysitter.findOne({
            where: {
                userId: id,
            },
            include: [
                {
                    model: models.user,
                    as: 'user',
                },
            ],
        });
        if (sitter) {
            res.status(200);
            res.send(sitter);
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

    const updatingSitter = req.body;

    try {
        await models.babysitter.update(updatingSitter, {
            where: {
                userId: id,
            },
        });

        let pendingInvitations = await models.invitation.findAll({
            where: {
                receiver: id,
                status: 'PENDING',
            },
            include: {
                model: models.sittingRequest,
                as: 'sittingRequest',
            },
        });

        // Expiring invitations from sittingRequests that not suitable annymore because babysitter schedule changed
        if (pendingInvitations) {
            const promises = pendingInvitations.map(async (invite) => {
                if (
                    dateInRange(
                        invite.sittingRequest.sittingDate,
                        updatingSitter.weeklySchedule,
                    )
                ) {
                    if (
                        !checkSittingTime(
                            invite.sittingRequest.startTime,
                            invite.sittingRequest.endTime,
                            updatingSitter.daytime,
                            updatingSitter.evening,
                        )
                    ) {
                        await models.invitation.update(
                            {
                                status: 'EXPIRED',
                            },
                            {
                                where: {
                                    id: invite.id,
                                },
                            },
                        );
                    }
                } else {
                    await models.invitation.update(
                        {
                            status: 'EXPIRED',
                        },
                        {
                            where: {
                                id: invite.id,
                            },
                        },
                    );
                }
            });
            await Promise.all(promises);
        }

        res.send();
    } catch (err) {
        res.status(422);
        res.send(err);
    }
};

const destroy = async (req, res) => {
    const id = req.params.id;

    try {
        await models.babysitter.destroy({
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
    read,
    readByRequest,
    update,
    destroy,
};
