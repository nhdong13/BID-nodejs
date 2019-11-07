import models from '@models';
import { reminderMessages } from '@utils/notificationMessages';
import moment from 'moment';

var CronJob = require('cron').CronJob;

export function initScheduler() {
    console.log('here');
    loadSchedule().then((schedules) => {
        if (schedules != null && schedules != undefined) {
            schedules.forEach((sche) => {
                let cronTime = parseCron(sche.scheduleTime);
                console.log('Duong: initScheduler -> cronTime', cronTime);
                new CronJob(cronTime, function() {}, null, true);
            });
        }
    });
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
                receiverId: sitterId,
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
                    const notification = {
                        id: invitation.id,
                        pushToken: invitation.user.tracking.token,
                        message: reminderMessages.sitterUpcommingSitting,
                    };
                    sendSingleMessage(notification);
                }
            }
        });
}

function remindParent(parentId, requestId) {
    models.sittingRequest
        .findOne({
            where: {
                createdUser: parentId,
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
                    const notification = {
                        id: request.id,
                        pushToken: request.user.tracking.token,
                        message: reminderMessages.sitterUpcommingSitting,
                    };
                    sendSingleMessage(notification);
                }
            }
        });
}

function parseCron(scheduleTime) {
    let arr = scheduleTime.split(' ');
    let startTime = arr[0];
    let endTime = arr[1];
    let date = arr[2];
    let month = arr[3] - 1;
    let yeah = arr[4];
    let weekDay = '*';

    let time = parseTime(startTime);

    let cron = `${time.second} ${time.minute} ${time.hour} ${date} ${month} ${weekDay}`;

    return cron;
}

function parseTime(time) {
    let arr = time.split(':');
    let hour = arr[0];
    let minute = arr[1];
    let second = 0;

    let obj = {
        hour: hour,
        minute: minute,
        second: second,
    };

    return obj;
}

function parseDate(scheduleTime) {
    let arr = scheduleTime.split(' ');
    let startTime = arr[0];
    let endTime = arr[1];
    let date = arr[2];
    let month = arr[3];
    let year = arr[4];
    let weekDay = '*';

    let result = `${date}-${month}-${year}`;
    return result;
}

function getDateTime(scheduleTime) {
    moment();
}
