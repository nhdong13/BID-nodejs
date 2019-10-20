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
    return parseFloat((Math.random() * (max - min)) + min).toFixed(decimal);
}