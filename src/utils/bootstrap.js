import models from '@models';
import moment from 'moment';
import { hashPassword } from '@utils/hash';
import { randomInt, randomFloat } from '@utils/common';

export async function insertDatabase() {
    const db = models.sequelize.models;
    let img1 =
        'data:image/jpeg;base64,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';
    let img2 =
        'data:image/jpeg;base64,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';
    let img3 =
        'data:image/jpeg;base64,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';
    let img4 =
        'data:image/jpeg;base64,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';
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
        address: '222 Quang Trung, Phường 10, Gò Vấp, Hồ Chí Minh, Vietnam',
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
        phoneNumber: '07',
        email: 'Khanh@gmail.com',
        password: await hashPassword('12341234'),
        nickname: 'MR.Khanh',
        address: '200 Quang Trung, Phường 10, Gò Vấp, Hồ Chí Minh, Vietnam',
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
        phoneNumber: '04',
        email: 'dong4@gmail.com',
        password: await hashPassword('12341234'),
        nickname: 'DongBS',
        address: '90 Quang Trung, Phường 10, Gò Vấp, Hồ Chí Minh, Vietnam',
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
        phoneNumber: '05',
        email: 'ky@gmail.com',
        password: await hashPassword('12341234'),
        nickname: 'Ky',
        address: '150 Quang Trung, Phường 10, Gò Vấp, Hồ Chí Minh, Vietnam',
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
        phoneNumber: '06',
        email: 'duong@gmail.com',
        password: await hashPassword('12341234'),
        nickname: 'Duong',
        address: '100 Quang Trung, Phường 10, Gò Vấp, Hồ Chí Minh, Vietnam',
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
                    db.children.bulkCreate([
                        {
                            name: 'child 1',
                            age: 1,
                            parentId: 4,
                            image: img1,
                        },
                        {
                            name: 'child 2',
                            age: 1,
                            parentId: 4,
                            image: img2,
                        },
                        {
                            name: 'child 3',
                            age: 1,
                            parentId: 4,
                            image: img3,
                        },
                        {
                            name: 'child 4',
                            age: 1,
                            parentId: 3,
                            image: img4,
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
                        averageRating: 4.5,
                        totalFeedback: 20,
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
                        averageRating: 5,
                        totalFeedback: 1,
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
                        averageRating: 4,
                        totalFeedback: 1,
                    };
                }

                babysitters.push(babysitter);
            });
            db.babysitter.bulkCreate(babysitters);
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
                            '529 Lê Đức Thọ, Phường 16, Gò Vấp, Hồ Chí Minh, Vietnam',
                        status: 'PENDING',
                    },
                    {
                        createdUser: 2,
                        acceptedBabysitter: 3,
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
                        acceptedBabysitter: 4,
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
                        createdUser: 5,
                        acceptedBabysitter: 3,
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
                                    receiver: 3,
                                    status: 'PENDING',
                                },
                                {
                                    requestId: el.id,
                                    sender: el.createdUser,
                                    receiver: 4,
                                    status: 'PENDING',
                                },
                                {
                                    requestId: el.id,
                                    sender: el.createdUser,
                                    receiver: 5,
                                    status: 'PENDING',
                                },
                                {
                                    requestId: el.id,
                                    sender: el.createdUser,
                                    receiver: 6,
                                    status: 'PENDING',
                                },
                            ]);
                        }
                        //#endregion

                        //#region feedbacks
                        if (el.status === 'DONE') {
                            // seed feedback
                            db.feedback.bulkCreate([
                                {
                                    requestId: el.id,
                                    rating: 4,
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
}
