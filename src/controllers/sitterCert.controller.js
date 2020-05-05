import models from "@models";

const create = async (req, res) => {
    let newItem = req.body;
    try {
        const newSisterCert = await models.sitterCert.create(newItem);
        res.send(newSisterCert);
    } catch (err) {
        res.status(400);
        res.send(err);
    }
};

const terminate = async (req, res) => {
  let newItem = req.body;

  try {
      const isDes = await models.sitterCert.destroy({
        where: {
          sitterId: newItem.sitterId,
          certId: newItem.certId
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
        await models.sitterCert.destroy({
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
