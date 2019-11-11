import models from '@models';
import { matching } from '@services/matchingService';
import { recommendToParent } from '@services/recommendService';
import { sendSingleMessage } from '@utils/pushNotification';
import { invitationMessages } from '@utils/notificationMessages';
import { testSocketIo } from '@utils/socketIo';
import { checkCheckInStatus, checkCheckOutStatus } from '@utils/common';
import {
    getScheduleTime,
    checkBabysitterSchedule,
    checkRequestTime,
} from '@utils/schedule';
import Sequelize from 'sequelize';

import env, { checkEnvLoaded } from '@utils/env';

checkEnvLoaded();
const { dbHost, dbUser, dbPass, dbName, dbDialect } = env;

const sequelize = new Sequelize(dbName, dbUser, dbPass, {
    host: dbHost,
    dialect: dbDialect,
    define: {
        paranoid: false,
        underscored: false,
        timestamps: false,
        freezeTableName: false,
    },
    logging: false,
});

export function acceptBabysitter() {}