import models from "@models";
import { getCircleDetail } from '@services/circleService';

const list = async (req, res, next) => {
    const ownerId = req.params.ownerId;

    try {
        let circle = await getCircleDetail(ownerId);
        res.send(circle);
    } catch (err) {
        res.status(400);
        res.send(err);
    }
    
};

const create = async (req, res) => {
    let newCircle = req.body;

    try {

        newCircle = await models.circle.create(newCircle);

        res.send(newCircle);
    } catch (err) {
        res.status(400);
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
    list,
    create,
    destroy
};
