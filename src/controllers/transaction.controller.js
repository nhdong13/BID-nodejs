import models from '@models';

const list = async (req, res, next) => {
    const listTransactions = await models.transaction.findAll();
    res.send(listTransactions);
};

const create = async (req, res) => {
    const newTransaction = req.body;

    try {
        const newTransactionReq = await models.transaction.create(
            newTransaction,
        );
        res.send(newTransactionReq);
    } catch (err) {
        res.status(400);
        res.send(err);
    }
};

const read = async (req, res) => {
    const requestId = req.params.id;
    try {
        const transaction = await models.transaction.findOne({
            where: {
                requestId,
            },
        });
        if (transaction) {
            res.status(201);
            res.send(transaction);
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
