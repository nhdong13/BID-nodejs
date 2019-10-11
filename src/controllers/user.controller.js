import models from "@models";
import { hashPassword } from "@utils/hash";

const list = async (req, res, next) => {
    const role = req.roleId;
    if (role === 2) {
        const listUsers = await models.user.findAll();
        res.send(listUsers);
    } else {
        res.status(401);
        res.send({ message: 'Unauthorized' });
    }
};

const create = async (req, res) => {
    const newItem = req.body;

    try {
        // Hash password
        newItem.password = await hashPassword(newItem.password);

        const newUser = await models.user.create(newItem);
        res.send(newUser);
    } catch (err) {
        res.status(400);
        res.send(err);
    }
};

const read = async (req, res) => {
    const id = req.params.id;

    try {
        const user = await models.user.findOne({
            where: {
                id
            }
        });
        if (user) {
            res.status(201);
            res.send(user);
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

    const updatingUser = req.body;

    try {
        await models.user.update(updatingUser, {
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
        await models.user.destroy({
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

export default { list, create, read, update, destroy };
