import models from '@models';

const list = async (req, res, next) => {
    const listTrackings = await models.tracking.findAll();
    res.send(listTrackings);
};
// xu ly o day dem so token voi async token
const create = async (req, res) => {
    const { token, userAgent } = req.body;
    try {
        const tracking = await models.tracking.findOne({
            where: {
                userId: userAgent.trim(),
                token: token,
            },
        });

        if (!tracking) {
            const newTracking = await models.tracking
                .findOrCreate({
                    userId: userAgent.trim(),
                    token: token,
                })
                .catch((err) => {
                    console.log(err);
                    res.status(401);
                    res.send(err);
                });
            res.send(newTracking);
        } else {
            // console.log('PHUC: create -> token', token);
            const checkToken = await models.tracking.findOne({
                where: {
                    userId: userAgent.trim(),
                    token: token,
                },
            });
            // console.log('PHUC: create -> tracking.token', checkToken.token);
            if (token == checkToken.token) {
                console.log('token trung roi yisss');
                res.status(200);
                res.send(tracking);
            } else {
                console.log('violated policy of devices');
                res.status(401);
                res.send({ message: 'Token exist!!' });
            }
        }
        // await models.tracking
        //     .findOrCreate({
        //         where: {
        //             userId: newItem.userAgent.trim(),
        //             token: newItem.token,
        //         },
        //         defaults: {
        //             userId: newItem.userAgent.trim(),
        //             token: newItem.token,
        //         },
        //     })
        //     .then((result) => {
        //         console.log('PHUC: create -> result', result);
        //         const created = result[1];
        //         if (!created) {
        //             res.status(401);
        //             res.send({ message: 'Token exist!!' });
        //         } else res.send(result);
        //     });
    } catch (err) {
        // console.log('PHUC: create -> err', err);
        res.status(401);
        res.send(err);
    }
};

const read = async (req, res) => {
    const id = req.params.id;
    try {
        const tracking = await models.tracking.findOne({
            where: {
                userId: id,
            },
        });
        if (tracking) {
            res.status(201);
            res.send(tracking);
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

    const updatingTracking = req.body;

    try {
        await models.tracking.update(updatingTracking, {
            where: { id },
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
        await models.tracking.destroy({
            where: {
                id,
            },
        });
        res.status(204);
        res.send();
    } catch (err) {
        res.status(422);
        res.send(err);
    }
};

export default { list, create, read, update, destroy };
