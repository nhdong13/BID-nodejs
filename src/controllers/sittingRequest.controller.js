import models from '@models';
import { matching } from '@services/matchingService';
import { recommendToParent } from '@services/recommendService';
import { sendSingleMessage } from '@utils/pushNotification';
import { invitationMessages } from '@utils/notificationMessages';
import { testSocketIo } from '@utils/socketIo';
import { checkCheckInStatus, checkCheckOutStatus } from '@utils/common';
import { getScheduleTime, checkBabysitterSchedule } from '@utils/schedule';

const Sequelize = require('sequelize');

const list = async (req, res, next) => {
    try {
        const listSittings = await models.sittingRequest.findAll({});
        testSocketIo();
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
        testSocketIo();
        res.send(listSittings);
    } catch (err) {
        res.status(400);
        res.send(err);
    }
};

const listByParentId = async (req, res, next) => {
    const parentId = req.body.userId;

    try {
        const listSittings = await models.sittingRequest.findAll({
            where: {
                createdUser: parentId,
            },
        });
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

    try {
        const request = await models.sittingRequest.findOne({
            where: {
                id: requestId,
            },
        });
        if (request) {
            let available = await checkBabysitterSchedule(sitterId, request);
            if (!available) {
                res.status(409);
                res.send(
                    'this babysitter is not available for this sitting request.',
                );
                return;
            }
        }

        if (request) {
            // update sitting request
            await models.sittingRequest
                .update(
                    { status: 'CONFIRMED', acceptedBabysitter: sitterId },
                    {
                        where: {
                            id: requestId,
                        },
                    },
                )
                .then(async function(res) {
                    // update the accepted babysitter's invitation status to CONFIRMED
                    let selector = {
                        where: {
                            requestId: requestId,
                            receiver: sitterId,
                        },
                    };
                    await models.invitation.update(
                        {
                            status: 'CONFIRMED',
                        },
                        selector,
                    );

                    // create a schedule for the accepted babysitter'schedules
                    let scheduleTime = getScheduleTime(request);
                    let schedule = {
                        userId: sitterId,
                        scheduleTime: scheduleTime,
                        type: 'UNAVAILABLE',
                    };
                    await models.schedule.create(schedule);

                    // notify the accepted babysitter
                    const invitation = await models.invitation.findOne({
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
                    });
                    const notification = {
                        id: invitation.id,
                        pushToken: invitation.user.tracking.token,
                        message: invitationMessages.parentAcceptedBabysitter,
                    };

                    sendSingleMessage(notification);

                    // then update other babysitter's invitation status to EXPIRED
                    selector = {
                        where: {
                            requestId: requestId,
                            receiver: {
                                [Sequelize.Op.ne]: sitterId,
                            },
                        },
                    };
                    await models.invitation.update(
                        {
                            status: 'EXPIRED',
                        },
                        selector,
                    );

                    //
                    selector = {
                        where: {
                            requestId: requestId,
                            receiver: sitterId,
                        },
                    };
                    await models.invitation.update(
                        {
                            status: 'CONFIRMED',
                        },
                        selector,
                    );
                });
        }
        res.send();
    } catch (err) {
        res.status(400);
        res.send(err);
    }
};

const startSittingRequest = async (req, res, next) => {
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
            request.status == 'CONFIRMED'
        ) {
            // update sitting request
            request = await models.sittingRequest.update(
                { status: 'ONGOING' },
                {
                    where: {
                        id: requestId,
                    },
                },
            );
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
            request = await models.sittingRequest.update(
                { status: 'DONE' },
                {
                    where: {
                        id: requestId,
                    },
                },
            );
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
    newItem.status = 'PENDING';

    try {
        const newSittingReq = await models.sittingRequest.create(newItem);
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
            console.log('Duong: read -> canCheckIn', canCheckIn);
            const canCheckOut = checkCheckOutStatus(sittingReq);
            console.log('Duong: read -> canCheckOut', canCheckOut);

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
        res.send();
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

export default {
    listByParentId,
    listByParentAndStatus,
    listMatchedBabysitter,
    listSittingByBabysitterId,
    recommendBabysitter,
    acceptBabysitter,
    startSittingRequest,
    doneSittingRequest,
    list,
    create,
    read,
    update,
    destroy,
    listForWeb,
};
