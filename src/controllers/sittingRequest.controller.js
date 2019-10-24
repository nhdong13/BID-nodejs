import models from '@models';
import { matching } from '@services/matchingService';
import { recommendToParent } from '@services/recommendService';
import { testSocketIo } from '@utils/socketIo';

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
    let listMatched = [];
    let recommendList = [];

    try {
        const request = await models.sittingRequest.findOne({
            where: {
                id: requestId,
            },
        });

        console.time('--matching');
        if (request != null && request != undefined) {
            listMatched = await matching(request);
        }
        console.timeEnd('--matching');
        console.time('--recommend');
        if (listMatched != null && listMatched != undefined) {
            recommendList = await recommendToParent(request, listMatched);
        }
        console.timeEnd('--recommend');
        console.time('--remove duplicate');
        if (recommendList.length > 0) {
            recommendList.forEach((recommendSitter) => {
                listMatched = listMatched.filter(
                    (matchedSitter) =>
                        !(matchedSitter.userId == recommendSitter.userId),
                );
            });
        }
        console.timeEnd('--remove duplicate');
        res.send({
            matchedCount: listMatched.length,
            listMatched,
            recommendCount: recommendList.length,
            recommendList,
        });
    } catch (err) {
        console.log(err);
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
                // then update other invitation status
                let selector = {
                    where: {
                        requestId: requestId,
                        receiver: {
                            [Sequelize.Op.ne]: sitterId,
                        },
                    },
                };
                let a = await models.invitation.update(
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
        res.send();
    } catch (err) {
        console.log(err);
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
};
