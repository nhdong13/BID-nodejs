import models from '@models';
import moment from 'moment';
import {
    hashPassword
} from '@utils/hash';


export async function insertDatabase() {
    const db = models.sequelize.models;
    console.log("inserting records to databse....");
    // muon insert bang nao thi db.ten_model cua bang do ex: db.circle, db.parent

    // seed roles
    db.role.bulkCreate(
        [{
                roleName: 'admin',
            },
            {
                roleName: 'parent',
            },
            {
                roleName: 'babysitter',
            },
            {
                roleName: 'staff',
            },
        ]
    );

    // seed users
    db.user.bulkCreate(
        [{
                phoneNumber: '0903322351',
                email: 'cute@gmail.com',
                password: await hashPassword('12341234'),
                nickname: 'cutephomaique',
                address: '529 Lê Đức Thọ, Phường 16, Gò Vấp, Hồ Chí Minh, Vietnam',
                roleId: 2,
            },
            {
                phoneNumber: '0978199199',
                email: 'tho@gmail.com',
                password: await hashPassword('12341234'),
                nickname: 'thobaytmau',
                address: '702/66 Lê Đức Thọ, Gò Vấp, Hồ Chí Minh, Vietnam',
                roleId: 3,
            },
            {
                phoneNumber: '097111111111',
                email: 'kytom@gmail.com',
                password: await hashPassword('12341234'),
                nickname: 'kydaica',
                address: '321 livepool, Brexit',
                roleId: 3,
            },
            {
                phoneNumber: '0903322352',
                email: 'parent2@gmail.com',
                password: await hashPassword('12341234'),
                nickname: 'friendOfParent1',
                address: '124 Quang Trung, Q12, TP Ho Chi Minh, Viet Nam',
                roleId: 2,
            },{
                phoneNumber: '0978199198',
                email: 'sitter3@gmail.com',
                password: await hashPassword('12341234'),
                nickname: 'ahuhu',
                address: 'Go Vap, TP Ho Chi Minh, Viet Nam',
                roleId: 3,
            },
        ]
    ).then(() => {
        // seed parents
        db.parent.bulkCreate(
            [{
                    userId: 1,
                    childrenNumber: 3,
                    familyDescription: 'something that only we know',
                },
                {
                    userId: 4,
                    childrenNumber: 3,
                    familyDescription: 'something that only we know',
                }
            ]
        ).then(() => {
            // seed circle
            db.circle.bulkCreate([{
                ownerId: 1,
                friendId: 4,
            }])
        });

        // seed babysitters
        db.babysitter.bulkCreate(
            [{
                    userId: 2,
                    weeklySchedule: 'MON,TUE,WED,FRI',
                    daytime: '08-17',
                    evening: '17-20',
                    minAgeOfChildren: 1,
                    maxNumOfChildren: 2,
                    maxTravelDistance: 10,
                },
                {
                    userId: 3,
                    weeklySchedule: 'SAT,SUN',
                    daytime: '07-11',
                    evening: '18-21',
                    minAgeOfChildren: 2,
                    maxNumOfChildren: 1,
                    maxTravelDistance: 5,
                },
                {
                    userId: 5,
                    weeklySchedule: 'MON,TUE,WED,FRI',
                    daytime: '08-17',
                    evening: '17-20',
                    minAgeOfChildren: 1,
                    maxNumOfChildren: 2,
                    maxTravelDistance: 10,
                }
            ]
        );
    }).then(() => {
        // seed requests
        db.sittingRequest.bulkCreate(
            [{
                createdUser: 1,
                acceptedBabysitter: null,
                childrenNumber: 2,
                minAgeOfChildren: 1,
                sittingDate: moment().set({'year': 2019, 'month': 9, 'date': 11}),
                startTime: moment().set({
                    'hour': 13,
                    'minute': 0,
                    'second': 0
                }).format('HH:mm:ss'),
                endTime: moment().set({
                    'hour': 17,
                    'minute': 0,
                    'second': 0
                }).format('HH:mm:ss'),
                sittingAddress: '123 Quang Trung, Q12, TP Ho Chi Minh, Viet Nam',
                status: 'PENDING',
            }, {
                createdUser: 4,
                acceptedBabysitter: 2,
                childrenNumber: 2,
                minAgeOfChildren: 1,
                sittingDate: moment().set({'year': 2019, 'month': 8, 'date': 27}),
                startTime: moment().set({
                    'hour': 9,
                    'minute': 0,
                    'second': 0
                }).format('HH:mm:ss'),
                endTime: moment().set({
                    'hour': 12,
                    'minute': 0,
                    'second': 0
                }).format('HH:mm:ss'),
                sittingAddress: '124 Quang Trung, Q12, TP Ho Chi Minh, Viet Nam',
                status: 'DONE',
            }]
        ).then(() => {
            // seed invitation
            db.invitation.bulkCreate(
                [{
                    requestId: 1,
                    sender: 1,
                    receiver: 2,
                    status: 'PENDING'
                }, ]
            );
        });
    });
}
