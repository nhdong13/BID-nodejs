import models from '@models';
import { hashPassword } from '@utils/hash';

const createCode = async (req, res) => {
    const userId = req.body.userId;
    const code = req.body.code;

    try {
        if (!code.match(/^[a-z0-9]+$/i)) {
            throw new Error('INVALID CODE');
        }
        const result = await models.parent.update(
            {
                parentCode: code,
            },
            {
                where: {
                    userId: userId,
                },
            },
        );

        res.send(result);
    } catch (error) {
        res.status(400);
        res.send(error);
    }
};

const findByCode = async (req, res) => {
    const userId = req.params.userId;
    const code = req.params.code;

    try {
        const parent = await models.parent.findOne({
            where: {
                parentCode: code
            },
            include: [{
                model: models.user,
                as: 'user'
            }]
        })

        if (parent) {
            const circle = await models.circle.findOne({
                where: {
                    ownerId: userId,
                    friendId: parent.userId,
                }
            })

            parent.isInvited = true;
        }

        res.send(parent);
    } catch (error) {
        res.status(400);
        res.send(error);
    }
}

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
        newUser.password = await hashPassword(newUser.password);

        const newParent = await models.user
            .create(newUser)
            .then(async (res) => {
                const newItem = {
                    userId: res.id,
                    childrenNumber: userData.childrenNumber,
                    familyDescription: userData.familyDescription,
                };

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
                userId: id,
            },
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
                id,
            },
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

export default {
    createCode,
    findByCode,
    list,
    create,
    read,
    update,
    destroy,
};
