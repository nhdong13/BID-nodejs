import models from "@models";
import { hashPassword } from "@utils/hash";

const list = async (req, res, next) => {
    const listParents = await models.parent.findAll();
    res.send(listParents);
};

const create = async (req, res) => {
    const userData = req.body;
    const newUser = {
        phoneNumber: userData.phoneNumber,
        email: userData.email,
        password: userData.password,
        nickname: userData.nickname,
        address: userData.address,
        roleId: userData.roleId,
    };

    try {
        // Create user first
        newUser.password = await await hashPassword(newUser.password)

        const newParent = await models.user.create(newUser).then(async res => {
            const newItem = {
                userId: res.id,
                childrenNumber: userData.childrenNumber,
                familyDescription: userData.familyDescription,
            }

            const newParent = await models.parent.create(newItem);
            return newParent;
        });
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
                userId: id
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
    create,
    read,
    update,
    destroy
};
