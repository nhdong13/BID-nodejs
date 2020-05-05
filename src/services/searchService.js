import models from '@models/';
import env, { checkEnvLoaded } from '@utils/env';
import Config from '@services/configService';
import Sequelize, { Op } from 'sequelize';

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
 *
 * @param  {String} name
 * @return {Array<babysitter>} matchedList
 */
export async function searchBabysitterAdvanced(
    name,
    skills,
    certs,
    baseAddress,
) {
    let matchedList = [];

    if (name !== undefined && name !== null) {
        matchedList = await searchForBabysitter(name);
    }

    if (skills && skills.length > 0) {
        matchedList = await matchedSkill(skills, matchedList);
    }

    if (certs && certs.length > 0) {
        matchedList = await matchedCert(certs, matchedList);
    }

    // calculate distance with api Google

    if (baseAddress) {
        // matchedList = await getBabysitterDistance(
        //     baseAddress,
        //     matchedList,
        // );
    }

    // calculate distance with magic and stuff you know
    matchedList = await randomizeDistance(matchedList);

    return matchedList;
}

/**
 *
 * @param  {String} name
 * @returns {} list of babysitters
 */
async function searchForBabysitter(name) {
    let list = await models.babysitter.findAll({
        include: [
            {
                model: models.user,
                as: 'user',
                where: {
                    nickname: { [Op.substring]: name },
                },
                include: [
                    {
                        model: models.schedule,
                        as: 'schedules',
                    },
                    {
                        model: models.sitterSkill,
                        as: 'sitterSkills',
                    },
                    {
                        model: models.sitterCert,
                        as: 'sitterCerts',
                    },
                ],
            },
        ],
    });

    return list;
}

/**
 *
 * @param  {Array<requiredSkill>} requiredSkills the required skills list
 * @param  {Array<babysitter>} babysitters the list of babysitters to check
 * @returns {Array} matchedList
 */
async function matchedSkill(requiredSkills, babysitters) {
    let matchedList = [];

    let requiredSkillSet = requiredSkills.map((skill) => {
        return parseInt(skill.skillId);
    });

    const promises = babysitters.map(async (sitter) => {
        let skillSet = [];
        let result = false;

        if (sitter.user.sitterSkills !== undefined) {
            skillSet = sitter.user.sitterSkills.map((skill) => {
                return skill.skillId;
            });
            result = requiredSkillSet.every((val) => skillSet.includes(val));
        }

        if (result) {
            matchedList.push(sitter);
        }
    });
    await Promise.all(promises);

    return matchedList;
}

/**
 *
 * @param  {Array<requiredCert>} requiredCerts the required skills list
 * @param  {Array<babysitter>} babysitters the list of babysitters to check
 * @returns {Array} matchedList
 */
async function matchedCert(requiredCerts, babysitters) {
    let matchedList = [];

    let requiredCertSet = requiredCerts.map((cert) => {
        return parseInt(cert.certId);
    });

    const promises = babysitters.map(async (sitter) => {
        let certSet = [];
        let result = false;

        if (
            sitter.user.sitterCerts !== undefined &&
            sitter.user.sitterCerts != null
        ) {
            certSet = sitter.user.sitterCerts.map((cert) => {
                return cert.certId;
            });
            result = requiredCertSet.every((val) => certSet.includes(val));
        }

        if (result) {
            matchedList.push(sitter);
        }
    });
    await Promise.all(promises);

    return matchedList;
}

/**
 * random distances
 * @param  {String} baseAddress
 * @param  {Array<babysitter>} listOfSitter
 * @returns {} matchedList distance in 'km'
 */
async function randomizeDistance(listOfSitter) {
    let matchedList = [];

    const promises = listOfSitter.map(async (sitter) => {
        // x.x
        let distance = await parseFloat(sitter.userId / 10).toFixed(1);

        if (distance < 1) {
            sitter.distance = `${distance} km`;
            // sitter.distance = distance;
            matchedList.push(sitter);
        }
    });
    await Promise.all(promises);

    return matchedList;
}

/**
 * get the distance between the sitting address and the babysitter's address
 * and filter out babysitters who are too far away (> MAX_TRAVEL_DISTANCE)
 * @param  {String} baseAddress
 * @param  {Array<babysitter>} listOfSitter
 * @returns {} matchedList distance is in 'km'
 */
async function getBabysitterDistance(baseAddress, listOfSitter) {
    console.log('--- Getting distance data ...');
    let matchedList = [];

    let address1LatLog = await placeSearch(baseAddress);
    address1LatLog = address1LatLog[0].geometry.location;

    try {
        const promises = listOfSitter.map(async (sitter) => {
            let sitterLatlog;
            if (!sitter.user.latlog) {
                sitterLatlog = await placeSearch(sitter.user.address);
                sitterLatlog = sitterLatlog[0].geometry.location;
                sitterLatlog = `${sitterLatlog.lat},${sitterLatlog.lng}`;
                sitter.user.update({
                    latlog: sitterLatlog,
                });
            } else {
                sitterLatlog = sitter.user.latlog;
            }

            // x.x km || x.x m
            let distance = await getDistance(address1LatLog, sitterLatlog);

            // x.x
            let temp = distance.split(' ');
            let unit = temp[1];
            if (unit == 'km') {
                let distanceKm = temp[0];
                if (distanceKm < Config.getMaxTravelDistance()) {
                    sitter.distance = distance;
                    matchedList.push(sitter);
                } else {
                    console.log(
                        `${sitter.user.nickname} is two far away: ${distance}`,
                    );
                }
            } else {
                sitter.distance = distance;
                matchedList.push(sitter);
            }
        });
        await Promise.all(promises);
    } catch (error) {
        console.log('Duong: getBabysitterDistance -> error', error);
    }

    console.log('--- Done getting distance data ...');
    return matchedList;
}

async function placeSearch(address) {
    try {
        let result = await mapsClient
            .findPlace({
                input: address,
                inputtype: 'textquery',
                fields: ['geometry'],
            })
            .asPromise();
        return result.json.candidates;
    } catch (error) {
        console.log('Duong: placeSearch -> error', error);
    }
}
