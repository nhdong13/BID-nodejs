import models from '@models';
import {
    reminderMessages,
    titleReminderMessages,
} from '@utils/notificationMessages';
import moment from 'moment';
require('moment-recur');
import {
    handleForgotToCheckout,
    handleNotCheckingIn,
    handleRequestExpired,
} from '@services/sittingRequestService';
import { sendSingleMessage } from '@utils/pushNotification';
import Config from '@services/configService';

const CronJob = require('cron').CronJob;
const CronTime = require('cron').CronTime;

// const REMIND_BEFORE_DURATION_0 = 1; // remind before .. hour
// const REMIND_BEFORE_DURATION_1 = 7; // remind before (REMIND_BEFORE_DURATION_0 + ..) hour
// const CHECKOUT_TIMEOUT = 1;
// const CHECKIN_TIMEOUT = 1;
// const TIME_ZONE = 'Asia/Bangkok';

//
let instance;

function createInstance() {
    let object = [];
    console.log('Scheduler instance created');
    return object;
}

function initScheduler() {
    loadSchedule().then((schedules) => {
        if (schedules != null && schedules != undefined) {
            schedules.forEach((sche) => {
                let time = parseStartTime(sche.scheduleTime);

                let remindTime_0 = time.subtract(
                    Config.getRemindBeforeDuration_0(),
                    'hours',
                );
                if (remindTime_0.isAfter(moment())) {
                    try {
                        new CronJob({
                            cronTime: remindTime_0,
                            onTick: function() {
                                console.log(
                                    '-------------------  đã chạy -> initScheduler  --------------------',
                                );
                                remindBabysitter(sitterId, requestId);
                                remindParent(requestId);
                            },
                            start: true,
                            timeZone: Config.getTimezone(),
                        });
                        console.log('1 created');
                    } catch (error) {}
                }
            });
        }
    });
}

function privateCreateReminder(sitterId, requestId, scheduleTime) {
    let time = parseStartTime(scheduleTime);
    console.log(moment().format('DD-MM-YYYY HH:mm:ss'));

    let remindTime_0 = time.subtract(
        Config.getRemindBeforeDuration_0(),
        'hours',
    );
    // console.log(
    // 'PHUC: privateCreateReminder -> Config.getRemindBeforeDuration_0()',
    // Config.getRemindBeforeDuration_0(),
    // );
    if (remindTime_0.isAfter(moment())) {
        try {
            let newSchedule = new CronJob({
                cronTime: remindTime_0,
                onTick: function() {
                    console.log(
                        '---------------------  Đã chạy remind trước 1 tiếng  -------------------------',
                    );
                    remindBabysitter(sitterId, requestId);
                    remindParent(requestId);
                },
                start: true,
                timeZone: Config.getTimezone(),
            });

            instance.push(newSchedule);

            console.log(
                `--------------------------  A schedule for request with id ${requestId} was created to run at:
                    ${remindTime_0.format(
                        'DD-MM-YYYY HH:mm:ss',
                    )}. --------------------------------------------`,
            );
        } catch (error) {
            console.log('Duong: error', error);
        }
    }

    // console.log(
    // 'PHUC: privateCreateReminder -> Config.getRemindBeforeDuration_1()',
    // Config.getRemindBeforeDuration_1(),
    // );

    let remindTime_1 = time.subtract(
        Config.getRemindBeforeDuration_1(),
        'hours',
    );

    if (remindTime_1.isAfter(moment())) {
        try {
            let newSchedule = new CronJob({
                cronTime: remindTime_1,
                onTick: function() {
                    console.log(
                        '---------------------- Đã chạy remind trước 8 tiếng  ----------------------',
                    );
                    remindBabysitter(sitterId, requestId);
                    remindParent(requestId);
                },
                start: true,
                timeZone: Config.getTimezone(),
            });

            instance.push(newSchedule);

            console.log(
                `----------------------  A schedule for request with id ${requestId} was created to run at:
                    ${remindTime_1.format(
                        'DD-MM-YYYY HH:mm:ss',
                    )}.  ----------------------`,
            );
        } catch (error) {
            console.log('Duong: privateCreateReminder -> error', error);
        }
    }
}

function loadSchedule() {
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
                            option: {
                                showConfirm: true,
                                textConfirm: 'Tiếp tục',
                                showCancel: true,
                                textCancel: 'Ẩn',
                            },
                        };
                        sendSingleMessage(notification);
                    } catch (error) {}
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
                            option: {
                                showConfirm: true,
                                textConfirm: 'Tiếp tục',
                                showCancel: true,
                                textCancel: 'Ẩn',
                            },
                        };
                        sendSingleMessage(notification);
                    } catch (error) {}
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
function privateCreateCheckoutPoint(requestId, scheduleTime) {
    let time = parseEndTime(scheduleTime);

    let timeout = time.add(Config.getCheckoutTimeout(), 'hours');
    if (timeout.isAfter(moment())) {
        let newSchedule = new CronJob(
            timeout,
            function() {
                console.log(
                    '---------------------- Handling forgot to checkout.  ----------------------',
                );
                handleForgotToCheckout(requestId);
            },
            null,
            true,
            Config.getTimezone(),
        );
        instance.push(newSchedule);
        console.log(
            `----------------------  Check out point for request with id ${requestId} was created to run at:
                ${timeout.format(
                    'DD-MM-YYYY HH:mm:ss',
                )}.  ----------------------`,
        );
    }
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

function parseToScheduleTime(momentObj) {
    let result = moment().set({
        year: momentObj.year(),
        month: momentObj.month(),
        date: momentObj.date(),
        hour: momentObj.hour(),
        minute: momentObj.minute(),
        second: momentObj.second(),
    });

    return result.toDate();
}

function restartJob(job) {
    // console.log('PHUC: restartJob -> job', job);
    if (job.runOnce) {
        try {
            let time = job.nextDate();
            // console.log('PHUC: restartJob -> time', time);

            if (time.isAfter(moment())) {
                time = new CronTime(time);

                job.stop();
                job.setTime(time);
                job.start();
                console.log('--- Giờ hiện tại:', moment().format('HH:mm:ss'));
                console.log('--- Giờ chạy:', job.nextDate().format('HH:mm:ss'));
            } else {
                console.log('--------- Schedule trong quá khứ !');
                console.log('--- Giờ hiện tại:', moment().format('HH:mm:ss'));
                console.log('--- Giờ quá khứ:', time.format('HH:mm:ss'));
            }
        } catch (error) {
            // console.log('PHUC: restartJob -> error', error);
        }
    } else {
        try {
            job.stop();

            job.start();
            console.log('--- Giờ hiện tại:', moment().format('HH:mm:ss'));
            console.log('--- Giờ chạy:', job.nextDate().format('HH:mm:ss'));
        } catch (error) {
            // console.log('PHUC: restartJob -> not run once', error);
        }
    }
}

/**
 *
 * @param  {} requestId
 * @param  {} scheduleTime
 */
function privateCreateCheckinPoint(requestId, scheduleTime) {
    let time = parseStartTime(scheduleTime);

    let timeout = time.add(Config.getCheckinTimeout(), 'hours');
    if (timeout.isAfter(moment())) {
        let newSchedule = new CronJob(
            timeout,
            function() {
                console.log(
                    '----------------------  Handling not checking in.  ----------------------',
                );
                handleNotCheckingIn(requestId);
            },
            null,
            true,
            Config.getTimezone(),
        );
        instance.push(newSchedule);
        console.log(
            `----------------------  Check in point for request with id ${requestId} was created to run at:
                ${timeout.format(
                    'DD-MM-YYYY HH:mm:ss',
                )}.  ----------------------`,
        );
    }
}

/**
 *
 * @param  {} requestId
 * @param  {} scheduleTime
 */
function privateCreateRequestExpiredPoint(request) {
    let time = parseExpiredTime(request);

    let timeout = time;
    if (timeout.isAfter(moment())) {
        const newSchedule = new CronJob(
            timeout,
            function() {
                console.log(
                    '----------------------  Handling request expired.  ----------------------',
                );
                handleRequestExpired(request.id);
            },
            null,
            true,
            Config.getTimezone(),
        );
        // console.log(
        //     'PHUC: privateCreateRequestExpiredPoint -> newSchedule',
        //     newSchedule,
        // );
        instance.push(newSchedule);
        console.log(
            `----------------------  Expired point for request with id 
            ${request.id}
             was created to run at:
            ${timeout.format('DD-MM-YYYY HH:mm:ss')}.  
            ----------------------`,
        );
    }
}

async function privateCreateRepeatedRequest(foundRequest, request) {
    try {
        const repeatedDays = foundRequest.repeatedDays.split(',');
        const rules = repeatedDays.map((day) => day.toLowerCase());
        // rules sẽ lấy trong bảng repeatedRequest ra la 1 chuoi array lowwer case vi du:  ['mon', 'tue', 'fri']
        const startDate = moment(foundRequest.startDate);
        const recurrence = startDate
            .recur()
            .every(rules)
            .dayOfWeek();
        // cho nay nen dung .startDate.recur().every(rules).daysOfMonth(); thi no se tra ve tat cac cac ngay recurr cua thang do == 4 tuan :))

        // cai nay se lay nhieu lan lap coi trong doc se ro nghia hon
        const nextDates = recurrence.next(rules.length * 4, 'YYYY-MM-DD');

        // sau khi co nhung ngay lap lai roi chi can tao requeset voi tung ngay thoi la xong
        const promises = nextDates.map(async (date) => {
            const newDate = date;
            const newRequest = await models.sittingRequest.create({
                createdUser: request.createdUser,
                acceptedBabysitter: request.acceptedBabysitter,
                sittingDate: newDate, // thay ngay ne, voi ca lay thang acceptedBabysitter nuwa
                startTime: request.startTime,
                endTime: request.endTime,
                sittingAddress: request.sittingAddress,
                childrenNumber: request.childrenNumber,
                minAgeOfChildren: request.minAgeOfChildren,
                status: 'CONFIRMED',
                totalPrice: request.totalPrice,
            });

            await createSchedule(newRequest, request.acceptedBabysitter, newRequest.id);
        });

        await Promise.all(promises);
    } catch (error) {
        console.log(
            '!!!!!!!!!!  PHUC: createRepeatedRequest -> error  !!!!!!!!!!!',
            error,
        );
    }
}

function parseExpiredTime(request) {
    const sittingDate = request.sittingDate;
    const startTime = request.startTime;

    let time = moment(`${sittingDate} ${startTime}`, 'YYYY-MM-DD HH:mm');

    return time;
}

async function createSchedule(request, sitterId, requestId) {
    // create a schedule for the accepted babysitter'schedules
    try {
        let scheduleTime = getScheduleTime(request);
        let schedule = {
            userId: sitterId,
            requestId: requestId,
            scheduleTime: scheduleTime,
            type: 'FUTURE',
        };

        await models.schedule.create(schedule);

        privateCreateReminder(sitterId, requestId, scheduleTime);
        privateCreateCheckinPoint(requestId, scheduleTime);
    } catch (error) {
        console.log(error);
    }
}

/**
 * @param  {sittingRequest} sittingRequest
 * @returns {String} the string represent schedule time
 */
export function getScheduleTime(request) {
    let scheduleTime = '';
    let sittingDate = moment(request.sittingDate, 'YYYY-MM-DD');
    let startTime = request.startTime;
    let endTime = request.endTime;
    scheduleTime += startTime;
    scheduleTime += ' ' + endTime;
    scheduleTime += ' ' + sittingDate.format('DD');
    scheduleTime += ' ' + sittingDate.format('MM');
    scheduleTime += ' ' + sittingDate.format('YYYY');

    return scheduleTime;
}

export default {
    getInstance() {
        if (!instance) {
            instance = createInstance();
        }
        return instance;
    },

    addSchedule(schedule) {
        if (instance) {
            if (schedule) instance.push(schedule);
        }
    },

    createReminder(sitterId, requestId, scheduleTime) {
        if (sitterId && requestId && scheduleTime) {
            privateCreateReminder(sitterId, requestId, scheduleTime);
        } else {
            throw new Error('Args null');
        }
    },

    createCheckoutPoint(requestId, scheduleTime) {
        if (requestId && scheduleTime) {
            privateCreateCheckoutPoint(requestId, scheduleTime);
        } else {
            throw new Error('Args null');
        }
    },

    createCheckinPoint(requestId, scheduleTime) {
        if (requestId && scheduleTime) {
            privateCreateCheckinPoint(requestId, scheduleTime);
        } else {
            throw new Error('Args null');
        }
    },

    createRequesExpiredPoint(request) {
        privateCreateRequestExpiredPoint(request);
    },

    cancelAllJob() {
        instance.forEach((element) => {
            element.stop();
        });
    },

    reStartAllJob() {
        instance.forEach((element) => {
            restartJob(element);
        });
    },

    printInstance() {
        if (instance) {
            instance.forEach((element) => {
                console.log(element);
            });
        }
    },

    createRepeatedRequest(foundRequest, request) {
        privateCreateRepeatedRequest(foundRequest, request);
    }
};
