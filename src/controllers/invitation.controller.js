import models from "@models";
import userController from "./user.controller";

const list = async (req, res, next) => {
  var invitations = await models.invitation.findAll({
    include: [{
        model: models.sittingRequest,
        as: 'sittingRequest',
        include: [{
            model: models.user,
            as: 'user'
        }]
    }]
  });
  res.send(invitations);
};

const create = async (req, res) => {
    const newItem = req.body;

    try {
        const newInvitation = await models.invitation.create(newItem);
        res.send(newInvitation);
    } catch (err) {
        res.status(400);
        res.send(err);
    }
};

const read = async (req, res) => {
    const id = req.params.id;

    try {
        const invitation = await models.invitation.findOne({
            // where: {
            //     id
            // },
            // include: [{
            //     model: models.babysitter,
            //     as: 'babysitter'
            // }, {
            //     model: models.parent,
            //     as: 'parent'
            // }, {
            //     model: models.sittingRequest,
            //     as: 'sittingRequest'
            // }]
        });
        if (invitation) {
            res.status(201);
            res.send(invitation);
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

    const updatingInvitation = req.body;

    try {
        await models.invitation.update(updatingInvitation, {
            where: { id }
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
        await models.invitation.destroy({
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

export default { list, create, read, update, destroy };
