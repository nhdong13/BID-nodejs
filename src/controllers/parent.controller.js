import models from "@models";
import {
    hashPassword
} from "@utils/hash";

const list = async (req, res, next) => {
    const listParents = await models.parent.findAll();
    res.send(listParents);
};

const getParentRequest = async (req, res, next) => {
    const sittingReqId = req.body.id;

    try {
        const request = await models.invitation.findAll({
            where: {
                id: 1,
            },
            include: [{
                model: models.babysitter,
                as: 'babysitter',
                
            }, {
                model: models.sittingRequest,
            }],
        });
        res.send(request);
    } catch (error) {
        console.log(error);
        res.status(400);
        res.send(error);
    }

};

const create = async (req, res) => {
    const newItem = req.body;

    try {
        // Hash password
        newItem.password = await hashPassword(newItem.password);

        const newParent = await models.parent.create(newItem);
        res.send(newParent);
    } catch (err) {
        res.status(400);
        res.send(err);
    }
};

const read = async (req, res) => {
    const id = req.params.id;

    try {
        const parent = await models.parent.findOne({
            where: {
                id
            }
        });
        if (parent) {
            res.status(201);
            res.send(parent);
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

    const updatingParent = req.body;

    try {
        await models.parent.update(updatingParent, {
            where: {
                id
            }
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
        await models.parent.destroy({
            where: {
                id
            }
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
    getParentRequest,
    create,
    read,
    update,
    destroy
};
