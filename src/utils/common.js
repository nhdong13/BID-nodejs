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
    const startTime = moment(sittingRequest.startTime, "HH:mm").format('HH:mm');
    const currentDate = moment().format('YYYYMMDD');
    const currentTime = moment().format('HH:mm');
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
    const endTime = moment(sittingRequest.endTime, "HH:mm").add(30, 'minutes').format('HH:mm');
    console.log("Duong: checkCheckOutStatus -> endTime", endTime)
    const currentDate = moment().format('YYYYMMDD');
    const currentTime = moment().format('HH:mm');
    console.log("Duong: checkCheckOutStatus -> currentTime", currentTime)
    if (sittingRequest.status == 'ONGOING') {
        if (sittingDate <= currentDate) {
            if (endTime <= currentTime) {
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