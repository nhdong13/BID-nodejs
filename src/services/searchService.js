import models from '@models/';
import { checkSittingTime, dateInRange } from '@utils/common';
import env, { checkEnvLoaded } from '@utils/env';
import Config from '@services/configService';

checkEnvLoaded();
const { apiKey } = env;

// const MAX_TRAVEL_DISTANCE = 3;
const KEY = apiKey;
var distance = require('google-distance-matrix');

const googleMaps = require('@google/maps');
const mapsClient = googleMaps.createClient({
    key: KEY, // api key
    Promise: Promise, // enable promise request
});

/**
 * matching parent's sitting request with available babysitter
 * @param  {sittingRequest} sittingRequestresponse
 * @return {Array<babysitter>} matchedList
 */
export async function searchBabysitterAdvanced(sittingRequest) {
    let matchedList = []

    return matchedList;
}