import models from '@models';
import moment from 'moment';
import { hashPassword } from '@utils/hash';


export async function insertDatabase() {
    const db = models.sequelize.models;
    console.log("inserting records to databse....");
    // muon insert bang nao thi db.ten_model cua bang do ex: db.circle, db.parent

    // seed roles
    db.role.bulkCreate(
        [
            {
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
        [
            {
                phoneNumber: '0903322351',
                email: 'cute@gmail.com',
                password: await hashPassword('12341234'),
                nickname: 'cutephomaique',
                address: '123 Quang Trung, Q12, TP Ho Chi Minh, Viet Nam',
                roleId: 2,
            },
            {
                phoneNumber: '0978199199',
                email: 'tho@gmail.com',
                password: await hashPassword('12341234'),
                nickname: 'thobaytmau',
                address: '321 heaven Q12, TP Ho Chi Minh, Viet Nam',
                roleId: 3,
            },
            {
                phoneNumber: '097111111111',
                email: 'kytom@gmail.com',
                password: await hashPassword('12341234'),
                nickname: 'kydaica',
                address: '321 livepool, Brexit',
                roleId: 3,
            }
        ]
    ).then(() => {
        // seed parents
        db.parent.bulkCreate(
            [
                {
                    userId: 1,
                    childrenNumber: 3,
                    familyDescription: 'something that only we know',
                }
            ]
        );

        // seed babysitters
        db.babysitter.bulkCreate(
            [
                {
                    userId: 2,
                    weeklySchedule: 'MON,TUE,WED',
                    daytime: '08-11',
                    evening: null,
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
                }
            ]
        );
    }).then(() => {
        // seed requests
        let date = new Date();
        date.setUTCHours(13);
        date.setUTCMinutes(0);
        db.sittingRequest.bulkCreate(
            [
                {
                    createdUser: 1,
                    acceptedBabysitter: null,
                    childrenNumber: 2,
                    sittingDate: moment().format(),
                    startTime: moment().set({ 'hour': 13, 'minute': 0, 'second': 0 }).format('hh:mm:ss'),
                    endTime: moment().set({ 'hour': 17, 'minute': 0, 'second': 0 }).format('hh:mm:ss'),
                    sittingAddress: '123 Quang Trung, Q12, TP Ho Chi Minh, Viet Nam',
                    status: 'PENDING',
                },
            ]
        ).then(() => {
            // seed invitation
            db.invitation.bulkCreate(
                [
                    {
                        requestId: 1,
                        sender: 1,
                        receiver: 2,
                        status: 'PENDING'
                    },
                ]
            );
        });
    });
}