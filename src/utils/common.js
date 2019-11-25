import moment from 'moment';

/**
 * use if you want a forEach function with async and await
 * @param  {Number} array
 * @param  {Number} callback the callback function
 */
export async function asyncForEach(array, callback) {
    if (array.length != 0) {
        for (let index = 0; index < array.length; index++) {
            await callback(array[index], index, array);
        }
    }
}

/**
 * Randomize an integer value in range
 * @param  {Number} min The min number
 * @param  {Number} max The max number
 * @return {Number}      The random integer value
 */
export function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

/**
 * Randomize an float value in range
 * @param  {Number} min The min number
 * @param  {Number} max The max number
 * @param  {Number} max The max number
 * @return {Number}      The random float value
 */
export function randomFloat(min, max, decimal) {
    return parseFloat(Math.random() * (max - min) + min).toFixed(decimal);
}

/**
 * Check if a sitting request can be check in
 * @param  {any} sittingRequest The siting request
 * @return {boolean}
 */
export function checkCheckInStatus(sittingRequest) {
    const sittingDate = moment(sittingRequest.sittingDate).format('YYYYMMDD');
    console.log('PHUC: checkCheckInStatus -> sittingDate', sittingDate);
    const startTime = moment(sittingRequest.startTime, 'HH:mm')
        .subtract(30, 'minutes')
        .format('HH:mm');
    console.log('PHUC: checkCheckInStatus -> startTime', startTime);
    const currentDate = moment().format('YYYYMMDD');
    console.log('PHUC: checkCheckInStatus -> currentDate', currentDate);
    const currentTime = moment().format('HH:mm');
    console.log('PHUC: checkCheckInStatus -> currentTime', currentTime);
    if (sittingRequest.status == 'CONFIRMED') {
        if (sittingDate <= currentDate) {
            if (startTime <= currentTime) {
                return true;
            }
        }
    }
    return false;
}
/**
 * Check if a sitting request can be check out
 * @param  {any} sittingRequest The siting request
 * @return {boolean}
 */
export function checkCheckOutStatus(sittingRequest) {
    const sittingDate = moment(sittingRequest.sittingDate).format('YYYYMMDD');
    const startTime = moment(sittingRequest.startTime, 'HH:mm')
        .add(30, 'minutes')
        .format('HH:mm');
    console.log('Duong: checkCheckOutStatus -> startTime', startTime);
    const currentDate = moment().format('YYYYMMDD');
    const currentTime = moment().format('HH:mm');
    console.log('Duong: checkCheckOutStatus -> currentTime', currentTime);
    if (sittingRequest.status == 'ONGOING') {
        if (sittingDate <= currentDate) {
            if (startTime <= currentTime) {
                return true;
            }
        }
    }

    return false;
}

/**
 * convert a time range into an array of 2 elements
 * @param  {String} time 'HH-HH'
 * @returns {Array<String}
 */
export function splitTimeRange(time) {
    if (time == null) {
        return null;
    }
    let arr = [];

    arr = time.split('-');

    return arr;
}

/**
 * check if the sitting request date are in babysitter weekly schedule
 * @param  {Date} date the sitting date
 * @param  {String} range the babysitter's weekly schedule
 * @returns {Boolean} true or false
 */
export function dateInRange(date, range) {
    let flag = false;

    let weekDay = getDayOfWeek(date);

    let bsitterWorkDates = getWeekRange(range);

    bsitterWorkDates.forEach((workDate) => {
        if (workDate == weekDay) {
            flag = true;
            return;
        }
    });

    return flag;
}

/**
 * get day of the week of a date
 * @param  {Date} date
 */
function getDayOfWeek(date) {
    var dayOfWeek = new Date(date).getDay();
    return isNaN(dayOfWeek)
        ? null
        : ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][dayOfWeek];
}

/**
 * get array of days of the week of a babysitter schedule
 * @param  {String} range
 * @returns {Array<String>}
 */
function getWeekRange(range) {
    if (range == null) {
        return null;
    }
    let arr = [];

    arr = range.split(',');

    return arr;
}

/**
 * check if the request time and babysitter vailable is matched
 * @param  {String} startTime
 * @param  {String} endTime
 * @param  {String} bDaytime
 * @param  {String} bEvening
 * @returns {Boolean}
 */
export function checkSittingTime(startTime, endTime, bDaytime, bEvening) {
    let flag = false;
    let daytime = splitTimeRange(bDaytime);
    let evening = splitTimeRange(bEvening);
    let combine = null;

    // if daytime end equal evening time start then combine work time to daytime start and evening end
    if (daytime[1] == evening[0]) {
        combine = [daytime[0], evening[1]];
    }

    // check for combine time if it not null
    if (combine != undefined && combine != null) {
        if (timeIsInRange(startTime, combine)) {
            if (timeIsInRange(endTime, combine)) {
                flag = true;
            }
        }
    }

    // check for daytime or evening time
    if (timeIsInRange(startTime, daytime)) {
        if (timeIsInRange(endTime, daytime)) {
            flag = true;
        }
    } else if (timeIsInRange(startTime, evening)) {
        if (timeIsInRange(endTime, evening)) {
            flag = true;
        }
    }

    return flag;
}

/**
 * check if time in range
 * @param  {String} time
 * @param  {Array<String>} range
 * @returns {Boolean}
 */
function timeIsInRange(time, range) {
    if (range == null) {
        return false;
    }

    if (time >= range[0] && time <= range[1]) {
        return true;
    }

    return false;
}
