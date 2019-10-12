import seq from 'sequelize'
import models from '@models/';
import {
    matching
} from '@utils/matchingService';

import {callAPI} from '@utils/distanceAPI';

// CONSTANTS WEIGHTED MULTIPLIER (total = 1)
const CIRCLE_WEIGHTED = 0.5;
const RATING_WEIGHTED = 0.4;
const DISTANCE_WEIGHTED = 0.1;

export async function recommendToParent(request) {
    let listMatched = await matching(request);
    let recommendList = [];
    
    let res = callAPI(request.sittingAddress, listMatched[1].address);

    console.log(res);
    // init a list of matched babysitters's id and their circle weighted
    let listWithCircle = listMatched.map(x => {
        let temp = {
            'id': x.userId,
            'circleW': 0
        };

        return temp;
    });
    // init a list of matched babysitters's id and their rating weighted
    let listWithRating = listMatched.map(x => {
        let temp = {
            'id': x.userId,
            'ratingW': 0
        };

        return temp;
    });
    // init a list of matched babysitters's id and their distance weighted
    let listWithDistance = listMatched.map(x => {
        let temp = {
            'id': x.userId,
            'distanceW': 0
        };

        return temp;
    });
    // init a list of matched babysitters's id and their total score for recommendation
    let listWithTotal = listMatched.map(x => {
        let temp = {
            'id': x.userId,
            'total': 0
        };

        return temp;
    });

    // calculate babysitter's circle weighted
    listWithCircle = await calCircle(request.createdUser, listWithCircle);
    // calculate babysitter's rating weighted
    listWithRating = await calRating(request.createdUser, listWithRating);
    // calculate babysitter's distance weighted
    listWithDistance = await calDistance(request.createdUser, listWithDistance);
    // calculate babysitter's total score
    listWithTotal = await calDistance(listWithCircle, listWithRating, listWithDistance, listWithTotal);


    return recommendList;
}

// calculate the total score of a babysitter to a parent request
function calScore(listWithCircle, listWithRating, listWithDistance, listWithTotal) {

}

// calculate the weight of trust circle
async function calCircle(parentId, listWithCircle) {
    let circle = [];

    circle = await models.circle.findAll({
        where: {
            ownerId: parentId,
        }
    })

    await asyncForEach(circle, async (el) => {
        let srq = await models.sittingRequest.findAll({
            // attributes: [[seq.fn('DISTINCT', seq.col('acceptedBabysitter')), 'bId']],
            where: {
                createdUser: el.friendId
            }
        });

        let bsit = srq.map(x => {
            return x.acceptedBabysitter;
        });

        // calculate score for each matched babysitter of the requested parent
        // if the babysitter in matched list have been hired by this parent then increase his score
        listWithCircle = listWithCircle.map(b => {
            let found = bsit.includes(b.id);

            if (found) {
                b.cicleW += 5;
            }

            return b;
        });
    })

    return listWithCircle;
}

// calculate the weight of rating
async function calRating(parentId, listWithRating) {

}

// calculate the weight of distance
function calDistance(parentId, listWithDistance) {

}

// use if you want a forEach function with async and await
async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}
