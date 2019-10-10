import models from '@models/'

const MAX_TRAVEL_DISTANCE = 10;

// matching parent's sitting request with available babysitter
export async function matching(sittingRequest) {
    let babysitters = await searchForBabysitter(sittingRequest.address);
    console.log(babysitters);
    let matchedList = matchingCriteria(sittingRequest, babysitters);

    return matchedList;
}

// search for every babysitters in 10km travel distance from parent
async function searchForBabysitter(address){
    let list = await models.babysitter.findAll();

    return list;
}

// matching with criteria
function matchingCriteria(request, babysitters){
    console.log("/nHere we go");
    let matchedList = [];

    babysitters.forEach(bsitter => {
        // check children number
        if (request.childrenNumber > bsitter.maxNumOfChildren) {
            return;
        }
        // check date
        if (dateInRange(request.sittingDate, bsitter.weeklySchedule)) {
            return;
        }
        // check time
        
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
    return isNaN(dayOfWeek) ? null : ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][dayOfWeek];
}

// get array of days of the week of a babysitter schedule
function getWeekRange(range) {
    let arr = [];

    arr = range.split(',');

    return arr;
}

//
function checkSittingTime(startTime, endTime, daytime, evening) {
    
}