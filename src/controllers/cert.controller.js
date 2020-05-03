import models from "@models";

const getAllCerts = async (req, res) => {
    try {
        const listCerts = await models.cert.findAll({
            where: {
                active: true,
            },
        });
        res.send(listCerts);
    } catch (error) {
        res.status(400);
        res.send(error);
    }
};

const getAll = async (req, res) => {
    try {
        const listCerts = await models.cert.findAll();
        res.send(listCerts);
    } catch (error) {
        res.status(400);
        res.send(error);
    }
};

const create = async (req, res) => {
    const newItem = req.body;
    try {
        const newCert = await models.cert.create(newItem);
        res.send(newCert);
    } catch (err) {
        res.status(400);
        res.send(err);
    }
};

const update = async (req, res) => {
    const id = req.params.id;
    const updateCert = req.body;

    try {
        await models.cert.update(updateCert, {
            where: { id },
        });
        res.send(id);
    } catch (err) {
        res.status(422);
        res.send(err);
    }
};

const destroy = async (req, res) => {
    const id = req.params.id;

    try {
        const isDestroyed = await models.cert.destroy({
            where: {
                id,
            },
        });
        res.status(204);
        res.send(isDestroyed);
    } catch (err) {
        res.status(422);
        res.send(err);
    }
};

export default { getAllCerts, create, update, destroy, getAll };
