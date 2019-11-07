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
            year: arr[4],
            date: `${arr[4]}-${arr[3]}-${arr[2]}`,
        };
        return obj;
    } catch (error) {
        console.log(error);
    }
}

/**
 * check if the request time and the schedule time are overlapping each other or not
 * @param  {String} startTime
 * @param  {String} endTime
 * @param  {CronObj} cron
 * @returns {Boolean}
 */
export function checkScheduleTime(startTime, endTime, scheduleTime) {
    let scheduleStartTime = scheduleTime.startTime;
    let scheduleEndTime = scheduleTime.endTime;

    if (scheduleStartTime <= startTime && startTime <= scheduleEndTime) {
        return true;
    }
    if (scheduleStartTime <= endTime && endTime <= scheduleEndTime) {
        return true;
    }
    if (startTime < scheduleStartTime && scheduleEndTime < endTime)

    return false;
}

/**
 * check if 2 requests sitting time is overlapping each other
 * @param  {sittingRequest} firstRequest
 * @param  {sittingRequest} secondRequest
 * @returns {Boolean}
 */
export function checkRequestTime(firstRequest, secondRequest) {
    if (firstRequest.startTime <= secondRequest.startTime && secondRequest.startTime <= firstRequest.endTime) {
        return true;
    }
    if (firstRequest <= secondRequest.endTime && secondRequest.endTime <= firstRequest) {
        return true;
    }
    if (secondRequest.startTime < firstRequest.startTime && secondRequest.endTime < firstRequest.endTime) {
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
    let sittingDate = moment(request.sittingDate, 'yyyy-MM-DD');
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
export function checkBabysitterSchedule(babysitter, request) {
    let schedules = babysitter.user.schedules;
    // unavailable schedules
    let unavailable = schedules.filter(
        (schedule) => schedule.type == 'FUTURE',
    );
    // available schedules
    let available = schedules.filter(
        (schedule) => schedule.type == 'AVAILABLE',
    );

    //
    if (unavailable.length > 0) {
        unavailable.forEach((schedule) => {
            let scheduleTime = parseSchedule(schedule.scheduleTime);

            if (request.sittingDate == scheduleTime.date) {
                if (
                    !checkScheduleTime(
                        request.startTime,
                        request.endTime,
                        scheduleTime,
                    )
                ) {
                    return true;
                }
            } else {
                return true;
            }
        });
    } else {
        return true;
    }

    return false;
}
