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
    body: 'You got a new Invitation',
    data: { invitationId: notification.invitationId },
  };

  const ticket = await expo.sendPushNotificationsAsync(message);
  console.log('PHUC: sendSingleMessage -> ticket', ticket);
}
