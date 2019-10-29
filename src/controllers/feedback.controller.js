import models from '@models';

const Sequelize = require('sequelize');
const list = async (req, res, next) => {
    try {
        const list = await models.feedback.findAll({});
        res.send(list);
    } catch (err) {
        res.status(400);
        res.send(err);
    }
};

const create = async (req, res) => {
    let newItem = req.body;

    try {
        const newFeedback = await models.feedback.create(newItem).then(res => {
          //tìm sitting request từ requestid của feedback
          const sitting = models.sittingRequest.findAll({
            where: {
              id: res.requestId,
            }
          }).then(res =>{
            ///tìm acceptedbabsitter
            const bsitter = models.babysitter.findAll({
              where: {
                userId: res[0].acceptedBabysitter
              }
            }).then(resp => {
              //lấy rating + feedback của babysitter đó rồi tính toán
              let rating = resp[0].averageRating;
              let feedback = resp[0].totalFeedback;
              rating = (rating * feedback + newItem.rating) / (feedback + 1);
              feedback += 1;
  
              const babysitterBody = {
                totalFeedback: feedback,
                averageRating: rating,
              };
              //update vào database
              const updateBsitter = models.babysitter.update(babysitterBody, {
                where: {
                  userId: resp[0].userId,
                }
              });
  
            });
            ///
          });
          
          
        });
        res.send(newFeedback);
    } catch (err) {
        res.status(400);
        res.send(err);
    }
};

export default {
    list,
    create,
};
