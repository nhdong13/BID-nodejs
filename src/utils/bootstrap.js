import models from "@models";
import moment from "moment";
import { hashPassword } from "@utils/hash";

export async function insertDatabase() {
    const db = models.sequelize.models;
    console.log("inserting records to databse....");
    // muon insert bang nao thi db.ten_model cua bang do ex: db.circle, db.parent

    // seed roles
    db.role.bulkCreate([
        {
            roleName: "admin"
        },
        {
            roleName: "parent"
        },
        {
            roleName: "babysitter"
        },
        {
            roleName: "staff"
        }
    ]);

    let listName = [
        "Dũng",
        "Tuấn",
        "Minh",
        "Tú",
        "Thái",
        "Khoa",
        "Long",
        "Hưng",
        "Phong",
        "Kiên",
        "Thanh",
        "Thắng",
        "Bình",
        "Trung",
        "Quân"
    ];
    let listAddress = [
        "Lê Đức Thọ, Gò Vấp, Hồ Chí Minh, Vietnam",
        "Tô Ký, Quận 12, Hồ Chí Minh, Vietnam"
    ];

    // seed users
    let users = [];

    // users.push([{
    //         phoneNumber: '0903322351',
    //         email: 'cute@gmail.com',
    //         password: await hashPassword('12341234'),
    //         nickname: 'cutephomaique',
    //         address: '529 Lê Đức Thọ, Phường 16, Gò Vấp, Hồ Chí Minh, Vietnam',
    //         roleId: 2,
    //     },
    //     {
    //         phoneNumber: '0978199199',
    //         email: 'tho@gmail.com',
    //         password: await hashPassword('12341234'),
    //         nickname: 'thobaytmau',
    //         address: '702/66 Lê Đức Thọ, Gò Vấp, Hồ Chí Minh, Vietnam',
    //         roleId: 3,
    //     },
    //     {
    //         phoneNumber: '097111111111',
    //         email: 'kytom@gmail.com',
    //         password: await hashPassword('12341234'),
    //         nickname: 'kydaica',
    //         address: '321 livepool, Brexit',
    //         roleId: 3,
    //     },
    //     {
    //         phoneNumber: '0903322352',
    //         email: 'parent2@gmail.com',
    //         password: await hashPassword('12341234'),
    //         nickname: 'friendOfParent1',
    //         address: '124 Quang Trung, Q12, TP Ho Chi Minh, Viet Nam',
    //         roleId: 2,
    //     }, {
    //         phoneNumber: '0978199198',
    //         email: 'sitter3@gmail.com',
    //         password: await hashPassword('12341234'),
    //         nickname: 'ahuhu',
    //         address: 'Go Vap, TP Ho Chi Minh, Viet Nam',
    //         roleId: 3,
    //     },
    // ]);
    let user = {
        phoneNumber: "0326261307",
        email: "phduongse@gmail.com",
        password: await hashPassword("12341234"),
        nickname: "Pham Hai Duong",
        address: "529 Lê Đức Thọ, Phường 16, Gò Vấp, Hồ Chí Minh, Vietnam",
        gender: "MALE",
        dateOfBirth: moment().set({ year: 1997, month: 7, date: 19 }),
        roleId: 2
    };
    users.push(user);

    user = {
        phoneNumber: "0903322351",
        email: "phuc@gmail.com",
        password: await hashPassword("12341234"),
        nickname: "Phuc",
        address: "529 Tran Thi Co, Phường 16, Q12, Hồ Chí Minh, Vietnam",
        gender: "MALE",
        dateOfBirth: moment().set({
            year: Math.floor(Math.random() * (2000 - 1980)) + 1980,
            month: Math.floor(Math.random() * 11),
            date: Math.floor(Math.random() * 28)
        }),
        roleId: 2
    };
    users.push(user);

    user = {
        phoneNumber: "01",
        email: "dong1@gmail.com",
        password: await hashPassword("12341234"),
        nickname: "DongPR",
        address: "100 Tran Thi Co, Phường 16, Q12, Hồ Chí Minh, Vietnam",
        roleId: 2
    };
    users.push(user);

    user = {
        phoneNumber: "02",
        email: "dong2@gmail.com",
        password: await hashPassword("12341234"),
        nickname: "DongBS",
        address: "100 Tran Thi Co, Phường 16, Q12, Hồ Chí Minh, Vietnam",
        gender: "MALE",
        dateOfBirth: moment().set({
            year: Math.floor(Math.random() * (2000 - 1980)) + 1980,
            month: Math.floor(Math.random() * 11),
            date: Math.floor(Math.random() * 28)
        }),
        roleId: 3
    };
    users.push(user);

    user = {
        phoneNumber: "0926261326",
        email: "ky@gmail.com",
        password: await hashPassword("12341234"),
        nickname: "Ky",
        address: "200 Tran Thi Co, Phường 16, Q12, Hồ Chí Minh, Vietnam",
        gender: "FEMALE",
        dateOfBirth: moment().set({
            year: Math.floor(Math.random() * (2000 - 1980)) + 1980,
            month: Math.floor(Math.random() * 11),
            date: Math.floor(Math.random() * 28)
        }),
        roleId: 3
    };
    users.push(user);

    for (let index = 0; index < 20; index++) {
        let firstName =
            listName[Math.floor(Math.random() * (listName.length - 1))];
        let lastName =
            listName[Math.floor(Math.random() * (listName.length - 1))];
        let address =
            listAddress[Math.floor(Math.random() * (listAddress.length - 1))];
        let houseNumber = Math.floor(Math.random() * 200);

        let user = {
            phoneNumber: "09" + (Math.floor(Math.random() * 100000000) + 1),
            email: lastName + firstName + index + "@gmail.com",
            password: await hashPassword("12341234"),
            nickname: lastName + " " + firstName,
            address: houseNumber + ", " + address,
            gender: "FEMALE",
            dateOfBirth: moment().set({
                year: Math.floor(Math.random() * (2000 - 1980)) + 1980,
                month: Math.floor(Math.random() * 11),
                date: Math.floor(Math.random() * 28)
            }),
            roleId: index < 5 ? 2 : 3
        };

        users.push(user);
    }

    db.user
        .bulkCreate(users)
        .then(res => {
            // seed parents
            let userParents = res.filter(x => x.roleId == 2);
            let parents = [];
            userParents.forEach(el => {
                let parent = {
                    userId: el.id,
                    childrenNumber: 3,
                    familyDescription: ""
                };
                parents.push(parent);
            });

            db.parent.bulkCreate(parents).then(res => {
                // seed circle
                db.circle.bulkCreate([
                    {
                        ownerId: 1,
                        friendId: 2
                    },
                    {
                        ownerId: 1,
                        friendId: 6
                    }
                ]);
            });

            // seed babysitters
            let userBabysitters = res.filter(x => x.roleId == 3);
            let babysitters = [];
            userBabysitters.forEach(function(el, index) {
                let babysitter = {};
                if (index < 5) {
                    babysitter = {
                        userId: el.id,
                        weeklySchedule: "MON,TUE,WED,FRI",
                        daytime: "08-17",
                        evening: "17-20",
                        minAgeOfChildren: 1,
                        maxNumOfChildren: 2,
                        maxTravelDistance: 10,
                        averageRating: 4.5,
                        totalFeedback: Math.floor(Math.random() * 5) + 1
                    };
                } else if (index < 10) {
                    babysitter = {
                        userId: el.id,
                        weeklySchedule: "MON,TUE,WED,THU,FRI",
                        daytime: "08-11",
                        evening: "17-20",
                        minAgeOfChildren: 2,
                        maxNumOfChildren: 1,
                        maxTravelDistance: 5
                    };
                } else {
                    babysitter = {
                        userId: el.id,
                        weeklySchedule: "TUE,THU,SAT",
                        daytime: "08-10",
                        evening: "18-20",
                        minAgeOfChildren: 1,
                        maxNumOfChildren: 1,
                        maxTravelDistance: 5
                    };
                }

                babysitters.push(babysitter);
            });
            db.babysitter.bulkCreate(babysitters);
        })
        .then(() => {
            // seed requests
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
                            date: 11
                        }),
                        startTime: moment()
                            .set({
                                hour: 13,
                                minute: 0,
                                second: 0
                            })
                            .format("HH:mm:ss"),
                        endTime: moment()
                            .set({
                                hour: 17,
                                minute: 0,
                                second: 0
                            })
                            .format("HH:mm:ss"),
                        sittingAddress:
                            "529 Lê Đức Thọ, Phường 16, Gò Vấp, Hồ Chí Minh, Vietnam",
                        status: "PENDING"
                    },
                    {
                        createdUser: 2,
                        acceptedBabysitter: 3,
                        childrenNumber: 2,
                        minAgeOfChildren: 1,
                        sittingDate: moment().set({
                            year: 2019,
                            month: 8,
                            date: 26
                        }),
                        startTime: moment()
                            .set({
                                hour: 9,
                                minute: 0,
                                second: 0
                            })
                            .format("HH:mm:ss"),
                        endTime: moment()
                            .set({
                                hour: 12,
                                minute: 0,
                                second: 0
                            })
                            .format("HH:mm:ss"),
                        sittingAddress:
                            "100 Tran Thi Co, Phường 16, Q12, Hồ Chí Minh, Vietnam",
                        status: "DONE"
                    },
                    {
                        createdUser: 2,
                        acceptedBabysitter: 4,
                        childrenNumber: 2,
                        minAgeOfChildren: 1,
                        sittingDate: moment().set({
                            year: 2019,
                            month: 8,
                            date: 26
                        }),
                        startTime: moment()
                            .set({
                                hour: 9,
                                minute: 0,
                                second: 0
                            })
                            .format("HH:mm:ss"),
                        endTime: moment()
                            .set({
                                hour: 12,
                                minute: 0,
                                second: 0
                            })
                            .format("HH:mm:ss"),
                        sittingAddress:
                            "100 Tran Thi Co, Phường 16, Q12, Hồ Chí Minh, Vietnam",
                        status: "DONE"
                    },
                    {
                        createdUser: 5,
                        acceptedBabysitter: 3,
                        childrenNumber: 2,
                        minAgeOfChildren: 1,
                        sittingDate: moment().set({
                            year: 2019,
                            month: 8,
                            date: 25
                        }),
                        startTime: moment()
                            .set({
                                hour: 9,
                                minute: 0,
                                second: 0
                            })
                            .format("HH:mm:ss"),
                        endTime: moment()
                            .set({
                                hour: 12,
                                minute: 0,
                                second: 0
                            })
                            .format("HH:mm:ss"),
                        sittingAddress:
                            "124 Quang Trung, Q12, TP Ho Chi Minh, Viet Nam",
                        status: "DONE"
                    }
                ])
                .then(res => {
                    // seed invitation
                    res.forEach(el => {
                        if (el.status === "PENDING") {
                            db.invitation.bulkCreate([
                                {
                                    requestId: el.id,
                                    sender: el.createdUser,
                                    receiver: 3,
                                    status: "PENDING"
                                },
                                {
                                    requestId: el.id,
                                    sender: el.createdUser,
                                    receiver: 4,
                                    status: "PENDING"
                                },
                                {
                                    requestId: el.id,
                                    sender: el.createdUser,
                                    receiver: 5,
                                    status: "PENDING"
                                },
                                {
                                    requestId: el.id,
                                    sender: el.createdUser,
                                    receiver: 6,
                                    status: "PENDING"
                                }
                            ]);
                        }

                        if (el.status === "DONE") {
                            // seed feedback
                            db.feedback.bulkCreate([
                                {
                                    requestId: el.id,
                                    rating: 4
                                }
                            ]);
                        }
                    });
                })
                .catch(err => {
                    console.log(err);
                });
        })
        .catch(err => {
            console.log(err);
        });
}
