import models from '@models';

const list = async (req, res, next) => {
    const listTransactions = await models.transaction.findAll();
    res.send(listTransactions);
};

const create = async (req, res) => {
    const newItem = req.body;

    try {
        await models.transaction
            .findOrCreate({
                where: {
                    userId: newItem.userAgent.trim(),
                    token: newItem.token,
                },
                defaults: {
                    userId: newItem.userAgent.trim(),
                    token: newItem.token,
                },
            })
            .then((result) => {
                const created = result[1];
                if (!created) {
                    res.status(400);
                    res.send({ message: 'Token exist!!' });
                } else res.send(result);
            });
    } catch (err) {
        // console.log('PHUC: create -> err', err);
        res.status(400);
        res.send(err);
    }
};

const read = async (req, res) => {
    const id = req.params.id;
    try {
        const tracking = await models.transaction.findOne({
            where: {
                userId: id,
            },
        });
        if (tracking) {
            res.status(201);
            res.send(tracking);
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

    const updatingTransaction = req.body;

    try {
        await models.transaction.update(updatingTransaction, {
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
        await models.transaction.destroy({
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

export default { list, create, read, update, destroy };
