import models from '@models';

const list = async (req, res, next) => {
    try {
        const list = await models.pricing.findAll({});
        res.send(list);
    } catch (err) {
        res.status(400);
        res.send(err);
    }
};

const create = async (req, res) => {
    let newItem = req.body;

    try {
        const newConPricing = await models.pricing.create(newItem);
        res.send(newConPricing);
    } catch (err) {
        res.status(400);
        res.send(err);
    }
};

const read = async (req, res) => {
    let id = req.params.id;

    try {
        const result = await models.pricing.findOne({
            where: {
                id
            }
        });
        res.send(result);
    } catch (err) {
        res.status(400);
        res.send(err);
    }
};

const update = async (req, res) => {
    const id = req.params.id;

    const updatingPricing = req.body;

    try {
        await models.pricing.update(updatingPricing, {
            where: {
                id: id,
            },
        });

        res.send(updatingPricing);
    } catch (err) {
        res.status(422);
        res.send(err);
    }
};

const destroy = async (req, res) => {
    const id = req.params.id;

    try {
        await models.pricing.destroy({
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
    create,
    read,
    update,
    destroy,
};
