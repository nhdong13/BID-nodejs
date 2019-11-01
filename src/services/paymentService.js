import models from '@models/';

const stripe = require('stripe')('sk_test_ZW2xmoQCisq5XvosIf4zW2aU00GaOtz9q3');

const createCharges = async (req, res) => {
    const { amount, userId } = req.body;
    try {
        const result = await models.tracking.findOne({
            where: { userId },
        });
        console.log('PHUC: createCharges -> result', result.customerId);

        const charge = await stripe.charges.create({
            amount: amount,
            currency: 'vnd',
            customer: result.customerId,
        });
        console.log('PHUC: createCharges -> charge', charge);
        if (charge) {
            res.send(charge);
        }
    } catch (error) {
        res.status(400);
        res.send(error);
    }
};

const createCustomer = async (req, res) => {
    const { email, token, userId, name } = req.body;

    try {
        const { id: customerId, balance } = await stripe.customers.create({
            source: token,
            email: email,
            name: name,
        });

        await models.tracking.update(
            { customerId: customerId, balance: balance },
            {
                where: { userId },
            },
        );
        res.send({ customerId, balance });
    } catch (error) {
        res.status(400);
        res.send(error);
    }
};

const getCustomer = async (req, res) => {
    const id = req.params.id;

    try {
        const customer = await models.tracking.findOne({
            where: { id },
        });

        if (customer) {
            res.send(customer);
        } else {
            res.status(404);
            res.send();
        }
    } catch (err) {
        res.status(400);
        res.send(err);
    }
};

export default { createCharges, createCustomer, getCustomer };
