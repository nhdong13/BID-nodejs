import Expo from 'expo-server-sdk';

let expo = new Expo();

export async function sendSingleMessage(notification) {
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
        },
    };

    let ticket = await expo
        .sendPushNotificationsAsync(message)
        .catch((error) => console.log(error));
    if (ticket) {
        console.log('PHUC: sendSingleMessage -> ticket', ticket);
    }
}
