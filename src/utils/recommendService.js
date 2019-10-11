import seq from 'sequelize'
import models from '@models/';
import {
    matching
} from '@utils/matchingService';

// CONSTANTS WEIGHTED MULTIPLIER (total = 1)
const CIRCLE_WEIGHTED = 0.5;
const RATING_WEIGHTED = 0.4;
const DISTANCE_WEIGHTED = 0.1;

export async function recommendToParent(request) {
    let listMatched = await matching(request);
    let listWithWeight = [];
    let recommendList = [];

    listMatched.forEach(el => {
        listWithWeight.push({
            'id': el.userId,
            'cicleW': 0,
            'ratingW': 0,
            'distanceW': 0
        });
    });

    // console.log(listWithWeight);
    calCircle(request.createdUser, listMatched, listWithWeight);

    return recommendList;
}

// calculate the total score of a babysitter to a parent request
function calScore(parent, babysitter) {

}

// calculate the weight of trust circle
async function calCircle(parentId, babysitters, listWithWeight) {
    let circle = [];

    circle = await models.circle.findAll({
        where: {
            ownerId: parentId,
        }
    })

    circle.forEach(async function (el) {
        // get a list of babysitter's id that this parent in the circle had hired
        const a = await models.sittingRequest.findAll({
            attributes: [[seq.fn('DISTINCT', seq.col('acceptedBabysitter')), 'bId']],
            where: {
                createdUser: el.friendId
            }
        });
        console.log(a);
        console.log('------------------------------');

        // calculate score for each matched babysitter of the requested parent
        // if the babysitter in matched list have been hired by this parent then increase his score
        listWithWeight.forEach(b => {
            // find the babysitter in the list
            let found = a.map(x => {return x.bId}).includes(b.id);

            console.log(b.id);
            console.log(found);
            // increase his score
            if (found) {
                b.cicleW += 5;
            }
        });
    });
}

// calculate the weight of rating
function calRating(parent, babysitter) {

}

// calculate the weight of distance
function calDistance(parent, babysitter) {

}
