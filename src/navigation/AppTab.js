import React, {useEffect} from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {Image, StyleSheet} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';

import useTheme from 'theme';
import {getSize} from 'utils/responsive';

import ExploreStack from './ExploreStack';
import NewsFeedStack from './NewsFeedStack';
import MessageScreen from 'screens/Message';
import MyPageStack from './MyPageStack';
import ManageScreen from 'screens/Manage';
import {useWatchLocation} from 'utils/geolocationService';
import useSocket from 'utils/socketService';
import useNotification from 'utils/notificationService';
import useAppState from 'utils/appState';
import {
  getUserInfo,
  sendVerifyEmailCode,
  getPaymentCards,
  getNowPaymentsCurrencies,
} from 'actions';
import {ChatUnseenBadge} from 'components';
import useDynamicLinkService from 'utils/dynamicLinkService';
import Orientation from 'react-native-orientation-locker';
import {getPaymentCryptoCards} from 'actions';
import {Alert} from 'react-native';
import {Icons} from 'utils/icon';

const Tab = createMaterialTopTabNavigator();

const TABS = [
  // {
  //   name: 'ExploreStack',
  //   label: 'Explore',
  //   screen: ExploreStack,
  //   icon: Icons.ic_explore,
  //   iconActive: Icons.ic_explore_active,
  //   size: 22,
  // },
  {
    name: 'NewsFeedStack',
    label: 'News Feed',
    screen: NewsFeedStack,
    icon: Icons.ic_newfeed,
    iconActive: Icons.ic_newfeed_active,
    size: 22,
  },
  // {
  //   name: 'Message',
  //   label: 'Message',
  //   screen: MessageScreen,
  //   icon: Icons.ic_message,
  //   iconActive: Icons.ic_message_active,
  //   size: 24,
  // },
  // {
  //   name: 'MyPageStack',
  //   label: 'My Page',
  //   screen: MyPageStack,
  //   icon: Icons.ic_mypage,
  //   iconActive: Icons.ic_mypage_active,
  //   size: 22,
  // },
  // {
  //   name: 'Manage',
  //   label: 'Manage',
  //   screen: ManageScreen,
  //   icon: Icons.ic_manage,
  //   iconActive: Icons.ic_manage_active,
  //   size: 17,
  // },
];

const AppTab = ({navigation}) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const {userInfo} = useSelector((state) => state.auth);

  useWatchLocation();
  useSocket();
  useNotification();
  useDynamicLinkService();
  useAppState();

  useEffect(() => {
    dispatch(getUserInfo());
    Orientation.lockToPortrait();
  }, []);

  useEffect(() => {
    if (userInfo?.email && !userInfo?.email_verified_at) {
      Alert.alert(
        'Verify email',
        'Your email is not evified. I recommend you to verify it!',
        [
          {
            text: 'Yes',
            onPress: () => dispatch(sendVerifyEmailCode()),
          },
          {
            text: 'Later',
          },
        ],
      );
    }
  }, [userInfo?.email, userInfo?.email_verified_at]);

  // useEffect(() => {
  //   const checkBagdeMessagetimer = setInterval(() => {
  //     dispatch(getBadgeChatSingle())
  //     dispatch(getBadgeChatGroup())
  //   }, 15000)
  //   return () => {
  //     clearInterval(checkBagdeMessagetimer)
  //   }
  // }, [])
  useEffect(() => {
    dispatch(getNowPaymentsCurrencies());
    dispatch(getPaymentCards());
    dispatch(getPaymentCryptoCards());
  }, []);

  const styles = StyleSheet.create({
    labelStyle: {
      fontFamily: theme.fonts.sfPro.regular,
      fontSize: getSize.f(12),
      textTransform: 'none',
    },
    barStyle: {
      borderTopWidth: 0,
      height: 65 + insets.bottom,
      paddingBottom: insets.bottom,
      ...theme.shadow.bottomTab.ios,
      ...theme.shadow.bottomTab.android,
      backgroundColor: theme.colors.paper,
    },
    tabStyle: {
      paddingHorizontal: 0,
    },
    tabBarIcon: {
      justifyContent: 'center',
      alignItems: 'center',
      // backgroundColor: 'red',
    },
    unseenBadge: {
      position: 'absolute',
      top: -getSize.h(5),
      right: -getSize.h(5),
    },
  });

  return (
    <Tab.Navigator
      tabBarPosition="bottom"
      swipeEnabled={false}
      lazy
      tabBarOptions={{
        labelStyle: styles.labelStyle,
        activeTintColor: theme.colors.primary,
        inactiveTintColor: theme.colors.text2,
        style: styles.barStyle,
        showIcon: true,
        tabStyle: styles.tabStyle,
        renderIndicator: () => null,
      }}>
      {TABS.map((item) => (
        <Tab.Screen
          key={item.name}
          name={item.name}
          component={item.screen}
          options={{
            tabBarLabel: item.label,
            tabBarIcon: ({focused}) => (
              <>
                <Image
                  source={focused ? item.iconActive : item.icon}
                  resizeMode="contain"
                  tintColor={
                    focused ? theme.colors.primary : theme.colors.text2
                  }
                  style={[
                    styles.tabBarIcon,
                    {width: getSize.w(item.size), height: getSize.w(22)},
                  ]}
                />
                {item.label === 'Message' && (
                  <ChatUnseenBadge style={styles.unseenBadge} />
                )}
              </>
            ),
          }}
        />
      ))}
    </Tab.Navigator>
  );
};

export default AppTab;
