/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect} from 'react';
import {
  Button,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  View,
} from 'react-native';
import {Notifications} from 'react-native-notifications';

const App = () => {
  useEffect(() => {
    console.log('registering listeners');
    const listeners = registerNotificationEvents();

    return () => {
      console.log('removing listeners');
      listeners.forEach(listener => listener.remove());
    };
  }, []);

  const registerNotificationEvents = () => {
    const listeners = [];

    const registeredListener =
      Notifications.events().registerRemoteNotificationsRegistered(event => {
        console.log('remoteNotificationsRegistered', event);
      });
    listeners.push(registeredListener);

    const failedListener =
      Notifications.events().registerRemoteNotificationsRegistrationFailed(
        event => {
          console.error('remoteNotificationsRegistrationFailed', event);
        },
      );
    listeners.push(failedListener);

    const deniedListener =
      Notifications.events().registerRemoteNotificationsRegistrationDenied(
        () => {
          console.log('remoteNotificationsRegistrationDenied');
        },
      );
    listeners.push(deniedListener);

    const foregroundListener =
      Notifications.events().registerNotificationReceivedForeground(
        (notification, completion) => {
          console.log('notificationReceivedForeground', notification);
          completion({
            alert: notification.payload.showAlert,
            sound: false,
            badge: false,
          });
        },
      );
    listeners.push(foregroundListener);

    const openedListener = Notifications.events().registerNotificationOpened(
      (notification, completion) => {
        console.log('notificationOpened', notification);
        completion();
      },
    );
    listeners.push(openedListener);

    if (Platform.OS === 'ios') {
      const settingsLinkedListener = Notifications.ios
        .events()
        .appNotificationSettingsLinked(() => {
          console.log('appNotificationSettingsLinked');
        });
      listeners.push(settingsLinkedListener);
    }

    return listeners;
  };

  const checkRegistration = () => {
    if (Platform.OS === 'ios') {
      Notifications.ios.checkPermissions().then(currentPermissions => {
        console.log('currentPermissions', currentPermissions);
      });
    }

    Notifications.isRegisteredForRemoteNotifications().then(registered => {
      console.log('isRegisteredForRemoteNotifications', registered);
    });
  };

  const requestPermission = () => {
    Notifications.registerRemoteNotifications();
  };

  const getInitialNotification = () => {
    Notifications.getInitialNotification().then(notification => {
      console.log('initialNotification', notification);
    });
  };

  const sendLocalNotification = () => {
    Notifications.postLocalNotification({
      body: 'Local notification!',
      title: 'Local Notification Title',
      fireDate: Date.now() + 5000,
    });
  };

  return (
    <SafeAreaView>
      <StatusBar />
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View>
          <Button title="Check registration" onPress={checkRegistration} />
          <Button title="Request permission" onPress={requestPermission} />
          <Button
            title="Get initial notification"
            onPress={getInitialNotification}
          />
          <Button
            title="Send local notification"
            onPress={sendLocalNotification}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default App;
