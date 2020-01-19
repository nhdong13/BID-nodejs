import models from '@models';
import moment from 'moment';
import { hashPassword } from '@utils/hash';
import { randomInt, randomFloat } from '@utils/common';
import Images from '@utils/image';
import Scheduler from '@services/schedulerService';
import Config from '@services/configService';

export async function insertDatabase() {
    Scheduler.getInstance();

    const db = models.sequelize.models;
    console.log('inserting records to database....');
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
    // images
    // user 1 - nu -
    // user 2 - nu - dong parent
    // user 3 - nam - pham hai duong
    // user 4 - nu
    // user 5 - nu - Duong Chi dai
    // user 6 - nu - Ho Tan Ky
    // user 7 - nam - Huynh minh tu
    // user 8 - nu -
    // user 9 - nu - phung thien phuc
    // user 10 - nam
    // user 11 - nam - Hoang Nhat dong
    // user 12 - nam - Mr.K

    //#region seed parents here
    // parent

    let user = {
        phoneNumber: '0965474201',
        email: 'phduongse@gmail.com',
        password: await hashPassword('12341234'),
        nickname: 'Pham Hai Duong',
        address: '589 Quang Trung, Phường 8, Gò Vấp, Hồ Chí Minh, Vietnam',
        gender: 'MALE',
        dateOfBirth: moment().set({ year: 1997, month: 7, date: 19 }),
        roleId: 2,
        image: Images.user3,
    };
    users.push(user);

    // parent
    user = {
        phoneNumber: '0965474202',
        email: 'phuc@gmail.com',
        password: await hashPassword('12341234'),
        nickname: 'Phung Thien Phuc',
        address: '214 Lê Đức Thọ, Phường 17, Gò Vấp, Hồ Chí Minh, Vietnam',
        gender: 'MALE',
        dateOfBirth: moment().set({
            year: randomInt(1990, 2000),
            month: randomInt(0, 11),
            date: randomInt(1, 28),
        }),
        roleId: 2,
        image: Images.user9,
        token: 'ExponentPushToken[3GB2hTGpcFzIRHCKEJJqwm]',
        cardId: 'card_1FmwRSCfPfiUgoF2Up4QoyUc',
    };
    users.push(user);

    // parent
    user = {
        phoneNumber: '0965474203',
        email: 'dong3@gmail.com',
        password: await hashPassword('12341234'),
        nickname: 'Dong Parent',
        address: '102 Tran Thi Co, Phường 16, Q12, Hồ Chí Minh, Vietnam',
        gender: 'FEMALE',
        dateOfBirth: moment().set({
            year: randomInt(1990, 2000),
            month: randomInt(0, 11),
            date: randomInt(1, 28),
        }),
        roleId: 2,
        image: Images.user2,
    };
    users.push(user);

    // Mr Khanh
    user = {
        phoneNumber: '0965474204',
        email: 'Khanh@gmail.com',
        password: await hashPassword('12341234'),
        nickname: 'Nguyen Quang Duy',
        address: '682 Quang Trung, Phường 11, Gò Vấp, Hồ Chí Minh, Vietnam',
        gender: 'MALE',
        dateOfBirth: moment().set({
            year: randomInt(1990, 2000),
            month: randomInt(0, 11),
            date: randomInt(1, 28),
        }),
        roleId: 2,
        image: Images.user12,
        token: 'ExponentPushToken[c2MUnqCLiIEKIuiPo3Xfip]',
        cardId: 'card_1FknhMCfPfiUgoF2J7QkLlJO',
    };
    users.push(user);
    //#endregion

    //#region seed babysitter here
    // sitter

    user = {
        phoneNumber: '0965474205',
        email: 'dong4@gmail.com',
        password: await hashPassword('12341234'),
        nickname: 'Hoang Nhat Dong',
        address: '184 Lê Đức Thọ, Phường 17, Gò Vấp, Hồ Chí Minh, Vietnam',
        gender: 'MALE',
        dateOfBirth: moment().set({
            year: randomInt(1990, 2000),
            month: randomInt(0, 11),
            date: randomInt(1, 28),
        }),
        roleId: 3,
        firstTime: false,
        secret: 'KYQSURRGIBGDAQKFHI4VOTKDFFLCI3BW',
        image: Images.user11,
        token: 'ExponentPushToken[k6-UsUIE9oT2Zr8R2qbIlC]',
    };
    users.push(user);

    // sitter
    user = {
        phoneNumber: '0965474206',
        email: 'ky@gmail.com',
        password: await hashPassword('12341234'),
        nickname: 'Ho Tan Ky',
        address: '182 Lê Đức Thọ, Phường 17, Gò Vấp, Hồ Chí Minh, Vietnam',
        gender: 'FEMALE',
        dateOfBirth: moment().set({
            year: randomInt(1990, 2000),
            month: randomInt(0, 11),
            date: randomInt(1, 28),
        }),
        roleId: 3,
        firstTime: true,
        // secret: 'KRYWM6BBEZ5XCNCENFVVKSKOLNTDOTSD',
        image: Images.user6,
        token: 'ExponentPushToken[fyRIwRHp3ZajYB-b1odwGb]',
    };
    users.push(user);

    // sitter
    user = {
        phoneNumber: '0965474207',
        email: 'duong@gmail.com',
        password: await hashPassword('12341234'),
        nickname: 'Duong Chi Dai',
        address: '690 Quang Trung, Phường 8, Gò Vấp, Hồ Chí Minh, Vietnam',
        gender: 'FEMALE',
        dateOfBirth: moment().set({
            year: randomInt(1990, 2000),
            month: randomInt(0, 11),
            date: randomInt(1, 28),
        }),
        roleId: 3,
        firstTime: false,
        secret: 'J5SEI3RMEVXEO2K5NRIUWR2DPASSGZJD',
        image: Images.user5,
        token: 'ExponentPushToken[6rIR3fKUpqQdE_Lnf46i19]',
    };
    users.push(user);

    user = {
        phoneNumber: '0965474208',
        email: 'vyvly@gmail.com',
        password: await hashPassword('12341234'),
        nickname: 'Vu Le Yen Vy',
        address: '300 Quang Trung, Phường 8, Gò Vấp, Hồ Chí Minh, Vietnam',
        gender: 'FEMALE',
        dateOfBirth: moment().set({
            year: randomInt(1990, 2000),
            month: randomInt(0, 11),
            date: randomInt(1, 28),
        }),
        roleId: 3,
        firstTime: true,
        image: Images.user4,
    };
    users.push(user);

    user = {
        phoneNumber: '0965474209',
        email: 'mrhmt@gmail.com',
        password: await hashPassword('12341234'),
        nickname: 'Huynh Minh Tu',
        address: '1002 Quang Trung, Phường 8, Gò Vấp, Hồ Chí Minh, Vietnam',
        gender: 'MALE',
        dateOfBirth: moment().set({
            year: randomInt(1990, 2000),
            month: randomInt(0, 11),
            date: randomInt(1, 28),
        }),
        roleId: 3,
        firstTime: true,
        image: Images.user7,
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

    // start seeding users
    db.user
        .bulkCreate(users)
        // after creating users
        .then((result) => {
            db.tracking.bulkCreate([
                {
                    userId: 2,
                    token: 'ExponentPushToken[3GB2hTGpcFzIRHCKEJJqwm]',
                    customerId: 'cus_GJZaRe3DrvsY6m',
                    cardId: 'card_1FmwRSCfPfiUgoF2Up4QoyUc',
                },
                {
                    userId: 4,
                    token: 'ExponentPushToken[c2MUnqCLiIEKIuiPo3Xfip]',
                    cardId: 'card_1FknhMCfPfiUgoF2J7QkLlJO',
                    customerId: 'cus_GHMQ9bCgS16EpV',
                },
                {
                    userId: 5,
                    token: 'ExponentPushToken[k6-UsUIE9oT2Zr8R2qbIlC]',
                },
                {
                    userId: 6,
                    token: 'ExponentPushToken[fyRIwRHp3ZajYB-b1odwGb]',
                },
                {
                    userId: 7,
                    token: 'ExponentPushToken[6rIR3fKUpqQdE_Lnf46i19]',
                },
            ]);
            //#region seed parent based on user and seed circle of parent
            // get parents from the result of creating user
            let userParents = result.filter((user) => user.roleId == 2);
            let parents = [];

            // seed parent data here
            userParents.forEach((el) => {
                let parent = {
                    userId: el.id,
                    familyDescription: '',
                    parentCode: el.id != 3 ? 'P' + el.id : null,
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
                    ]);
                    //#endregion
                    //seed children
                    // img1 phong - male
                    // img2 - male
                    // img3 - female
                    // img4 - female
                    // img5 - male
                    // img6 - female
                    // img7 - female
                    db.children.bulkCreate([
                        {
                            name: 'Phong',
                            age: 1,
                            parentId: 4,
                            image: Images.img1,
                        },
                        {
                            name: 'Quân',
                            age: 2,
                            parentId: 4,
                            image: Images.img2,
                        },
                        {
                            name: 'Trang',
                            age: 3,
                            parentId: 4,
                            image: Images.img3,
                        },
                        {
                            name: 'Linh',
                            age: 1,
                            parentId: 3,
                            image: Images.img4,
                        },
                        {
                            name: 'Dương Jr',
                            age: 1,
                            parentId: 1,
                            image: Images.img5,
                        },
                        {
                            name: 'Vy',
                            age: 4,
                            parentId: 2,
                            image: Images.img6,
                        },
                        {
                            name: 'Na',
                            age: 6,
                            parentId: 2,
                            image: Images.img7,
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
                        weeklySchedule: 'MON,TUE,WED,THU,FRI,SUN',
                        startTime: '08:00',
                        endTime: '20:00',
                        minAgeOfChildren: 1,
                        maxNumOfChildren: 2,
                        maxTravelDistance: 10,
                        averageRating: 4.5,
                        totalFeedback: 20,
                    };
                } else if (index < 2) {
                    babysitter = {
                        userId: el.id,
                        weeklySchedule: 'MON,TUE,WED,THU,FRI,SUN',
                        startTime: '08:00',
                        endTime: '21:00',
                        minAgeOfChildren: 1,
                        maxNumOfChildren: 2,
                        maxTravelDistance: 10,
                        averageRating: 5,
                        totalFeedback: 1,
                    };
                } else if (index < 3) {
                    babysitter = {
                        userId: el.id,
                        weeklySchedule: 'MON,TUE,WED,THU,FRI,SAT,SUN',
                        startTime: '08:00',
                        endTime: '21:00',
                        minAgeOfChildren: 1,
                        maxNumOfChildren: 2,
                        maxTravelDistance: 10,
                        averageRating: 5,
                        totalFeedback: 1,
                    };
                } else if (index < 4) {
                    babysitter = {
                        userId: el.id,
                        weeklySchedule: 'MON,TUE,WED,THU,FRI,SAT,SUN',
                        startTime: '10:00',
                        endTime: '16:00',
                        minAgeOfChildren: 1,
                        maxNumOfChildren: 2,
                        maxTravelDistance: 10,
                        averageRating: 5,
                        totalFeedback: 1,
                    };
                } else {
                    babysitter = {
                        userId: el.id,
                        weeklySchedule: 'TUE,THU,SAT,SUN',
                        startTime: '09:00',
                        endTime: '22:00',
                        minAgeOfChildren: 1,
                        maxNumOfChildren: 2,
                        maxTravelDistance: 10,
                        averageRating: 5, //4,
                        totalFeedback: 3, //1,
                    };
                }

                babysitters.push(babysitter);
            });
            db.babysitter
                .bulkCreate(babysitters)
                // seed schedule
                .then((result) => {
                    let sitters = result;
                    let schedules = [];
                });
            //#endregion
        })
        .then(() => {
            //#region seed requests
            db.sittingRequest
                .bulkCreate([
                    {
                        createdUser: 1,
                        acceptedBabysitter: 5,
                        childrenNumber: 2,
                        minAgeOfChildren: 1,
                        totalPrice: 150000,
                        distance: '0.4 km',
                        sittingDate: moment().set({
                            year: 2019,
                            month: 11,
                            date: 1,
                        }),
                        startTime: moment()
                            .set({
                                hour: 13,
                                minute: 40,
                                second: 0,
                            })
                            .format('HH:mm:ss'),
                        endTime: moment()
                            .set({
                                hour: 15,
                                minute: 7,
                                second: 0,
                            })
                            .format('HH:mm:ss'),
                        sittingAddress:
                            '589 Quang Trung, Phường 8, Gò Vấp, Hồ Chí Minh, Vietnam',
                        status: 'DONE',
                    },
                    {
                        createdUser: 1,
                        acceptedBabysitter: 6,
                        childrenNumber: 1,
                        minAgeOfChildren: 1,
                        distance: '1.2 km',
                        totalPrice: 150000,
                        sittingDate: moment().set({
                            year: 2019,
                            month: 10,
                            date: 14,
                        }),
                        startTime: moment()
                            .set({
                                hour: 16,
                                minute: 40,
                                second: 0,
                            })
                            .format('HH:mm:ss'),
                        endTime: moment()
                            .set({
                                hour: 15,
                                minute: 7,
                                second: 0,
                            })
                            .format('HH:mm:ss'),
                        sittingAddress:
                            '589 Quang Trung, Phường 8, Gò Vấp, Hồ Chí Minh, Vietnam',
                        status: 'DONE',
                    },
                    {
                        createdUser: 4,
                        acceptedBabysitter: 6,
                        childrenNumber: 2,
                        minAgeOfChildren: 1,
                        totalPrice: 100000,
                        distance: '0.1 km',
                        sittingDate: moment().set({
                            year: 2019,
                            month: 10,
                            date: 20,
                        }),
                        startTime: moment()
                            .set({
                                hour: 16,
                                minute: 40,
                                second: 0,
                            })
                            .format('HH:mm:ss'),
                        endTime: moment()
                            .set({
                                hour: 15,
                                minute: 7,
                                second: 0,
                            })
                            .format('HH:mm:ss'),
                        sittingAddress:
                            '682 Quang Trung, Phường 11, Gò Vấp, Hồ Chí Minh, Vietnam',
                        status: 'DONE',
                    },
                    {
                        createdUser: 2,
                        acceptedBabysitter: 5,
                        childrenNumber: 2,
                        minAgeOfChildren: 1,
                        totalPrice: 100000,
                        distance: '50 m',
                        sittingDate: moment().set({
                            year: 2019,
                            month: 10,
                            date: 11,
                        }),
                        startTime: moment()
                            .set({
                                hour: 18,
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
                            '214 Lê Đức Thọ, Phường 17, Gò Vấp, Hồ Chí Minh, Vietnam',
                        status: 'DONE',
                    },
                    {
                        createdUser: 3,
                        acceptedBabysitter: null,
                        childrenNumber: 2,
                        minAgeOfChildren: 1,
                        totalPrice: 100000,
                        distance: '0.7 km',
                        sittingDate: moment().set({
                            year: 2019,
                            month: 11,
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
                            '102 Tran Thi Co, Phường 16, Q12, Hồ Chí Minh, Vietnam',
                        status: 'PENDING',
                    },
                    {
                        createdUser: 4,
                        acceptedBabysitter: null,
                        childrenNumber: 2,
                        minAgeOfChildren: 1,
                        totalPrice: 100000,
                        distance: '0.3',
                        sittingDate: moment().set({
                            year: 2019,
                            month: 11,
                            date: 26,
                        }),
                        startTime: moment()
                            .set({
                                hour: 17,
                                minute: 0,
                                second: 0,
                            })
                            .format('HH:mm:ss'),
                        endTime: moment()
                            .set({
                                hour: 18,
                                minute: 0,
                                second: 0,
                            })
                            .format('HH:mm:ss'),
                        sittingAddress:
                            '682 Quang Trung, Phường 11, Gò Vấp, Hồ Chí Minh, Vietnam',
                        status: 'PENDING',
                    },
                    //#endregion
                ])
                .then((result) => {
                    //#region repeated request
                    // result.forEach((el) => {
                    //     if (el.status === 'PENDING') {
                    //         db.repeatedRequest
                    //             .bulkCreate([
                    //                 {
                    //                     startDate: el.sittingDate,
                    //                     startTime: el.startTime,
                    //                     endTime: el.endTime,
                    //                     sittingAddress: el.sittingAddress,
                    //                     repeatedDays: ['mon'],
                    //                     status: 'ACTIVE',
                    //                 },
                    //             ])
                    //             .then((result) => {
                    //                 el.update({
                    //                     repeatedRequestId: result[0].id,
                    //                 });
                    //             });
                    //     }
                    // });
                    //#endregion

                    let feedbacks = [
                        {
                            rating: 5,
                            reporter: 1,
                            description:
                                'Người giữ trẻ làm việc có tâm, chăm sóc trẻ tốt, chắc chắn sẽ thuê nữa khi cần. Dịch vụ tìm kiếm nhanh.',
                            isReport: false,
                            order: 1,
                        },
                        {
                            rating: 5,
                            reporter: 1,
                            description:
                                'Dễ thương, chăm trẻ tốt, biết hát cho con tôi nghe, recommend người giữ trẻ này.',
                            isReport: false,
                            order: 1,
                        },
                        {
                            rating: 5,
                            reporter: 1,
                            description:
                                'Chăm em cẩn thận, biết pha sữa đúng liều lượng.',
                            isReport: false,
                            order: 1,
                        },
                        {
                            rating: 5,
                            reporter: 1,
                            description:
                                'Nhanh nhẹn, biết nhiều kỹ năng chăm trẻ mà tui còn không biết, chỉ tui được những thứ cần thiết để tui chăm con xịn hơn.',
                            isReport: false,
                            order: 1,
                        },
                        {
                            rating: 5,
                            reporter: 1,
                            description:
                                'Làm việc cẩn thận, có tính gọn gàng, sạch sẽ. 10/10',
                            isReport: false,
                            order: 1,
                        },
                        {
                            rating: 5,
                            reporter: 0,
                            description:
                                'Trẻ ngoan, phụ huynh nhiệt tình 5sao :D',
                            isReport: false,
                            order: 2,
                        },
                        {
                            rating: 5,
                            reporter: 0,
                            description: 'Phụ huynh dễ chịu.\nGiữ trẻ vui vẻ.',
                            isReport: false,
                            order: 2,
                        },
                    ];
                    let reports = [
                        {
                            requestId: 3,
                            reporter: 1,
                            rating: 0,
                            description:
                                '-T1rẻ bị đánh\n-Người giữ trẻ bỏ về\n-Sẽ không bao giờ sử dụng lại dịch vụ',
                            isReport: true,
                            status: 'Unsolve',
                            order: 3,
                        },
                        {
                            reporter: 1,
                            requestId: 1,
                            rating: 0,
                            description: 'Người giữ trẻ làm mất đồ',
                            isReport: true,
                            status: 'Unsolve',
                            order: 3,
                        },
                        {
                            reporter: 1,
                            requestId: 1,
                            rating: 0,
                            description:
                                '-Đến không đúng giờ\n-Trông trẻ không tốt',
                            isReport: true,
                            status: 'Unsolve',
                            order: 3,
                        },
                        {
                            reporter: 1,
                            requestId: 1,
                            rating: 0,
                            description: 'Không có ai đến, trễ công việc',
                            isReport: true,
                            order: 3,
                            status: 'Unsolve',
                        },
                    ];

                    let i = 0;
                    result.forEach((el) => {
                        //#region seed invitations
                        if (el.status === 'PENDING') {
                            db.invitation.bulkCreate([
                                {
                                    requestId: el.id,
                                    receiver: 5,
                                    status: 'PENDING',
                                },
                                {
                                    requestId: el.id,
                                    receiver: 6,
                                    status: 'DONE',
                                },
                                {
                                    requestId: el.id,
                                    receiver: 7,
                                    status: 'OVERLAP',
                                },
                            ]);
                        } else if (el.status === 'DONE') {
                            db.invitation.bulkCreate([
                                {
                                    requestId: el.id,
                                    receiver: 5,
                                    status: 'DONE',
                                },
                            ]);
                        }
                        //#endregion

                        //#region feedbacks
                        if (el.status === 'DONE') {
                            // console.log('cai el.id nay la sao? ', el.id);
                            feedbacks[i].requestId = el.id;
                            feedbacks[6 - i].requestId = el.id;
                            reports[i].requestId = el.id;
                            // seed feedback
                            db.feedback
                                .bulkCreate([feedbacks[i]])
                                .catch((error) =>
                                    console.log(
                                        'feedback Bulk Create 1 ',
                                        error,
                                    ),
                                );
                            db.feedback
                                .bulkCreate([feedbacks[6 - i]])
                                .catch((error) =>
                                    console.log(
                                        'feedback Bulk Create 2 ',
                                        error,
                                    ),
                                );
                            db.feedback
                                .bulkCreate([reports[i]])
                                .catch((error) =>
                                    console.log(
                                        'feedback Bulk Create 3 ',
                                        error,
                                    ),
                                );
                            i++;
                        }
                        //#endregion
                    });
                })
                .catch((err) => {
                    console.log(err);
                });

            console.log('Finish insert to database.');
        });

    let configs = [];

    let config = {
        remindBeforeDuration_0: 1,
        remindBeforeDuration_1: 7,
        checkinTimeout: 1,
        checkoutTimeout: 1,
        timezone: 'Asia/Bangkok',
        maxTravelDistance: 3,
        circleWeight: 0.5,
        ratingWeight: 0.4,
        distanceWeight: 0.1,
        minimumFeedback: 5,
        refundPercentage: 90,
        officeHourStart: '08:00',
        officeHourEnd: '17:00',
    };

    configs.push(config);

    db.configuration.bulkCreate(configs).then(async () => {
        await Config.getInstance();
    });

    //#region PRICING
    let pricings = [];

    let pricing = {
        baseAmount: '100000', // 100,000 VND
        overtime: 2,
        holiday: 3,
        type: 'BASE',
    };
    pricings.push(pricing);

    pricing = {
        baseAmount: '100000', // 100,000 VND
        overtime: 2,
        holiday: 3,
        type: 'UNDER_6_YEARS',
    };
    pricings.push(pricing);

    pricing = {
        baseAmount: '150000', // 150,000 VND
        overtime: 2,
        holiday: 3,
        type: 'UNDER_18_MONTHS',
    };
    pricings.push(pricing);

    pricing = {
        baseAmount: '200000', // 200,000 VND
        overtime: 2,
        holiday: 3,
        type: 'UNDER_6_MONTHS',
    };
    pricings.push(pricing);

    db.pricing.bulkCreate(pricings);
    //#endregion

    //#region holiday
    let holidays = [];

    let holiday = {
        date: '01/01',
        description: 'Tết Dương Lịch',
    };
    holidays.push(holiday);

    holiday = {
        date: '30/04',
        description: 'Ngày Chiến thắng 30/04',
    };
    holidays.push(holiday);

    holiday = {
        date: '01/05',
        description: 'Ngày quốc tế lao động',
    };
    holidays.push(holiday);

    holiday = {
        date: '02/09',
        description: 'Ngày Quốc Khánh',
    };
    holidays.push(holiday);

    holiday = {
        date: '23/01',
        description: 'Tết Âm 2020',
    };
    holidays.push(holiday);

    holiday = {
        date: '24/01',
        description: 'Tết Âm 2020',
    };
    holidays.push(holiday);

    holiday = {
        date: '25/01',
        description: 'Tết Âm 2020',
    };
    holidays.push(holiday);

    holiday = {
        date: '26/01',
        description: 'Tết Âm 2020',
    };
    holidays.push(holiday);

    holiday = {
        date: '27/01',
        description: 'Tết Âm 2020',
    };
    holidays.push(holiday);

    holiday = {
        date: '28/01',
        description: 'Tết Âm 2020',
    };
    holidays.push(holiday);

    holiday = {
        date: '29/01',
        description: 'Tết Âm 2020',
    };
    holidays.push(holiday);

    holiday = {
        date: '02/04',
        description: 'Giỗ tổ Hùng Vương 2020',
    };
    holidays.push(holiday);

    db.holiday.bulkCreate(holidays);
    //#endregion
}
