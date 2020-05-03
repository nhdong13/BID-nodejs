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

export default { getAllSkills };
