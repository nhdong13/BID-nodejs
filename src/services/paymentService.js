// Set your secret key: remember to change this to your live secret key in production
// See your keys here: https://dashboard.stripe.com/account/apikeys
const stripe = require('stripe')('sk_test_ZW2xmoQCisq5XvosIf4zW2aU00GaOtz9q3');

const createCharges = async (req, res) => {
    try {
        const charge = await stripe.charges.create({
            amount: 1000,
            currency: 'usd',
            source: 'tok_visa',
            receipt_email: 'jenny.rosen@example.com',
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

export default { createCharges };
