import {useEffect} from 'react';
import {Platform, AppState} from 'react-native';

import messaging from '@react-native-firebase/messaging';

import {useDispatch, useSelector} from 'react-redux';
import {useNavigationState} from '@react-navigation/native';
import DeviceInfo from 'react-native-device-info';

import {
  updateFcmToken,
  getNotiList,
  getFriendRequestList,
  notiFriendAccepted,
  notiNewFollow,
  joinChatRoomById,
  readNoti,
  getCastOfferList,
  getGuestOfferList,
  getUserInfo,
  seenChatRoom,
  checkUnreadNotification,
  newMessageFromSocket,
  listChatRoom,
  getNotiCount,
} from 'actions';
import NavigationService from 'navigation/service';

async function getFcmToken() {
  const enabled = await messaging().hasPermission();
  if (!enabled) {
    await messaging().requestPermission();
    // await firebase.messaging().ios.registerForRemoteNotifications();
  }

  const token = await messaging().getToken();
  return token || '';
}

export async function displayLocalNotification(notification) {
  // const localNotification = new firebase.notifications.Notification(
  //   Platform.OS === 'android' && {
  //     sound: 'default',
  //     show_in_foreground: true,
  //   },
  // )
  //   .setNotificationId(notification.notificationId)
  //   .setTitle(notification.title)
  //   .setBody(notification.body)
  //   .setData(notification.data)
  //   .ios.setBadge(parseInt(notification?.data?.unread_count || 0))
  //   .android.setNumber(parseInt(notification?.data?.unread_count || 0))
  //   .android.setChannelId('kizuner')
  //   .android.setSmallIcon('ic_launcher')
  //   .android.setLargeIcon('ic_launcher')
  //   .android.setAutoCancel(true)
  //   .android.setPriority(firebase.notifications.Android.Priority.High);
  // try {
  //   await firebase.notifications().displayNotification(localNotification);
  // } catch (error) {
  //   console.log(error);
  // }
}

export const checkIsAnyUnreadNotification = (dispatch, userId) => {
  if (Platform.OS === 'ios') {
    dispatch(
      checkUnreadNotification(
        {
          id: userId,
        },
        {
          success: dataUnreadNotification => {
            dispatch(getNotiCount());
            if (dataUnreadNotification && !dataUnreadNotification?.status) {
              // firebase.notifications().setBadge(0);
            }

            //firebase.notifications().setBadge(0);
            // if (dataUnreadNotification && dataUnreadNotification?.status) {
            //   firebase.notifications().setBadge(1);
            // } else if (
            //   dataUnreadNotification &&
            //   !dataUnreadNotification?.status
            // ) {
            //   firebase.notifications().setBadge(0);
            // } else {
            //   firebase.notifications().setBadge(0);
            // }
          },
        },
      ),
    );
    // const iosBadge = await firebase.notifications().getBadge();
    // firebase.notifications().setBadge(iosBadge - 1 > 0 ? iosBadge : 0);
  }
};

export async function handlePressNoti(
  {id, status, payload},
  dispatch,
  userId,
  isAuth = true,
) {
  id &&
    !status &&
    dispatch &&
    dispatch(readNoti(id)) &&
    checkIsAnyUnreadNotification(dispatch, userId);
  const data =
    !payload?.relation || typeof payload?.relation !== 'object'
      ? JSON.parse(payload?.relation)
      : payload?.relation;
  // console.log('-----------', id, status, data);

  if (!isAuth) {
    NavigationService.navigate('Login');
    return;
  }

  switch (data.type) {
    case 'user':
      data.id &&
        NavigationService.push('UserProfile', {
          userId: data.id,
        });
      return;
    case 'hangout':
      data.id &&
        NavigationService.push('HangoutDetail', {
          hangoutId: data.id,
        });
      return;
    case 'help':
      data.id &&
        NavigationService.push('HelpDetail', {
          helpId: data.id,
        });
      return;
    case 'status':
      data.id &&
        NavigationService.push('StatusDetail', {
          statusId: data.id,
        });
      return;
    case 'tagged_status':
      data.id &&
        NavigationService.push('StatusDetail', {
          statusId: data.id,
        });
      return;
    case 'offer':
      NavigationService.navigate('CastManagement');
      return;
    case 'review':
      NavigationService.push('ReviewList');
      return;
    case 'room':
      data.id &&
        dispatch &&
        (await dispatch(joinChatRoomById(data.id))) &&
        (await dispatch(seenChatRoom({roomId: data?.id, userId: userId})));
      return;
    case 'transaction':
      NavigationService.navigate('TransactionHistory');
      return;
    default:
      return;
  }
}

export default function useNotification() {
  const dispatch = useDispatch();
  const navState = useNavigationState(state => state);
  const currentChatRoom = useSelector(state => state.chat.roomDetail);
  const userInfo = useSelector(state => state.auth.userInfo);
  const {isAuth} = useSelector(state => state.auth);
  const {typeChat} = useSelector(state => state.chat);

  let notificationListener;
  let notificationOpenedListener;

  function handleNotification(notification) {
    if (__DEV__) {
      // console.log(notification);
      // console.log(Platform.OS, '🐶 🐶 🐶');
    }

    if (!notification) {
      return;
    }

    if (
      AppState.currentState === 'background' ||
      AppState.currentState === 'inactive'
    ) {
      // if (!isAuth) {
      //   NavigationService.navigate('Login');
      //   return;
      // }

      // Disable show notification with type
      const data =
        notification?._data?.relation &&
        (!notification?._data?.relation ||
          typeof notification?._data?.relation !== 'object')
          ? JSON.parse(notification?._data?.relation)
          : notification?._data?.relation;

      console.log(notification?._data);

      if (
        notification?._data?.type === 'offer_completed' ||
        notification?._data?.type === 'offer-completed' ||
        data?.type === 'room' ||
        notification?._data?.type === 'chat-bot'
      ) {
        return;
      } else {
        displayLocalNotification({
          notificationId: notification._notificationId,
          title: notification._title,
          body: notification._body,
          data: notification._data,
        });
      }
    }

    if (AppState.currentState === 'active') {
      const routeName = NavigationService.getActiveRouteName(navState);
      const data =
        notification?._data?.relation &&
        (!notification?._data?.relation ||
          typeof notification?._data?.relation !== 'object')
          ? JSON.parse(notification?._data?.relation)
          : notification?._data?.relation;

      if (
        notification?._data?.type === 'offer_completed' ||
        notification?._data?.type === 'offer-completed'
      ) {
        dispatch(getUserInfo());
        return;
      }

      if (notification?._data?.type === 'chat-bot') {
        if (routeName === 'ChatRoomBot' && currentChatRoom?.id === data.id) {
          const message =
            notification?._data?.message &&
            (!notification?._data?.message ||
              typeof notification?._data?.message !== 'object')
              ? JSON.parse(notification?._data?.message)
              : notification?._data?.message;
          dispatch(newMessageFromSocket(message.data));
          dispatch(
            seenChatRoom({
              roomId: data.id,
              userId: userInfo?.id,
            }),
          );
        }
        if (routeName === 'ChatRoom' && currentChatRoom?.id === data.id) {
          const message =
            notification?._data?.message &&
            (!notification?._data?.message ||
              typeof notification?._data?.message !== 'object')
              ? JSON.parse(notification?._data?.message)
              : notification?._data?.message;
          dispatch(newMessageFromSocket(message.data));
          dispatch(
            seenChatRoom({
              roomId: data.id,
              userId: userInfo?.id,
            }),
          );
        }

        if (routeName !== 'ChatRoom' || routeName !== 'ChatRoomBot') {
          displayLocalNotification({
            notificationId: notification?._notificationId,
            title: notification?._title,
            body: notification?._body,
            data: notification?._data,
          });
          dispatch(listChatRoom({page: 1, reset: true, type: typeChat}));
        }
        return;
      }

      if (
        data?.type === 'room' &&
        routeName === 'ChatRoom' &&
        currentChatRoom?.id === data.id
      ) {
        return;
      }

      displayLocalNotification({
        notificationId: notification._notificationId,
        title: notification._title,
        body: notification._body,
        data: notification._data,
      });
    }

    // if (AppState.currentState === 'inactive') {
    //   displayLocalNotification({
    //     notificationId: notification._notificationId,
    //     title: notification._title,
    //     body: notification._body,
    //     data: notification._data,
    //   });
    // }

    switch (notification?._data?.type) {
      case 'new-review':
        dispatch(getNotiList({page: 1}));
        dispatch(getUserInfo());
        return;
      case 'review-reminder':
        dispatch(getNotiList({page: 1}));
        dispatch(getCastOfferList({}));
        dispatch(getGuestOfferList({}));
        dispatch(getUserInfo());
        return;
      case 'new-offer':
        dispatch(getNotiList({page: 1}));
        return;
      case 'offer-accepted':
        dispatch(getNotiList({page: 1}));
        dispatch(getCastOfferList({}));
        return;
      case 'offer-reminder':
        dispatch(getNotiList({page: 1}));
        return;
      case 'hangout-liked':
        dispatch(getNotiList({page: 1}));
        return;
      case 'status-liked':
        dispatch(getNotiList({page: 1}));
        return;
      case 'friend-request':
        dispatch(getFriendRequestList({page: 1}));
        return;
      case 'new-transfer':
        dispatch(getNotiList({page: 1}));
        return;
      case 'friend-accepted':
        dispatch(notiFriendAccepted(notification?._data));
        return;
      case 'new-follow':
        dispatch(notiNewFollow(notification?._data));
        return;
      default:
        return;
    }
  }

  const unsupported = Platform.OS === 'ios' && DeviceInfo.isEmulatorSync();

  useEffect(() => {
    if (unsupported) {
      return;
    }

    // firebase
    //   .notifications()
    //   .getInitialNotification()
    //   .then(notificationOpen => {
    //     if (notificationOpen) {
    //       const notification = notificationOpen.notification;
    //       const payload = notification?._data;
    //       handlePressNoti({id: payload?.id, payload}, dispatch, userInfo?.id);
    //     }
    //   });

    // const channel = new firebase.notifications.Android.Channel(
    //   'kizuner',
    //   'Kizuner Channel',
    //   firebase.notifications.Android.Importance.Max,
    // ).setDescription('Kizuner App');
    // firebase.notifications().android.createChannel(channel);

    messaging().onMessage(message => {
      /**
       * Background message received
       */
      console.log('backgroundMessage', message);
    });

    messaging().onTokenRefresh(async newFcmToken => {
      /**
       * Need update token
       */
      console.log('onTokenRefreshListener', newFcmToken);
      dispatch(updateFcmToken({fcm_token: newFcmToken}));
    });
  }, []);

  // useEffect(() => {
  //   if (unsupported) {
  //     return;
  //   }
  //   firebase.notifications().setBadge(count);
  // }, [count]);

  async function requestPermission() {
    messaging().requestPermission();
    messaging().ios.registerForRemoteNotifications();
  }

  async function createListener() {
    // notificationListener = await firebase
    //   .notifications()
    //   .onNotification(handleNotification);
    // notificationOpenedListener = await firebase
    //   .notifications()
    //   .onNotificationOpened(notificationOpen => {
    //     // Get the action triggered by the notification being opened
    //     const action = notificationOpen.action;
    //     // Get information about the notification that was opened
    //     const notification = notificationOpen.notification;
    //     const payload = notification?._data;
    //     handlePressNoti(
    //       {id: payload?.id, payload},
    //       dispatch,
    //       userInfo?.id,
    //       isAuth,
    //     );
    //   });
  }

  useEffect(() => {
    if (unsupported) {
      return;
    }

    requestPermission();
    createListener();
    return () => {
      notificationListener && notificationListener();
      notificationOpenedListener && notificationOpenedListener();
    };
  }, [navState]);

  return null;
}

export {getFcmToken};
