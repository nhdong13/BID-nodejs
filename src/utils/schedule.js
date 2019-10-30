import models from '@models/';
import moment from 'moment';
import { splitTimeRange } from '@utils/common';

/**
 * @param  {String} cron
 * @returns {CronObj} the cron object defined by this function
 */
export function parseSchedule(scheduleTime) {
    try {
        let arr = scheduleTime.split(' ');
        let obj = {
            startTime: arr[0],
            endTime: arr[1],
            dayOfMonth: arr[2],
            month: arr[3],
            dayOfWeek: arr[4],
            year: arr[5],
            date: `${arr[5]}-${arr[3]}-${arr[2]}`,
        };
        return obj;
    } catch (error) {
        console.log(error);
    }
}

/**
 * check if the request time and the schedule time are colission or not
 * @param  {String} startTime
 * @param  {String} endTime
 * @param  {CronObj} cron
 * @returns {Boolean}
 */
export function checkScheduleTime(startTime, endTime, scheduleTime) {
    let hours = splitTimeRange(scheduleTime.hour);
    let scheduleStartTime = scheduleTime.startTime;
    let scheduleEndTime = scheduleTime.endTime;

    if (scheduleStartTime <= startTime && startTime <= scheduleEndTime) {
        return true;
    }
    if (scheduleStartTime <= endTime && endTime <= scheduleEndTime) {
        return true;
    }

    return false;
}

/**
 * @param  {sittingRequest} sittingRequest
 * @returns {String} the string represent schedule time
 */
export function getScheduleTime(request) {
    let scheduleTime = '';
    let sittingDate = moment(request.sittingDate, 'yyyy-MM-dd');
    let startTime = request.startTime;
    let endTime = request.endTime;
    scheduleTime += startTime;
    scheduleTime += ' ' + endTime;
    scheduleTime += ' ' + sittingDate.date();
    scheduleTime += ' ' + (sittingDate.month() + 1);
    scheduleTime += ' ' + sittingDate.year();

    return scheduleTime;
}

/**
 * check if a request is available to a babysitter'schedules
 * @param  {Integer} sitterId
 * @param  {sittingRequest} request
 * @returns {Boolean} true if available, false otherwise
 */
export async function checkBabysitterSchedule(sitterId, request) {
    const babysitter = await models.babysitter.findOne({
        where: {
            userId: sitterId,
        },
        include: [
            {
                model: models.user,
                as: 'user',
                include: [
                    {
                        model: models.schedule,
                        as: 'schedules',
                    },
                ],
            },
        ],
    });

    let schedules = babysitter.user.schedules;
    // unavailable schedules
    let unavailable = schedules.filter(
        (schedule) => schedule.type == 'UNAVAILABLE',
    );
    // available schedules
    let available = schedules.filter(
        (schedule) => schedule.type == 'AVAILABLE',
    );

    //
    if (unavailable.length > 0) {
        unavailable.forEach((schedule) => {
            let scheduleTime = parseSchedule(schedule.scheduleTime);

            if (!(request.sittingDate == scheduleTime.date)) {
                if (
                    !checkScheduleTime(
                        request.startTime,
                        request.endTime,
                        scheduleTime,
                    )
                ) {
                    return true;
                }
            }
        });
    } else {
        return true;
    }

    return false;
}
