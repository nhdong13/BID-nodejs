import models from '@models';
import moment from 'moment';
import { createRepeatedSchedule } from 'services/schedulerService';

const list = async (req, res, next) => {
    const userId = req.params.id;
    console.log('PHUC: list -> userId', userId);
    try {
        const list = await models.repeatedRequest.findAll({
            where: {
                createdUser: userId,
            },
        });
        res.send(list);
    } catch (err) {
        res.status(400);
        res.send(err);
    }
};

const getRepeatedRequest = async (req, res, next) => {
    const requestId = req.params.id;
    console.log('PHUC: getRepeatedRequest -> requestId', requestId);

    try {
        const list = await models.sittingRequest.findAll({
            where: {
                id: requestId,
            },
            include: [
                {
                    model: models.repeatedRequest,
                    as: 'repeatedRequest',
                },
            ],
        });
        res.send(list);
    } catch (err) {
        res.status(400);
        res.send(err);
    }
};

const create = async (req, res) => {
    let newItem = req.body;

    try {
        const foundRepeated = await models.repeatedRequest.findOne({
            where: {
                startDate: newItem.startDate,
                startTime: newItem.startTime,
                endTime: newItem.endTime,
                sittingAddress: newItem.sittingAddress,
                createdUser: newItem.createdUser,
            },
        });
        if (foundRepeated) {
            res.send(foundRepeated);
        } else {
            const newRepeated = await models.repeatedRequest.create(newItem);
            res.send(newRepeated);
        }
    } catch (err) {
        console.log('PHUC: repeatedRequest -> create ', err);
        res.status(400);
        res.send(err);
    }
};

const read = async (req, res) => {
    let id = req.params.id;

    try {
        const result = await models.repeatedRequest.findOne({
            where: {
                id,
            },
        });
        res.send(result);
    } catch (err) {
        res.status(400);
        res.send(err);
    }
};

const update = async (req, res) => {
    const id = req.params.id;

    const updatingRepeated = req.body;

    try {
        await models.repeatedRequest.update(updatingRepeated, {
            where: {
                id: id,
            },
        });

        res.send(updatingRepeated);
    } catch (err) {
        res.status(422);
        res.send(err);
    }
};

const destroy = async (req, res) => {
    const id = req.params.id;

    try {
        await models.repeatedRequest.destroy({
            where: {
                id: id,
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
    getRepeatedRequest,
    create,
    read,
    update,
    destroy,
};
