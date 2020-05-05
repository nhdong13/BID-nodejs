import models from "@models";
import { hashPassword } from "@utils/hash";

const list = async (req, res) => {
    // const role = req.roleId;
    // if (role === 2) {
    const listUsers = await models.user.findAll({
        include: [
            {
                model: models.parent,
                as: "parent",
                include: [
                    {
                        model: models.children,
                        as: "children"
                    }
                ]
            },
            {
                model: models.babysitter,
                as: 'babysitter',
            },
            {
                model: models.sitterSkill,
                as: 'sitterSkills',
            },
            {
                model: models.sitterCert,
                as: 'sitterCerts',
            },
        ],
    });
    res.send(listUsers);
    // } else {
    //     res.status(401);
    //     res.send({ message: 'Unauthorized' });
    // }
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
            },
            include: [
                {
                    model: models.parent,
                    as: "parent",
                    include: [
                        {
                            model: models.children,
                            as: "children"
                        }
                    ]
                },
                {
                    model: models.babysitter,
                    as: "babysitter"
                },
                {
                    model: models.sitterSkill,
                    as: "sitterSkills",
                    attributes: ["skillId"],
                    include: [
                        {
                            model: models.skill,
                            attributes: ["vname"]
                        }
                    ]
                },
                {
                    model: models.sitterCert,
                    as: "sitterCerts",
                    attributes: ["certId"],
                    include: [
                        {
                            model: models.cert,
                            attributes: ["vname"]
                        }
                    ]
                }
            ]
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
        res.send(updatingUser);
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

const createBsitter = async (req, res) => {
    let newItem = req.body;
    try {
        // Hash password
        newItem.password = await hashPassword(newItem.password);

        const newUser = await models.user.create(newItem).then(res => {
            newItem.userId = res.id;
            const newBabysitter = models.babysitter
                .create(newItem)
                .then(res => {});
        });
        res.send(newItem);
    } catch (err) {
        res.status(400);
        res.send(err);
    }
};
const createParent = async (req, res) => {
    let newItem = req.body;
    try {
        // Hash password
        newItem.password = await hashPassword(newItem.password);

        const newUser = await models.user.create(newItem).then(res => {
            newItem.userId = res.id;
            newItem.parentCode = "A" + res.id.toString();
            const newParent = models.parent.create(newItem).then(res => {
                let child = newItem.children;
                child.map(async element => {
                    element.parentId = await newItem.userId;
                    await models.children.create(element);
                });
            });
        });
        res.send(newItem);
    } catch (err) {
        console.log(err);
        res.status(400);
        res.send(err);
    }
};

export default {
    list,
    create,
    read,
    update,
    destroy,
    createBsitter,
    createParent
};
