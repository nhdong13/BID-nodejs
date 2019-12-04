import models from '@models';

const list = async (req, res, next) => {
    try {
        const list = await models.holiday.findAll({});
        res.send(list);
    } catch (err) {
        res.status(400);
        res.send(err);
    }
};

const create = async (req, res) => {
    let newItem = req.body;

    try {
        const newHoliday = await models.holiday.create(newItem);
        res.send(newHoliday);
    } catch (err) {
        res.status(400);
        res.send(err);
    }
};

const read = async (req, res) => {
    let id = req.params.id;

    try {
        const result = await models.holiday.findOne({
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

    const updatingHoliday = req.body;

    try {
        await models.holiday.update(updatingHoliday, {
            where: {
                id: id,
            },
        });

        res.send(updatingHoliday);
    } catch (err) {
        res.status(422);
        res.send(err);
    }
};

const destroy = async (req, res) => {
    const id = req.params.id;

    try {
        await models.holiday.destroy({
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
