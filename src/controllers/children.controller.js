import models from '@models';

const list = async (req, res, next) => {
    const listChild = await models.children.findAll();
    res.send(listChild);
};

const create = async (req, res) => {
  let newChild = req.body;

  try {
      const createdChild = await models.children.create(newChild);
      res.send(createdChild);
  } catch (err) {
      res.status(400);
      res.send(err);
  }
};

const destroy = async (req, res) => {
    const id = req.params.id;
    const test = {ok: 'oke'}

    try {
        const child = await models.children.destroy({
            where: {
                id,
            },
        });
        res.status(204);
        res.send(test);
    } catch (err) {
        res.status(422);
        res.send(err);
    }
};

export default { list, create, destroy };
