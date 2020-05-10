import models from "@models";

const create = async (req, res) => {
    let newItem = req.body;
    try {
        const newSisterSkill = await models.sitterSkill.create(newItem);
        res.send(newSisterSkill);
    } catch (err) {
        res.status(400);
        res.send(err);
    }
};

const terminate = async (req, res) => {
  let newItem = req.body;

  try {
      const isDes = await models.sitterSkill.destroy({
        where: {
          sitterId: newItem.sitterId,
          skillId: newItem.skillId
        }
      });
      res.status(204);
      res.send();
  } catch (err) {
      res.status(422);
      res.send(err);
  }
};

const destroy = async (req, res) => {
    const id = req.params.id;

    try {
        await models.circle.destroy({
            where: {
                id: id
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
    create,
    destroy,
    terminate
};
