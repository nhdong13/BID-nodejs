import Expo from 'expo-server-sdk';

var io = require('socket.io-client')('http://localhost:5000/api/v1/socket');

let expo = new Expo();

export async function sendSingleMessage(notification) {
    // console.log('PHUC: sendSingleMessage -> notification', notification);
    if (!Expo.isExpoPushToken(notification.pushToken.trim())) {
        console.error(
            `Push token ${notification.pushToken} is not a valid Expo push token`,
        );
        return;
    }

    const message = {
        to: notification.pushToken,
        sound: 'default',
        body: notification.message,
        data: {
            id: notification.id,
            message: notification.message,
            title: notification.title,
            option: notification.option,
        },
    };

    let ticket = await expo
        .sendPushNotificationsAsync([message])
        .catch((error) => {
            console.log('PHUC: sendSingleMessage -> error -> backend', error);
        });
    // if (ticket) {
    //     console.log('PHUC: sendSingleMessage -> ticket', ticket);
    // }
}

export async function sendMessage(message) {
    if (!Expo.isExpoPushToken(message.to.trim())) {
        console.error(
            `Push token ${message.to} is not a valid Expo push token`,
        );
        return;
    }

    let ticket = await expo
        .sendPushNotificationsAsync([message])
        .catch((error) => {
            console.log('PHUC: sendSingleMessage -> error -> backend', error);
        });
    // if (ticket) {
    //     console.log('PHUC: sendSingleMessage -> ticket', ticket);
    // }
}

export async function sendNotificationWithSocket(notification) {
    // nhung du lieu can thiet la gi
    // const notification = {
    //     id: res.id,
    //     pushToken: tracking.token,
    //     message:
    //         invitationMessages.parentSendRepeatedRequest,
    //     title: titleMessages.parentSendRepeatedRequest,
    //     option: {
    //         showConfirm: true,
    //         textConfirm: 'Tiếp tục',
    //         showCancel: true,
    //         textCancel: 'Ẩn',
    //     },
    // };
    // id, message, title, options
    const data = {
        userId: notification.userId,

        id: notification.id,
        message: notification.message,
        title: notification.title,
        option: notification.option,
    };

    io.emit('notification', data);
}
