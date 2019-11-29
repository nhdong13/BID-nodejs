import moment from 'moment';

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
            date: moment(`${arr[4]}-${arr[3]}-${arr[2]}`, 'YYYY-MM-DD').format(
                'YYYY-MM-DD',
            ),
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
    let flag = false;
    let scheduleStartTime = scheduleTime.startTime;
    let scheduleEndTime = scheduleTime.endTime;

    if (scheduleStartTime <= startTime && startTime <= scheduleEndTime) {
        flag = true;
    }
    if (scheduleStartTime <= endTime && endTime <= scheduleEndTime) {
        flag = true;
    }
    if (startTime < scheduleStartTime && scheduleEndTime < endTime) {
        flag = true;
    }

    return flag;
}

/**
 * check if 2 requests sitting time is overlapping each other
 * @param  {sittingRequest} firstRequest
 * @param  {sittingRequest} secondRequest
 * @returns {Boolean}
 */
export function checkRequestTime(firstRequest, secondRequest) {
    let flag = false;
    if (
        firstRequest.startTime <= secondRequest.startTime &&
        secondRequest.startTime <= firstRequest.endTime
    ) {
        flag = true;
    }
    if (
        firstRequest.startTime <= secondRequest.endTime &&
        secondRequest.endTime <= firstRequest.endTime
    ) {
        flag = true;
    }
    if (
        firstRequest.startTime > secondRequest.startTime &&
        firstRequest.endTime < secondRequest.endTime
    ) {
        flag = true;
    }

    return flag;
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

/**
 else { * check if a request is available to a babysitter'schedules
 * @param  {Integer} sitterId
 * @param  {sittingRequest} request
 * @returns {Boolean} true if available, false otherwise
 */
export function checkBabysitterSchedule(babysitter, request) {
    let flag = true;
    let schedules = babysitter.user.schedules;
    // unavailable schedules
    let unavailable = schedules.filter((schedule) => schedule.type == 'FUTURE');
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
                    checkScheduleTime(
                        request.startTime,
                        request.endTime,
                        scheduleTime,
                    )
                ) {
                    flag = false;
                }
            }
        });
    }

    return flag;
}
