import models from "@models";

const getAllSkills = async (req, res) => {
    try {
        const listSkills = await models.skill.findAll({
            where: {
                active: true
            }
        });
        res.send(listSkills);
    } catch (error) {
        res.status(400);
        res.send(error);
    }
};

const create = async (req, res) => {
    const newItem = req.body;
    try {
        const newSkill = await models.skill.create(newItem);
        res.send(newSkill);
    } catch (err) {
        res.status(400);
        res.send(err);
    }
};

const update = async (req, res) => {
    const id = req.params.id;
    const updateSkill = req.body;

    try {
        await models.skill.update(updateSkill, {
            where: { id },
        });
        res.send(updateSkill);
    } catch (err) {
        res.status(422);
        res.send(err);
    }
};

const destroy = async (req, res) => {
    const id = req.params.id;

    try {
        const isDestroyed = await models.skill.destroy({
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

export default { getAllSkills, create, update, destroy };
