import models from "@models/";
import { callAPI } from "@utils/distanceAPI";
import { asyncForEach } from "@utils/common";

const MAX_TRAVEL_DISTANCE = 10;
const KEY = "AIzaSyAdyl3LLS1O2wBG5ALz8ETkJ8YphC7ogsk";
var distance = require("google-distance-matrix");

const googleMaps = require("@google/maps");

// matching parent's sitting request with available babysitter
export async function matching(sittingRequest) {
    let babysitters = await searchForBabysitter(sittingRequest.sittingAddress);
    let matchedList = matchingCriteria(sittingRequest, babysitters);
    console.time("checkSent");
    matchedList = checkIfSentInvite(sittingRequest, matchedList);
    console.timeEnd("checkSent");
    return matchedList;
}

// search for every babysitters in 'MAX_TRAVEL_DISTANCE' travel distance from parent
async function searchForBabysitter(sittingAddress) {
    let result = [];
    let list = await models.babysitter.findAll({
        include: [
            {
                model: models.user,
                as: "user"
            }
        ]
    });

    console.time("get_distance_api");
    const promises = list.map(async el => {
        // x.x km
        let distance = await getDistance(sittingAddress, el.user.address);

        // x.x
        let temp = distance.split(" ");
        
        distance = temp[0];
        if (distance < 10) {
            el.distance = distance;
            result.push(el);
        }
    });
    await Promise.all(promises);
    console.timeEnd("get_distance_api");

    if (result.length > 0){
        return result;
    }

    return list;
}

async function checkIfSentInvite(sittingRequest, babysitters) {
    
    const promises = babysitters.map(async el => {
        let found = await models.invitation.findOne({
            where: {
                requestId: sittingRequest.id,
                receiver: el.userId
            }
        });

        if (found) {
            el.isInvited = true;
        }
    });
    await Promise.all(promises);

    return babysitters;
    
}

// get the distance between 2 address 
async function getDistance(address1, address2) {
    let mapsClient = googleMaps.createClient({
        key: KEY,
        Promise: Promise
    });

    let distances = await mapsClient
        .distanceMatrix({
            origins: [address1],
            destinations: [address2],
            mode: "driving"
        })
        .asPromise();

    return distances.json.rows[0].elements[0].distance.text;
}

// matching with criteria
function matchingCriteria(request, babysitters) {
    let matchedList = [];
    console.log(
        "------------------------Matching with criteria------------------------"
    );
    console.log("Number of search: " + babysitters.length);
    babysitters.forEach(bsitter => {
        // check children number
        if (request.childrenNumber > bsitter.maxNumOfChildren) {
            console.log("CHILDREN NUMBER NOT MATCHED");
            console.log(
                "request: " +
                    request.childrenNumber +
                    "| bsitter: " +
                    bsitter.maxNumOfChildren
            );
            return;
        }
        //check minimum age of childer
        if (request.minAgeOfChildren < bsitter.minAgeOfChildren) {
            console.log("MIN AGE NOT MATCHED");
            console.log(
                "request: " +
                    request.minAgeOfChildren +
                    "| bsitter: " +
                    bsitter.minAgeOfChildren
            );
            return;
        }
        // check date
        if (!dateInRange(request.sittingDate, bsitter.weeklySchedule)) {
            console.log("SITTING DATE NOT MATCHED");
            console.log(
                "request: " +
                    request.sittingDate +
                    "| bsitter: " +
                    bsitter.weeklySchedule
            );
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
            console.log("SITTING TIME NOT MATCHED");
            console.log("request: ");
            console.log("--- start time: " + request.startTime);
            console.log("--- end time: " + request.endTime);
            console.log("bsitter: ");
            console.log("--- daytime: " + bsitter.daytime);
            console.log("--- evening: " + bsitter.evening);
            return;
        }

        // add matched
        matchedList.push(bsitter);
    });

    console.log(
        "------------------------DONE MATCHING------------------------"
    );
    console.log("Matched: " + matchedList.length);
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
