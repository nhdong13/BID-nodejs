import models from '@models';
import { matching } from '@services/matchingService';
import { recommendToParent } from '@services/recommendService';
import { sendSingleMessage } from '@utils/pushNotification';
import { invitationMessages, titleMessages } from '@utils/notificationMessages';
import { testSocketIo } from '@utils/socketIo';
import { checkCheckInStatus, checkCheckOutStatus } from '@utils/common';
import {
    getScheduleTime,
    checkBabysitterSchedule,
    checkRequestTime,
} from '@utils/schedule';
import {
    createReminder,
    createCheckoutPoint,
} from '@services/schedulerService';
import { acceptSitter } from '@services/sittingRequestService';
import Sequelize from 'sequelize';

import env, { checkEnvLoaded } from '@utils/env';

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

// const Sequelize = require('sequelize');

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
const acceptBabysitter = (req, res, next) => {
    const requestId = req.params.requestId;
    const sitterId = req.params.sitterId;

    try {
        acceptSitter(requestId, sitterId)
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
                    },
                    {
                        where: {
                            id: unfinishedRequest.id,
                        },
                    },
                );
            }

            // update sitting request
            request = await models.sittingRequest.update(
                { status: 'ONGOING' },
                {
                    where: {
                        id: requestId,
                    },
                },
            );

            if (request) {
                let schedule = await models.schedule.findOne({
                    where: {
                        requestId: requestId,
                        userId: sitterId,
                    },
                });

                if (schedule) {
                    createCheckoutPoint(requestId, schedule.scheduleTime);
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
