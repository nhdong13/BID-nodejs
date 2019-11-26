import models from '@models';

var instance;

async function createInstance() {
    var object = {};
    await models.configuration
        .findOne({
            where: {
                id: 1,
            },
        })
        .then((result) => {
            if (result) {
                object = result.dataValues;
                console.log('Configuration instance created');
            }
        })
        .catch((error) => {
            console.log('Configuration instance created fail!!!');
            console.log('Duong: createInstance -> error', error);
        });
    return object;
}

async function privateUpdateInstance() {
    await models.configuration
        .findOne({
            where: {
                id: 1,
            },
        })
        .then((result) => {
            if (result) {
                instance = result.dataValues;
                console.log('Configuration updated');
            }
        })
        .catch((error) => {
            console.log('Configuration instance update fail!!!');
            console.log('Duong: privateUpdateInstance -> error', error);
        });
}

export default {
    async getInstance() {
        if (!instance) {
            instance = await createInstance();
        }
        return instance;
    },

    updateInstance() {
        privateUpdateInstance();
    },

    getRemindBeforeDuration_0() {
        return instance.remindBeforeDuration_0;
    },

    getRemindBeforeDuration_1() {
        return instance.remindBeforeDuration_1;
    },

    getCheckinTimeout() {
        return instance.checkinTimeout;
    },

    getCheckoutTimeout() {
        return instance.checkoutTimeout;
    },

    getTimezone() {
        return instance.timezone;
    },

    getMaxTravelDistance() {
        return instance.maxTravelDistance;
    },

    getCircleWeight() {
        return instance.circleWeight;
    },

    getRatingWeight() {
        return instance.ratingWeight;
    },

    getDistanceWeight() {
        return instance.distanceWeight;
    },

    getMinimumFeedback() {
        return instance.minimumFeedback;
    },
};
