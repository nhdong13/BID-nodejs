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

export async function sendNotificationWithSocket(notification) {
    const data = {
        userId: notification.userId,
        message: notification.message,
        title: notification.title,
    };

    io.emit('notification', data);
}
