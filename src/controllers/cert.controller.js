import models from "@models";

const getAllCerts = async (req, res) => {
    try {
        const listCerts = await models.cert.findAll({
            where: {
                active: true
            }
        });
        res.send(listCerts);
    } catch (error) {
        res.status(400);
        res.send(error);
    }
};

export default { getAllCerts };
