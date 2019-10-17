import seq from "sequelize";
import models from "@models/";
import { matching } from "@services/matchingService";
import { callAPI } from "@utils/distanceAPI";
import { asyncForEach } from '@utils/common'

// CONSTANTS WEIGHTED MULTIPLIER (total = 1)
const CIRCLE_WEIGHTED = 0.5;
const RATING_WEIGHTED = 0.4;
const DISTANCE_WEIGHTED = 0.1;
const M = 5;

export async function recommendToParent(request, listMatched) {
    let recommendList = [];

    // init a list of matched babysitters's id and their circle weighted
    let listWithCircle = listMatched.map(x => {
        let temp = {
            id: x.userId,
            circleW: 0
        };

        return temp;
    });
    // init a list of matched babysitters's id and their rating weighted
    let listWithRating = listMatched.map(x => {
        let temp = {
            id: x.userId,
            ratingW: 0,
            averageRating: x.averageRating,
            totalFeedback: x.totalFeedback,
        };

        return temp;
    });
    // init a list of matched babysitters's id and their distance weighted
    let listWithDistance = listMatched.map(x => {
        let temp = {
            id: x.userId,
            distanceW: 0
        };

        return temp;
    });
    // init a list of matched babysitters's id and their total score for recommendation
    let listWithTotal = listMatched.map(x => {
        let temp = {
            id: x.userId,
            total: 0
        };

        return temp;
    });

    // calculate babysitter's circle weighted
    listWithCircle = await calCircle(request.createdUser, listWithCircle);
    // calculate babysitter's rating weighted
    listWithRating = await calRating(listWithRating);
    // calculate babysitter's distance weighted
    listWithDistance = await calDistance(request.createdUser, listWithDistance);
    // calculate babysitter's total score
    listWithTotal = await calScore(
        listWithCircle,
        listWithRating,
        listWithDistance,
        listWithTotal
    );

    // filter out babysitter with total score <= 0
    listWithTotal = listWithTotal.filter(x => x.total > 0);

    // sort the list descending
    listWithTotal = listWithTotal.sort(function(a, b) {
        return a.total < b.total;
    });

    // push to recommendList
    listWithTotal.forEach(el => {
        let found = listMatched.find(x => x.userId == el.id);

        if (found) {
            recommendList.push(found);
        }
    });

    return recommendList;
}

// calculate the total score of a babysitter to a parent request
async function calScore(listWithCircle, listWithRating, listWithDistance, listWithTotal) {
    listWithTotal.forEach(el => {
        //
        let c = listWithCircle.find(x => {
            return x.id == el.id;
        });
        //
        let r = listWithRating.find(x => {
            return x.id == el.id;
        });
        //
        let d = listWithDistance.find(x => {
            return x.id == el.id;
        });

        //
        if (c != null && c != undefined) {
            el.total += c.circleW * CIRCLE_WEIGHTED;
        }
        //
        if (r != null && r != undefined) {
            el.total += r.ratingW * RATING_WEIGHTED;
        }
        //
        if (d != null && d != undefined) {
            el.total += d.distanceW * DISTANCE_WEIGHTED;
        }

        el.total = Math.round(el.total);
    });
    return await listWithTotal;
}

// calculate the weight of trust circle
async function calCircle(parentId, listWithCircle) {
    let circle = [];

    circle = await models.circle.findAll({
        where: {
            ownerId: parentId
        }
    });

    await asyncForEach(circle, async el => {
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
                b.circleW += 10;
            }

            return b;
        });
    });

    return listWithCircle;
}

// calculate the weight of rating
async function calRating(listWithRating) {
    let c = await meanRating(listWithRating);

    await asyncForEach(listWithRating, async el => {
        el.ratingW = await weightedRating(c, el);
    });

    return listWithRating;
}

// calculate the weight of distance
function calDistance(parentId, listWithDistance) {
    return listWithDistance;
}



// (v/(v+M) * r) + (M/(M+v) * C)
// v is the number of feedback for the babysitter;
// m is the minimum votes required to be listed in the chart;
// R is the average rating of the babysitter;
// C is the mean rating across the whole report;
// reference: https://www.datacamp.com/community/tutorials/recommender-systems-python?utm_source=adwords_ppc&utm_campaignid=1455363063&utm_adgroupid=65083631748&utm_device=m&utm_keyword=&utm_matchtype=b&utm_network=g&utm_adpostion=1t1&utm_creative=332602034358&utm_targetid=aud-517318242147:dsa-473406569915&utm_loc_interest_ms=&utm_loc_physical_ms=1028581&gclid=CjwKCAjw2qHsBRAGEiwAMbPoDNQfPEHKIX-J2DC5HoNN_oD7bWBEgXU_Forvnm3x4VWLy2FbZmNGFhoCV9cQAvD_BwE
async function weightedRating(C, babysitter) {
    let v = babysitter.totalFeedback;
    let r = babysitter.averageRating;

    let wR = (v/(v + M) * r) + (M/(M + v) * C);
    let result = Math.round(wR * 10); 

    return result;
}

async function meanRating(listWithRating) {
    if (!(listWithRating === undefined || listWithRating.length == 0)) {
        let C = 0.0;
        listWithRating.forEach(el => {
            C += el.averageRating;
        });
        C = C/listWithRating.length;

        return C;
    }
    return null;
}
