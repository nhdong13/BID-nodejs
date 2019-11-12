import models from '@models';
import {
    reminderMessages,
    titleMessages,
    titleReminderMessages,
} from '@utils/notificationMessages';
import moment from 'moment';
import { handleForgotToCheckout } from '@services/sittingRequestService';

const CronJob = require('cron').CronJob;
const REMIND_BEFORE_DURATION_0 = 7; // remind before 8 hour
const REMIND_BEFORE_DURATION_1 = 1; // remind before 1 hour
const CHECKOUT_TIMEOUT = 1;
const TIME_ZONE = 'Asia/Bangkok';

export function initScheduler() {
    loadSchedule().then((schedules) => {
        if (schedules != null && schedules != undefined) {
            schedules.forEach((sche) => {
                let time = parseStartTime(sche.scheduleTime);

                // TO DO
            });
        }
    });
}

export function createReminder(sitterId, requestId, scheduleTime) {
    let time = parseStartTime(scheduleTime);

    let remindTime_1 = time.subtract(REMIND_BEFORE_DURATION_1, 'hours');
    if (remindTime_1.isAfter(moment())) {
        new CronJob(
            remindTime_1,
            function() {
                remindBabysitter(sitterId, requestId);
                remindParent(requestId);
            },
            null,
            true,
            TIME_ZONE,
        );
    }

    let remindTime_0 = time.subtract(REMIND_BEFORE_DURATION_0, 'hours');
    if (remindTime_0.isAfter(moment())) {
        new CronJob(
            remindTime_0,
            function() {
                remindBabysitter(sitterId, requestId);
                remindParent(requestId);
            },
            null,
            true,
            TIME_ZONE,
        );
    }

    console.log('reminder created');
}

export function loadSchedule() {
    return models.schedule
        .findAll({
            where: {
                type: 'FUTURE',
            },
        })
        .then((result) => {
            return result;
        })
        .catch((error) => {
            return null;
        });
}

function remindBabysitter(sitterId, requestId) {
    // notify the accepted babysitter
    models.invitation
        .findOne({
            where: {
                receiver: sitterId,
                requestId: requestId,
            },
            include: [
                {
                    model: models.user,
                    as: 'user',
                    include: [
                        {
                            model: models.tracking,
                            as: 'tracking',
                        },
                    ],
                },
            ],
        })
        .then((invitation) => {
            if (invitation) {
                if (invitation.user.tracking != null) {
                    try {
                        const notification = {
                            id: invitation.id,
                            pushToken: invitation.user.tracking.token,
                            message: reminderMessages.sitterUpcommingSitting,
                            title: titleReminderMessages.sitterUpcommingSitting,
                        };
                        sendSingleMessage(notification);
                        console.log("Duong: remindBabysitter -> notification", notification)
                    } catch (error) {
                        console.log('Duong: remindBabysitter -> error', error);
                    }
                }
            }
        });
}

function remindParent(requestId) {
    models.sittingRequest
        .findOne({
            where: {
                id: requestId,
            },
            include: [
                {
                    model: models.user,
                    as: 'user',
                    include: [
                        {
                            model: models.tracking,
                            as: 'tracking',
                        },
                    ],
                },
            ],
        })
        .then((request) => {
            if (request) {
                if (request.user.tracking != null) {
                    try {
                        const notification = {
                            id: request.id,
                            pushToken: request.user.tracking.token,
                            message: reminderMessages.sitterUpcommingSitting,
                            title: titleReminderMessages.sitterUpcommingSitting,
                        };
                        sendSingleMessage(notification);
                        console.log("Duong: remindParent -> notification", notification)
                    } catch (error) {
                        console.log('Duong: remindParent -> error', error);
                    }
                }
            }
        });
}

function parseStartTime(scheduleTime) {
    let arr = scheduleTime.split(' ');
    let startTime = arr[0];
    let endTime = arr[1];
    let date = arr[2];
    let month = arr[3];
    let year = arr[4];
    let weekDay = '*';

    let cron = `${date}-${month}-${year} ${startTime}`;

    let time = moment(cron, 'DD-MM-YYYY HH:mm:ss');

    return time;
}

/**
 * @param  {} requestId
 * @param  {} scheduleTime
 */
export function createCheckoutPoint(requestId, scheduleTime) {
    let time = parseEndTime(scheduleTime);

    let timeout = time.add(CHECKOUT_TIMEOUT, 'hours');
    console.log("Duong: createCheckoutPoint -> timeout", timeout)
    if (timeout.isAfter(moment())) {
        new CronJob(
            timeout,
            function() {
                console.log('handling forgot to checkout');
                handleForgotToCheckout(requestId);
            },
            null,
            true,
            TIME_ZONE,
        );
    }

    console.log('checkout point created');
}

function parseEndTime(scheduleTime) {
    let arr = scheduleTime.split(' ');
    let startTime = arr[0];
    let endTime = arr[1];
    let date = arr[2];
    let month = arr[3];
    let year = arr[4];
    let weekDay = '*';

    let cron = `${date}-${month}-${year} ${endTime}`;

    let time = moment(cron, 'DD-MM-YYYY HH:mm:ss');

    return time;
}
