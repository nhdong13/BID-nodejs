import models from '@models';
import {
    reminderMessages,
    titleMessages,
    titleReminderMessages,
} from '@utils/notificationMessages';
import moment from 'moment';

const CronJob = require('cron').CronJob;
const REMIND_BEFORE_DURATION_0 = 7; // remind before 8 hour
const REMIND_BEFORE_DURATION_1 = 1; // remind before 1 hour
const TIME_ZONE = 'Asia/Bangkok';

export function initScheduler() {
    console.log('here');
    loadSchedule().then((schedules) => {
        if (schedules != null && schedules != undefined) {
            schedules.forEach((sche) => {
                let time = parseTime(sche.scheduleTime);
                console.log('Duong: initScheduler -> time', time);

                // let remindTime_0 = time.subtract(REMIND_BEFORE_DURATION_0, 'hours');
                // console.log("Duong: initScheduler -> remindTime_0", remindTime_0)
                // new CronJob(
                //     remindTime_0,
                //     function() {
                //         console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
                //         remindBabysitter(sche.userId, sche.requestId);
                //         remindParent(sche.requestId);
                //     },
                //     null,
                //     true,
                //     TIME_ZONE
                // );

                let remindTime_1 = time.subtract(
                    REMIND_BEFORE_DURATION_1,
                    'hours',
                );
                console.log(
                    'Duong: initScheduler -> remindTime_1',
                    remindTime_1,
                );
                new CronJob(
                    remindTime_1,
                    function() {
                        console.log('---------------------------------');
                        remindBabysitter(sche.userId, sche.requestId);
                        remindParent(sche.requestId);
                    },
                    null,
                    true,
                    TIME_ZONE,
                );
            });
        }
    });
}

export function createReminder(sitterId, requestId, scheduleTime) {
    let time = parseTime(scheduleTime);
    console.log('Duong: createReminder -> time', time);
    
    let remindTime_1 = time.subtract(REMIND_BEFORE_DURATION_1, 'hours');
    console.log('Duong: createReminder -> remindTime_1', remindTime_1);
    if (remindTime_1.isAfter(moment())) {
        console.log('here');
        new CronJob(
            remindTime_1,
            function() {
                console.log('---------------------------------');
                remindBabysitter(sitterId, requestId);
                remindParent(requestId);
            },
            null,
            true,
            TIME_ZONE,
        );
    }

    let remindTime_0 = time.subtract(REMIND_BEFORE_DURATION_0, 'hours');
    console.log("Duong: createReminder -> remindTime_0", remindTime_0)
    if (remindTime_0.isAfter(moment())) {
        new CronJob(
            remindTime_0,
            function() {
                console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
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
                    } catch (error) {
                        console.log('Duong: remindParent -> error', error);
                    }
                }
            }
        });
}

function parseTime(scheduleTime) {
    let arr = scheduleTime.split(' ');
    let startTime = arr[0];
    let endTime = arr[1];
    let date = arr[2];
    let month = arr[3];
    let year = arr[4];
    let weekDay = '*';

    // let time = parseTime(startTime);
    let cron = `${date}-${month}-${year} ${startTime}`;

    let time = moment(cron, 'DD-MM-YYYY HH:mm:ss');
    console.log('Duong: parseTime -> time', time);

    // let before = `${time.second} ${time.minute} ${time.hour} ${date} ${month} ${weekDay}`;

    return time;
}
