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
            endTIme: arr[1],
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
    let startTime = moment(request.startTime, 'HH');
    let endTime = moment(request.endTime, 'HH');
    scheduleTime += ' ' + startTime;
    scheduleTime += ' ' + endTime;
    scheduleTime += ' ' + sittingDate.date();
    scheduleTime += ' ' + sittingDate.month();
    scheduleTime += ' ' + sittingDate.year();

    return scheduleTime;
}
