import React, {useRef, useEffect} from 'react';
import {NavigationContainer, useNavigation} from '@react-navigation/native';

import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';

import {useDispatch, useSelector} from 'react-redux';
import messaging from '@react-native-firebase/messaging';
import analytics from '@react-native-firebase/analytics';

import {navigationRef, getActiveRouteName} from './service';
import AppTab from './AppTab';

import {
  LoginScreen,
  SignUpScreen,
  ForgotPasswordScreen,
  VerifyResetCodeScreen,
  ResetPasswordScreen,
} from 'screens/Auth';
import {VerifyPhoneScreen, VerifyEmailScreen} from 'screens/Verify';
import EditSpecialtyScreen from 'screens/EditSpecialty';
import HangoutDetailScreen from 'screens/HangoutDetail';
import HelpDetailScreen from 'screens/HelpDetail';

import AboutScreen from 'screens/About';
import FAQScreen from 'screens/FAQ';
import TermsScreen from 'screens/Terms';
import PrivacyPolicyScreen from 'screens/PrivacyPolicy';
import SearchScreen from 'screens/Search';
import EditProfileScreen from 'screens/EditProfile';
import CreateHangoutScreen, {EditHangoutScreen} from 'screens/CreateHangout';
import {
  PickLocationScreen,
  PickLocationDistrictScreen,
  PickLocationPostScreen,
} from 'screens/PickLocation';
import SettingsScreen, {
  MyDetailsScreen,
  ChangePasswordScreen,
} from 'screens/Settings';
import GuestListScreen from 'screens/GuestList';
import GuestListHelpScreen from 'screens/GuestHelpList';

import PickSpecialtyScreen from 'screens/PickSpecialty';
import PickCategoryScreen from 'screens/PickCategory';
import BootSplash from 'react-native-bootsplash';

import {UserProfileScreen, UserProfileScreenBot} from 'screens/UserProfile';
import ContactListScreen from 'screens/ContactList';
import NotificationScreen from 'screens/Notification';
import FriendRequestsScreen from 'screens/FriendRequests';
import GuideVideoScreen from 'screens/GuideVideo';
import BlockListScreen from 'screens/BlockList';
import CreateStatusScreen, {UpdateStatusScreen} from 'screens/CreateStatus';
import ChatRoomScreen, {
  RoomMembersScreen,
  UpdateGroupNameScreen,
  ChatRoomScreenBot,
} from 'screens/ChatRoom';
import AddChatMemberScreen from 'screens/AddChatMember';
import MyWalletScreen from 'screens/MyWallet';
import BuyKizunaScreen, {
  PaymentMethodScreen,
  PaymentDataScreen,
} from 'screens/BuyKizuna';
import TransferKizunaScreen, {
  SelectFriendTransferScreen,
} from 'screens/TransferKizuna';
import TransactionHistoryScreen from 'screens/TransactionHistory';
import ReviewListScreen from 'screens/ReviewList';
import ReviewFormScreen from 'screens/ReviewForm';
import SelectFriendScreen from 'screens/SelectFriend';
import StatusDetailScreen from 'screens/StatusDetail';
import UserLikedScreen from 'screens/UserLiked';
import ReportContentScreen from 'screens/ReportContent';
import {CreateHelpScreen, EditHelpScreen} from 'screens/CreateHelp';
import {VideoScreen} from 'screens/VideoScreen';
import {
  AddFriendPostScreen,
  EditOrUpdateFriendPostScreen,
} from 'screens/AddFriend';
import NearFriendScreen from 'screens/NearFriend';
import {ShareAppWithFriendScreen} from 'screens/Share';
import {
  CastHelpManagementScreen,
  GuestHelpManagementScreen,
} from 'screens/HelpManagement';
import {SupportScreen} from 'screens/Support';
import LeaderBoardScreen from 'screens/LeaderBoard';
import {OnboardingScreen, MainTourScreen} from 'screens/Onboarding';
import {FakeHelpsScreen, FakeHangoutScreen} from 'screens/FakeHelps';
import {EditCategoriesScreen} from 'screens/EditCategories';
import Orientation from 'react-native-orientation-locker';
import {getNotiCount, getConfigs, setNeedVerifyEmail} from 'actions';
import {Platform} from 'react-native';
import ConnectStripeScreen from '../screens/Payment/ConnectStripeScreen';
import CardCreditManagementScreen from '../screens/Payment/CardCreditManagementScreen';
import CardCryptoManagementScreen from 'screens/Payment/CardCryptoManagementScreen';
import CryptoPanelScreen from 'screens/Payment/CryptoPanelScreen';
import {
  CastHangoutManagementScreen,
  GuestHangoutManagementScreen,
} from 'screens/HangoutManagement';
import {
  SupportCancelHelpScreen,
  SupportRejectHangoutScreen,
  SupportCancelHangoutScreen,
  SupportRejectHelpScreen,
} from 'screens/Support';
import WalletScreen from 'screens/Payment/WalletScreen';
import PaymentOTPScreen from 'screens/Payment/PaymentOTPScreen';

const Stack = createStackNavigator();

const configLinking = {
  screens: {
    HangoutDetail: {
      path: '?id=:id',
      parse: {
        hangoutId: (id) => `${id}`,
      },
    },
    StatusDetail: {
      path: '?id=:id',
      parse: {
        statusId: (id) => `${id}`,
      },
    },
    HelpDetail: {
      path: '?id=:id',
      parse: {
        helpId: (id) => `${id}`,
      },
    },
  },
  initialRouteName: 'Login',
};

const linking = {
  prefixes: [
    'https://kizuner.com',
    'https://kizuner-app.inapps.technology/help',
    'https://kizuner-app.inapps.technology/hangout',
    'https://kizuner-app.inapps.technology/status',
  ],
  config: configLinking,
};

const config = {
  animation: 'spring',
  config: {
    stiffness: 1000,
    damping: 500,
    mass: 3,
    overshootClamping: true,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01,
  },
};

const horizontalAnimation = {
  gestureDirection: 'horizontal',
  cardStyleInterpolator: ({current, layouts}) => {
    return {
      cardStyle: {
        transform: [
          {
            translateX: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [layouts.screen.width, 0],
            }),
          },
        ],
      },
    };
  },
};

const MainScreen = () => {
  // remove tutorial

  // const dispatch = useDispatch();
  // const {isAuth, userInfo, needVerifyEmail} = useSelector(
  //   (state) => state.auth,
  // );
  // const {isFirstLaunch} = useSelector((state) => state.app);
  // if (userInfo?.has_posted == false) {
  //   if (isFirstLaunch == true) {
  //     return <OnboardingScreen />;
  //   } else if (isFirstLaunch == false) {
  //     return <AppTab />;
  //   }
  //   return <OnboardingScreen />;
  // }

  return <AppTab />;
};

export default () => {
  const dispatch = useDispatch();
  const {isAuth, userInfo, needVerifyEmail} = useSelector(
    (state) => state.auth,
  );
  const {isFirstLaunch} = useSelector((state) => state.app);
  const {count} = useSelector((state) => state.notification);
  const {requestList} = useSelector((state) => state.contact);
  //const {has_posted} = userInfo;
  // const [isFirstLaunch, setIsFirstLaunch] = useState(false);
  const routeNameRef = useRef();

  useEffect(() => {
    const state = navigationRef.current?.getRootState();
    routeNameRef.current = getActiveRouteName(state);
  }, []);

  useEffect(() => {
    dispatch(getConfigs());
    Orientation.lockToPortrait();
  }, []);

  useEffect(() => {
    if (isAuth) {
      dispatch(getNotiCount());
    }
    // if (isAuth) {
    //   if (Platform.OS === 'ios') {
    //     firebase.notifications().setBadge(count + requestList.length);
    //   } else {
    //     new firebase.notifications.Notification().android.setNumber(
    //       count + requestList.length,
    //     );
    //   }
    // } else {
    //   firebase.notifications().setBadge(0);
    // }
  }, [isAuth, count, requestList.length]);

  // useCallback(() => {
  //   if (isAuth) {
  //     console.log(count + requestList.length);
  //     firebase.notifications().setBadge(count + requestList.length);
  //   } else {
  //     firebase.notifications().setBadge(0);
  //   }
  // }, [isAuth, count, requestList.length]);

  // async function checkFirstLauchApp() {
  //   const isFirst = await checkIfFirstLaunch();
  //   setIsFirstLaunch(isFirst);
  // }

  // useEffect(() => {
  //   checkFirstLauchApp();
  // }, []);

  useEffect(() => {
    //setIsFirstLaunch(false);
    if (userInfo) {
      analytics().setUserId(userInfo?.id);
      analytics().setUserProperties({
        name: userInfo?.name,
        about: userInfo?.about,
        phone: userInfo?.phone,
        email: userInfo?.email,
        birth_date: String(userInfo?.birth_date),
        gender: String(userInfo?.gender),
        age: String(userInfo.age),
        kizuna: String(userInfo?.kizuna),
      });
    }
  }, [userInfo]);

  function handleStateChange(state) {
    if (state) {
      const previousRouteName = routeNameRef.current;
      const currentRouteName = getActiveRouteName(state);
      if (previousRouteName !== currentRouteName) {
        analytics().logScreenView({
          screen_class: currentRouteName,
          screen_name: currentRouteName,
        });
      }
      routeNameRef.current = currentRouteName;
    }
  }

  const authenticated = isAuth && !needVerifyEmail;

  return (
    <NavigationContainer
      ref={navigationRef}
      onStateChange={handleStateChange}
      onReady={() => {
        BootSplash.hide();
      }}
      linking={linking}>
      <Stack.Navigator
        screenOptions={{headerShown: false, gestureEnabled: false}}>
        {authenticated ? (
          <Stack.Screen name="AppTab" component={MainScreen} />
        ) : (
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{stackAnimation: 'fade'}}
            />
            <Stack.Screen
              name="SignUp"
              component={SignUpScreen}
              options={{stackAnimation: 'fade'}}
            />
            <Stack.Screen
              name="ForgotPassword"
              component={ForgotPasswordScreen}
              options={{stackAnimation: 'fade'}}
              initialParams={{callback: () => {}}}
            />
            <Stack.Screen
              name="VerifyResetCode"
              component={VerifyResetCodeScreen}
              options={{stackAnimation: 'fade'}}
              initialParams={{email: null, callback: () => {}}}
            />
            <Stack.Screen
              name="ResetPassword"
              component={ResetPasswordScreen}
              options={{stackAnimation: 'fade'}}
              initialParams={{email: null, token: null, callback: () => {}}}
            />
          </>
        )}

        <Stack.Screen
          name="VerifyPhone"
          component={VerifyPhoneScreen}
          initialParams={{confirmResult: null}}
        />

        <Stack.Screen name="VerifyEmail" component={VerifyEmailScreen} />

        <Stack.Screen
          name="EditSpecialty"
          component={EditSpecialtyScreen}
          initialParams={{isEdit: false}}
        />

        <Stack.Screen
          name="EditCategories"
          component={EditCategoriesScreen}
          initialParams={{isEdit: false}}
        />

        <Stack.Screen
          name="HangoutDetail"
          component={HangoutDetailScreen}
          initialParams={{commentFocused: false, hangoutId: null}}
        />
        <Stack.Screen
          name="HelpDetail"
          component={HelpDetailScreen}
          initialParams={{commentFocused: false, helpId: null}}
        />
        <Stack.Screen
          name="StatusDetail"
          component={StatusDetailScreen}
          initialParams={{commentFocused: false, statusId: null}}
        />
        <Stack.Screen name="About" component={AboutScreen} />
        <Stack.Screen name="FAQ" component={FAQScreen} />
        <Stack.Screen name="Terms" component={TermsScreen} />
        <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
        <Stack.Screen
          name="Search"
          component={SearchScreen}
          options={{stackAnimation: 'fade'}}
        />
        <Stack.Screen
          name="MainTourScreen"
          component={MainTourScreen}
          options={{stackAnimation: 'fade'}}
        />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="MyDetails" component={MyDetailsScreen} />
        <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />

        <Stack.Screen
          name="CreateHangout"
          component={CreateHangoutScreen}
          initialParams={{onlyOneTime: false, callback: null}}
          // options={{
          //   ...TransitionPresets.ModalTransition,
          // }}
        />

        <Stack.Screen
          name="CreateHelp"
          component={CreateHelpScreen}
          initialParams={{onlyOneTime: false, callback: null}}
        />
        <Stack.Screen
          name="EditHangout"
          component={EditHangoutScreen}
          initialParams={{hangout: null}}
        />
        <Stack.Screen name="CreateStatus" component={CreateStatusScreen} />
        <Stack.Screen name="PickLocation" component={PickLocationScreen} />
        <Stack.Screen
          name="PickLocationPost"
          component={PickLocationPostScreen}
        />
        <Stack.Screen
          name="PickLocationDistrict"
          component={PickLocationDistrictScreen}
        />
        <Stack.Screen
          name="CastManagement"
          component={CastHangoutManagementScreen}
        />
        <Stack.Screen
          name="GuestManagement"
          component={GuestHangoutManagementScreen}
        />
        <Stack.Screen
          name="CastHelpManagement"
          component={CastHelpManagementScreen}
        />
        <Stack.Screen
          name="GuestHelpManagement"
          component={GuestHelpManagementScreen}
        />
        <Stack.Screen name="LeaderBoard" component={LeaderBoardScreen} />

        <Stack.Screen
          name="GuestList"
          component={GuestListScreen}
          initialParams={{
            start: null,
            hangoutId: null,
            capacity: null,
            end: null,
          }}
        />
        <Stack.Screen
          name="GuestHelpList"
          component={GuestListHelpScreen}
          initialParams={{start: null, helpId: null, capacity: null, end: null}}
        />
        <Stack.Screen name="PickSpecialty" component={PickSpecialtyScreen} />

        <Stack.Screen name="PickCategory" component={PickCategoryScreen} />

        <Stack.Screen
          name="UserProfile"
          component={UserProfileScreen}
          initialParams={{userId: null}}
        />
        <Stack.Screen
          name="UserProfileBot"
          component={UserProfileScreenBot}
          initialParams={{userId: null}}
        />
        <Stack.Screen
          name="ContactList"
          component={ContactListScreen}
          initialParams={{userId: null, initialTab: 'FriendsTab'}}
        />
        <Stack.Screen
          name="ContactListOfUser"
          component={ContactListScreen}
          initialParams={{userId: null, initialTab: 'FriendsTab'}}
        />
        <Stack.Screen name="Notification" component={NotificationScreen} />
        <Stack.Screen name="FriendRequests" component={FriendRequestsScreen} />
        <Stack.Screen
          name="ChatRoomBot"
          component={ChatRoomScreenBot}
          initialParams={{data: null}}
        />
        <Stack.Screen
          name="GuideVideo"
          component={GuideVideoScreen}
          initialParams={{label: null, videoId: null}}
        />
        <Stack.Screen name="BlockList" component={BlockListScreen} />

        <Stack.Screen
          name="ChatRoom"
          component={ChatRoomScreen}
          initialParams={{data: null, onSetDraft: () => {}, draftMessage: ''}}
        />

        <Stack.Screen
          name="RoomMembers"
          component={RoomMembersScreen}
          initialParams={{type: null}}
        />
        <Stack.Screen
          name="UpdateGroupName"
          component={UpdateGroupNameScreen}
        />
        <Stack.Screen
          name="AddChatMember"
          component={AddChatMemberScreen}
          initialParams={{roomId: null}}
        />
        <Stack.Screen name="MyWallet" component={MyWalletScreen} />
        <Stack.Screen name="BuyKizuna" component={BuyKizunaScreen} />
        <Stack.Screen name="TransferKizuna" component={TransferKizunaScreen} />
        <Stack.Screen
          name="ReviewList"
          component={ReviewListScreen}
          initialParams={{user: null}}
        />
        <Stack.Screen
          name="ReviewForm"
          component={ReviewFormScreen}
          initialParams={{offer: null}}
        />
        <Stack.Screen
          name="PaymentMethod"
          component={PaymentMethodScreen}
          initialParams={{package_id: null}}
        />
        <Stack.Screen
          name="PaymentData"
          component={PaymentDataScreen}
          initialParams={{
            client_secret: null,
            data: null,
            package_id: null,
          }}
        />
        <Stack.Screen
          name="TransactionHistory"
          component={TransactionHistoryScreen}
        />
        <Stack.Screen
          name="UpdateStatus"
          component={UpdateStatusScreen}
          initialParams={{status: null}}
        />
        <Stack.Screen
          name="SelectFriend"
          component={SelectFriendScreen}
          initialParams={{
            sendLabel: 'Send',
            onSend: () => {},
          }}
        />
        <Stack.Screen
          name="SelectFriendTransfer"
          component={SelectFriendTransferScreen}
          initialParams={{
            sendLabel: 'Select',
            onSend: () => {},
          }}
        />
        <Stack.Screen
          name="UserLiked"
          component={UserLikedScreen}
          initialParams={{id: null}}
        />
        <Stack.Screen
          name="ReportContent"
          component={ReportContentScreen}
          initialParams={{id: null, type: null}}
        />
        <Stack.Screen
          name="VideoScreen"
          component={VideoScreen}
          initialParams={{selected: null}}
          options={{
            ...TransitionPresets.FadeFromBottomAndroid,
          }}
        />
        <Stack.Screen
          name="AddFriendPostScreen"
          component={AddFriendPostScreen}
          initialParams={{
            onSelect: () => {},
          }}
        />
        <Stack.Screen
          name="EditOrUpdateFriendPostScreen"
          component={EditOrUpdateFriendPostScreen}
          initialParams={{
            onSelect: () => {},
          }}
        />
        <Stack.Screen
          name="EditHelp"
          component={EditHelpScreen}
          initialParams={{help: null}}
        />
        <Stack.Screen
          name="NearFriend"
          component={NearFriendScreen}
          initialParams={{casts: null}}
        />
        <Stack.Screen
          name="FakeHelps"
          component={FakeHelpsScreen}
          initialParams={{helps: []}}
        />
        <Stack.Screen
          name="FakeHangouts"
          component={FakeHangoutScreen}
          initialParams={{helps: []}}
        />
        <Stack.Screen
          name="ShareAppWithFriend"
          component={ShareAppWithFriendScreen}
        />

        <Stack.Screen name="Support" component={SupportScreen} />
        <Stack.Screen
          name="SupportRejectHangout"
          component={SupportRejectHangoutScreen}
        />
        <Stack.Screen
          name="SupportRejectHelp"
          component={SupportRejectHelpScreen}
        />
        <Stack.Screen
          name="SupportCancelHangout"
          component={SupportCancelHangoutScreen}
        />
        <Stack.Screen
          name="SupportCancelHelp"
          component={SupportCancelHelpScreen}
        />

        <Stack.Screen name="Wallet" component={WalletScreen} />
        <Stack.Screen
          name="PaymentConnectStripe"
          component={ConnectStripeScreen}
        />
        <Stack.Screen
          name="PaymentCreditCardManagement"
          component={CardCreditManagementScreen}
        />
        <Stack.Screen
          name="PaymentCryptoCardManagement"
          component={CardCryptoManagementScreen}
        />
        <Stack.Screen name="PaymentCryptoPanel" component={CryptoPanelScreen} />
        <Stack.Screen name="PaymentOTP" component={PaymentOTPScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
