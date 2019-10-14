import models from "@models/";

const MAX_TRAVEL_DISTANCE = 10;

// matching parent's sitting request with available babysitter
export async function matching(sittingRequest) {
    let babysitters = await searchForBabysitter(sittingRequest.address);
    let matchedList = matchingCriteria(sittingRequest, babysitters);

    return matchedList;
}

// search for every babysitters in 10km travel distance from parent
async function searchForBabysitter(address) {
    let list = await models.babysitter.findAll({
        include: [{
            model: models.user,
            as: 'user',
        }]
    });

    return list;
}

// matching with criteria
function matchingCriteria(request, babysitters) {
    let matchedList = [];

    babysitters.forEach(bsitter => {
        // check children number
        if (request.childrenNumber > bsitter.maxNumOfChildren) {
            return;
        }
        //check minimum age of childer
        if (request.minAgeOfChildren < bsitter.minAgeOfChildren) {
            return;
        }
        // check date
        if (!dateInRange(request.sittingDate, bsitter.weeklySchedule)) {
            return;
        }
        // check time
        if (
            !checkSittingTime(
                request.startTime,
                request.endTime,
                bsitter.daytime,
                bsitter.evening
            )
        ) {
            return;
        }
        // add matched
        matchedList.push(bsitter);
    });

    return matchedList;
}

// check if the sitting request date are in babysitter weekly schedule
function dateInRange(date, range) {
    let flag = false;

    let weekDay = getDayOfWeek(date);

    let bsitterWorkDate = getWeekRange(range);

    bsitterWorkDate.forEach(element => {
        if (element == weekDay) {
            flag = true;
            return;
        }
    });

    return flag;
}

// get day of the week of a date
function getDayOfWeek(date) {
    var dayOfWeek = new Date(date).getDay();
    return isNaN(dayOfWeek)
        ? null
        : ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"][dayOfWeek];
}

// get array of days of the week of a babysitter schedule
function getWeekRange(range) {
    if (range == null) {
        return null;
    }
    let arr = [];

    arr = range.split(",");

    return arr;
}

// check if the request time and babysitter vailable is matched
function checkSittingTime(startTime, endTime, bDaytime, bEvening) {
    let flag = false;
    let daytime = getAvailableTime(bDaytime);
    let evening = getAvailableTime(bEvening);

    if (timeIsInRange(startTime, daytime)) {
        if (timeIsInRange(endTime, daytime)) {
            flag = true;
        } else if (timeIsInRange(endTime, evening)) {
            flag = true;
        }
    } else if (timeIsInRange(startTime, evening)) {
        if (timeIsInRange(endTime, evening)) {
            flag = true;
        }
    }

    return flag;
}

// convert babysitter available time into an array, should only contain 2 element
function getAvailableTime(time) {
    if (time == null) {
        return null;
    }
    let arr = [];

    arr = time.split("-");

    return arr;
}

// check if time in range
function timeIsInRange(time, range) {
    if (range == null) {
        return false;
    }

    if (time >= range[0] && time <= range[1]) {
        return true;
    }

    return false;
}
