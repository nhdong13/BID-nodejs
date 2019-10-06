import models from "@models";

const listByParentId = async (req, res, next) => {
    const parentId = req.body.userId;

    const listSittings = await models.sittingRequest.findAll({
        where: {
            createdUser: parentId,
        }
    });
    res.send(listSittings);
};

const listParentAndStatus = async (req, res, next) => {
    const parentId = req.body.userId;
    const status = req.body.status;

    const listSittings = await models.sittingRequest.findAll({
        where: {
            createdUser: parentId,
            status: status,
        }
    });
    res.send(listSittings);
}

const create = async (req, res) => {
    const newItem = req.body;

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
                id
            }
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
            where: { id }
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

export default { listByParentId, listParentAndStatus, create, read, update, destroy };
