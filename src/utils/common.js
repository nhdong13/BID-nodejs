// use if you want a forEach function with async and await
export async function asyncForEach(array, callback) {
    if (array.length != 0) {
        for (let index = 0; index < array.length; index++) {
            await callback(array[index], index, array);
        }
    }
}
