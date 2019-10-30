import models from '@models';
import moment from 'moment';
import { hashPassword } from '@utils/hash';
import { randomInt, randomFloat } from '@utils/common';
import Images from '@utils/image';

const CronJob = require('cron').CronJob;

export async function insertDatabase() {
    const db = models.sequelize.models;
    console.log('inserting records to databse....');
    // muon insert bang nao thi db.ten_model cua bang do ex: db.circle, db.parent

    // seed roles
    db.role.bulkCreate([
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
    ]);

    // seed users
    let users = [];

    //#region seed parents here
    // parent
    let user = {
        phoneNumber: '01',
        email: 'phduongse@gmail.com',
        password: await hashPassword('12341234'),
        nickname: 'Pham Hai Duong',
        address: '589 Quang Trung, Phường 8, Gò Vấp, Hồ Chí Minh, Vietnam',
        gender: 'MALE',
        dateOfBirth: moment().set({ year: 1997, month: 7, date: 19 }),
        roleId: 2,
    };
    users.push(user);

    // parent
    user = {
        phoneNumber: '02',
        email: 'phuc@gmail.com',
        password: await hashPassword('12341234'),
        nickname: 'Phuc',
        address: '529 Tran Thi Co, Phường 16, Q12, Hồ Chí Minh, Vietnam',
        gender: 'MALE',
        dateOfBirth: moment().set({
            year: randomInt(1990, 2000),
            month: randomInt(0, 11),
            date: randomInt(1, 28),
        }),
        roleId: 2,
    };
    users.push(user);

    // parent
    user = {
        phoneNumber: '03',
        email: 'dong3@gmail.com',
        password: await hashPassword('12341234'),
        nickname: 'DongPR',
        address: '102 Tran Thi Co, Phường 16, Q12, Hồ Chí Minh, Vietnam',
        gender: 'MALE',
        dateOfBirth: moment().set({
            year: randomInt(1990, 2000),
            month: randomInt(0, 11),
            date: randomInt(1, 28),
        }),
        roleId: 2,
    };
    users.push(user);

    // Mr Khanh
    user = {
        phoneNumber: '04',
        email: 'Khanh@gmail.com',
        password: await hashPassword('12341234'),
        nickname: 'MR.Khanh',
        address: '682 Quang Trung, Phường 11, Gò Vấp, Hồ Chí Minh, Vietnam',
        gender: 'MALE',
        dateOfBirth: moment().set({
            year: randomInt(1990, 2000),
            month: randomInt(0, 11),
            date: randomInt(1, 28),
        }),
        roleId: 2,
    };
    users.push(user);
    //#endregion

    //#region seed babysitter here
    // sitter
    user = {
        phoneNumber: '05',
        email: 'dong4@gmail.com',
        password: await hashPassword('12341234'),
        nickname: 'DongBS',
        address: '684 Quang Trung, Phường 8, Gò Vấp, Hồ Chí Minh, Vietnam',
        gender: 'MALE',
        dateOfBirth: moment().set({
            year: randomInt(1990, 2000),
            month: randomInt(0, 11),
            date: randomInt(1, 28),
        }),
        roleId: 3,
    };
    users.push(user);

    // sitter
    user = {
        phoneNumber: '06',
        email: 'ky@gmail.com',
        password: await hashPassword('12341234'),
        nickname: 'Ky',
        address: '181 Lê Đức Thọ, Phường 17, Gò Vấp, Hồ Chí Minh, Vietnam',
        gender: 'FEMALE',
        dateOfBirth: moment().set({
            year: randomInt(1990, 2000),
            month: randomInt(0, 11),
            date: randomInt(1, 28),
        }),
        roleId: 3,
    };
    users.push(user);

    // sitter
    user = {
        phoneNumber: '07',
        email: 'duong@gmail.com',
        password: await hashPassword('12341234'),
        nickname: 'Duong',
        address: '690 Quang Trung, Phường 8, Gò Vấp, Hồ Chí Minh, Vietnam',
        gender: 'FEMALE',
        dateOfBirth: moment().set({
            year: randomInt(1990, 2000),
            month: randomInt(0, 11),
            date: randomInt(1, 28),
        }),
        roleId: 3,
    };
    users.push(user);
    //#endregion

    //#region seed random user here
    let listName = [
        'Dũng',
        'Tuấn',
        'Minh',
        'Tú',
        'Thái',
        'Khoa',
        'Long',
        'Hưng',
        'Phong',
        'Kiên',
        'Thanh',
        'Thắng',
        'Bình',
        'Trung',
        'Quân',
    ];
    let listAddress = [
        'Lê Đức Thọ, Gò Vấp, Hồ Chí Minh, Vietnam',
        'Tô Ký, Quận 12, Hồ Chí Minh, Vietnam',
    ];

    //
    // for (let index = 0; index < 5; index++) {
    //     let firstName =
    //         listName[Math.floor(Math.random() * (listName.length - 1))];
    //     let lastName =
    //         listName[Math.floor(Math.random() * (listName.length - 1))];
    //     let address =
    //         listAddress[Math.floor(Math.random() * (listAddress.length - 1))];
    //     let houseNumber = Math.floor(Math.random() * 200);

    //     let user = {
    //         phoneNumber: index + 5,
    //         email: lastName + firstName + index + "@gmail.com",
    //         password: await hashPassword("12341234"),
    //         nickname: lastName + " " + firstName,
    //         address: houseNumber + ", " + address,
    //         gender: index%2 ? "FEMALE": 'MALE',
    //         dateOfBirth: moment().set({
    //             year: Math.floor(Math.random() * (2000 - 1980)) + 1980,
    //             month: Math.floor(Math.random() * 11),
    //             date: Math.floor(Math.random() * 28)
    //         }),
    //         roleId: 3
    //     };

    //     users.push(user);
    // }
    //#endregion

    // start seeding users
    db.user
        .bulkCreate(users)
        // after creating users
        .then((result) => {
            //#region seed parent based on user and seed circle of parent
            // get parents from the result of creating user
            let userParents = result.filter((user) => user.roleId == 2);
            let parents = [];

            // seed parent data here
            userParents.forEach((el) => {
                let parent = {
                    userId: el.id,
                    childrenNumber: 3,
                    familyDescription: '',
                };
                parents.push(parent); // push to array parents
            });

            // create the parents
            db.parent
                .bulkCreate(parents)
                // after creating parents -> seed circles
                .then((result) => {
                    //#region seed circles
                    let parents = result;
                    // seed circle
                    db.circle.bulkCreate([
                        {
                            ownerId: result[0].userId, // parent[0]
                            friendId: result[1].userId, // is friend with parent[1]
                        },
                        {
                            ownerId: result[0].userId, // parent[0]
                            friendId: result[2].userId, // is friend with parent[2]
                        },
                    ]);
                    //#endregion
                    //seed children
                    let image = new Images();
                    db.children.bulkCreate([
                        {
                            name: 'Phong',
                            age: 1,
                            parentId: 4,
                            image: image.img1,
                        },
                        {
                            name: 'Quân',
                            age: 2,
                            parentId: 4,
                            image: image.img2,
                        },
                        {
                            name: 'Trang',
                            age: 3,
                            parentId: 4,
                            image: image.img3,
                        },
                        {
                            name: 'Linh',
                            age: 1,
                            parentId: 3,
                            image: image.img4,
                        },
                        {
                            name: 'Dương Jr',
                            age: 1,
                            parentId: 1,
                            image: image.img4,
                        },
                    ]);
                });
            //#endregion

            //#region seed babysitters
            let userBabysitters = result.filter((user) => user.roleId == 3);
            let babysitters = [];

            userBabysitters.forEach(function(el, index) {
                let babysitter = {};
                if (index < 1) {
                    babysitter = {
                        userId: el.id,
                        weeklySchedule: 'MON,TUE,WED,THU,FRI',
                        daytime: '08-17',
                        evening: '17-20',
                        minAgeOfChildren: 1,
                        maxNumOfChildren: 2,
                        maxTravelDistance: 10,
                        averageRating: 0,//4.5,
                        totalFeedback: 0,//20,
                    };
                } else if (index < 2) {
                    babysitter = {
                        userId: el.id,
                        weeklySchedule: 'MON,TUE,WED,THU,FRI',
                        daytime: '08-17',
                        evening: '17-21',
                        minAgeOfChildren: 1,
                        maxNumOfChildren: 2,
                        maxTravelDistance: 10,
                        averageRating: 0,//5,
                        totalFeedback: 0,//1,
                    };
                } else {
                    babysitter = {
                        userId: el.id,
                        weeklySchedule: 'TUE,THU,SAT',
                        daytime: '08-17',
                        evening: '17-22',
                        minAgeOfChildren: 1,
                        maxNumOfChildren: 2,
                        maxTravelDistance: 10,
                        averageRating: 0,//4,
                        totalFeedback: 0,//1,
                    };
                }

                babysitters.push(babysitter);
            });
            db.babysitter.bulkCreate(babysitters)
            // seed schedule
            // .then((result) => {
            //     let sitters = result;
            //     let schedules = [];

            //     let schedule = {
            //         userId: sitters[0].userId,
            //         scheduleTime: '15:00:00 20:00:00 11 10 2019',
            //         type: 'UNAVAILABLE',
            //     }

            //     // moment().add(10, 'seconds').toDate(),

            //     schedules.push(schedule);

            //     db.schedule.bulkCreate(schedules).then(() => {
            //         db.schedule.findOne({
                
            //         }).then((result) => {
            //             let scheduleTime = moment().add(10, 'seconds').toDate();
            //             let cronJ = new CronJob(scheduleTime, function() {
            //                 console.log("Duong: bootstrap.js insertDatabase -> scheduleTime", scheduleTime)
            //                 console.log('HAKUNA MATATA!!!');
            //             }, null, true,);
            //         });
            //     });
            // });
            //#endregion
        })
        .then(() => {
            //#region seed requests
            db.sittingRequest
                .bulkCreate([
                    {
                        createdUser: 1,
                        acceptedBabysitter: null,
                        childrenNumber: 2,
                        minAgeOfChildren: 1,
                        sittingDate: moment().set({
                            year: 2019,
                            month: 9,
                            date: 11,
                        }),
                        startTime: moment()
                            .set({
                                hour: 13,
                                minute: 0,
                                second: 0,
                            })
                            .format('HH:mm:ss'),
                        endTime: moment()
                            .set({
                                hour: 17,
                                minute: 0,
                                second: 0,
                            })
                            .format('HH:mm:ss'),
                        sittingAddress:
                            '589 Quang Trung, Phường 8, Gò Vấp, Hồ Chí Minh, Vietnam',
                        status: 'PENDING',
                    },
                    {
                        createdUser: 2,
                        acceptedBabysitter: null,
                        childrenNumber: 2,
                        minAgeOfChildren: 1,
                        sittingDate: moment().set({
                            year: 2019,
                            month: 9,
                            date: 11,
                        }),
                        startTime: moment()
                            .set({
                                hour: 15,
                                minute: 0,
                                second: 0,
                            })
                            .format('HH:mm:ss'),
                        endTime: moment()
                            .set({
                                hour: 20,
                                minute: 0,
                                second: 0,
                            })
                            .format('HH:mm:ss'),
                        sittingAddress:
                            '100 Tran Thi Co, Phường 16, Q12, Hồ Chí Minh, Vietnam',
                        status: 'PENDING',
                    },
                    {
                        createdUser: 2,
                        acceptedBabysitter: 6,
                        childrenNumber: 2,
                        minAgeOfChildren: 1,
                        sittingDate: moment().set({
                            year: 2019,
                            month: 8,
                            date: 26,
                        }),
                        startTime: moment()
                            .set({
                                hour: 9,
                                minute: 0,
                                second: 0,
                            })
                            .format('HH:mm:ss'),
                        endTime: moment()
                            .set({
                                hour: 12,
                                minute: 0,
                                second: 0,
                            })
                            .format('HH:mm:ss'),
                        sittingAddress:
                            '100 Tran Thi Co, Phường 16, Q12, Hồ Chí Minh, Vietnam',
                        status: 'DONE',
                    },
                    {
                        createdUser: 2,
                        acceptedBabysitter: 5,
                        childrenNumber: 2,
                        minAgeOfChildren: 1,
                        sittingDate: moment().set({
                            year: 2019,
                            month: 8,
                            date: 25,
                        }),
                        startTime: moment()
                            .set({
                                hour: 9,
                                minute: 0,
                                second: 0,
                            })
                            .format('HH:mm:ss'),
                        endTime: moment()
                            .set({
                                hour: 12,
                                minute: 0,
                                second: 0,
                            })
                            .format('HH:mm:ss'),
                        sittingAddress:
                            '124 Quang Trung, Q12, TP Ho Chi Minh, Viet Nam',
                        status: 'DONE',
                    },
                    //#endregion
                ])
                .then((result) => {
                    //#region seed invitations
                    result.forEach((el) => {
                        if (el.status === 'PENDING') {
                            db.invitation.bulkCreate([
                                {
                                    requestId: el.id,
                                    sender: el.createdUser,
                                    receiver: 7,
                                    status: 'CONFIRMED',
                                },
                                {
                                    requestId: el.id,
                                    sender: el.createdUser,
                                    receiver: 6,
                                    status: 'EXPIRED',
                                },
                            ]);
                        }
                        //#endregion

                        //#region feedbacks
                        if (el.status === 'DONE') {
                            // seed feedback
                            db.feedback.bulkCreate([
                                {
                                    // requestId: el.id,
                                    // rating: 4,
                                },
                            ]);
                        }
                        //#endregion
                    });
                })
                .catch((err) => {
                    console.log(err);
                });

            console.log('Finish insert to database.');
            
            
        });
    db.configuration.bulkCreate([
        {
            price: 100,
            description: 'Base',
        },
        {
            price: 150,
            date: moment().set({ year: 2019, month: 9, date: 24 }),
            startTime: moment()
                .set({ hour: 17, minute: 0, second: 0 })
                .format('HH:mm:ss'),
            endTime: moment()
                .set({ hour: 18, minute: 0, second: 0 })
                .format('HH:mm:ss'),
        },
    ]);
    for (var i=20; i<30;i++){
        db.configuration.bulkCreate([
            {
                price: 150,
                date: moment().set({ year: 2019, month: 9, date: i }),
                startTime: moment()
                    .set({ hour: 17, minute: 0, second: 0 })
                    .format('HH:mm:ss'),
                endTime: moment()
                    .set({ hour: 18, minute: 0, second: 0 })
                    .format('HH:mm:ss'),
            },
        ]);
    }
}
