import Expo from 'expo-server-sdk';
import io from 'socket.io-client';

let expo = new Expo();

export async function sendSingleMessage(notification) {
    console.log('PHUC: sendSingleMessage -> notification', notification);
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
        .sendPushNotificationsAsync(message)
        .catch((error) => console.log(error));
    if (ticket) {
        console.log('PHUC: sendSingleMessage -> ticket', ticket);
    }
}

export async function sendNotificationWithSocket(notification) {
    const socket = io(apiUrl.socket, {
        transports: ['websocket'],
    });

    socket.on('connect_error', (error) => {
        console.log('QR connection error  ', error);
    });

    socket.on('error', (error) => {
        console.log('QR just some normal error, error in general ', error);
    });

    const message = {
        data: {
            userId: notification.userId,
            message: notification.message,
            title: notification.title,
        },
    };
}
