import models from '@models';
import Sequelize from 'sequelize';

export async function getCircleDetail(ownerId) {
    let circle = await getCircle(ownerId);
    let hiredSitter = await findHiredSitters(ownerId);
    let friendSitter = await findFriendSittersInCircle(circle);

    return {circle: circle, hiredSitter: hiredSitter, friendSitter: friendSitter};
}

async function getCircle(ownerId) {
    let circle = await models.circle.findAll({
        where: {
            ownerId: ownerId,
        },
        include: [
            {
                model: models.parent,
                as: 'friend',
                include: [
                    {
                        model: models.user,
                        as: 'user',
                    },
                ],
            },
        ],
    });

    return circle;
}

async function findHiredSitters(userId) {
    let hiredIds = await models.sittingRequest.findAll({
        attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('acceptedBabysitter')), 'acceptedBabysitter']],
        where: {
            createdUser: userId,
        },
        // include: {
        //     model: models.user,
        //     as: 'bsitter',
        //     include: {
        //         model: models.babysitter,
        //         as: 'babysitter',
        //     }
        // }
    });

    if (hiredIds.length <= 0) {
        return [];
    }

    hiredIds = hiredIds.map(id => { return id.acceptedBabysitter});

    let hireds = await models.babysitter.findAll({
        where: {
            userId: {
                [Sequelize.Op.or]: hiredIds,
            }
        },
        include: {
            model: models.user,
            as: 'user',
        }
    });

    return hireds;
}

async function findFriendSittersInCircle(circle) {
    if (circle.length <= 0) {
        return [];
    }
    let friends = circle.map(record => {
        return record.friendId;
    })
    let friendSitterIds = await models.sittingRequest.findAll({
        attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('acceptedBabysitter')), 'acceptedBabysitter']],
        where: {
            createdUser: {
                [Sequelize.Op.or]: friends,
            },
        },
        // include: {
        //     model: models.user,
        //     as: 'user',
        //     include: {
        //         model: models.babysitter,
        //         as: 'babysitter',
        //     }
        // }
    });

    friendSitterIds = friendSitterIds.map(id => {return id.acceptedBabysitter});
    
    let friendSitter = await models.babysitter.findAll({
        
        where: {
            userId: {
                [Sequelize.Op.or]: friendSitterIds
            }
        },
        include: {
            model: models.user,
            as: 'user',
            attributes: {exclude: ['password']},
        }
    });
        
    return friendSitter;
}