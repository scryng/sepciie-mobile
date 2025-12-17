import { Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { useEffect } from 'react';
import { storage } from '../../db';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: false,
    shouldShowList: false,
    importance: Notifications.AndroidImportance.MAX,
  }),
});

export function usePush() {
  const registerForPushNotificationsAsync = async (): Promise<string | undefined> => {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        console.error('Permission not granted to get push token for push notification!');
        return;
      }
      const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
      if (!projectId) {
        console.error('Project ID not found');
      }
      try {
        const pushTokenString = (
          await Notifications.getExpoPushTokenAsync({
            projectId,
          })
        ).data;
        console.log(pushTokenString);
        return pushTokenString;
      } catch (e: unknown) {
        console.error(`${e}`);
      }
    } else {
      console.warn('Must use physical device for push notifications');
    }
  }

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then(token => {
        if (token == null) {
            return;
        }

        storage.set('push-token', token);
      })
      .catch((error: any) => console.warn(error));

    const notificationListener = Notifications.addNotificationReceivedListener(notification => {
    //   setNotification(notification);
    });

    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, []);

}
