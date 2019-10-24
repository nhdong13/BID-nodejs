import models from "@models";

const Sequelize = require('sequelize');
const list = async (req, res, next) => {
    try {
        const list = await models.configuration.findAll({});
        res.send(list);
    } catch (err) {
        res.status(400);
        res.send(err);
    }
    
};

const create = async (req, res) => {
    let newItem = req.body;

    try {
        const newConfig = await models.configuration.create(newItem);
        res.send(newConfig);
    } catch (err) {
        res.status(400);
        res.send(err);
    }
};

const getPriceByDate = async(req, res) => {
  let date = req.params.id;
  try{
    let response = {};
    const prices = await models.configuration.findAll({
      where: {
        [Sequelize.Op.or]: [{date: date}, {date: null}]
      }
    }).then( res => {
      res.forEach(item => {
        if (item.date == null) response["base"] = item.price
        else {
          let key = item.startTime[0] + item.startTime[1];
          response[key] = item.price;
        }
      });
    })
    res.send(response);
  } catch (err) {
    console.log(err);
    res.status(400);
    res.send(err);
  }
}

const destroy = async (req, res) => {
    const id = req.params.id;

    try {
        await models.configuration.destroy({
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
    list,
    create,
    destroy,
    getPriceByDate
};
