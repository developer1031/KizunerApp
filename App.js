import React, {useEffect} from 'react';
import {StatusBar, Platform, UIManager} from 'react-native';
import {Provider as PaperProvider} from 'react-native-paper';
import {Provider as ReduxProvider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import moment from 'moment';
import momentDurationFormatSetup from 'moment-duration-format';
import {StripeProvider} from '@stripe/stripe-react-native';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

import {
  TopAlert,
  Modalize,
  TopUpLeaderBoard,
  ModalizeWithAll,
} from 'components';
import Navigation from 'navigation';
import store, {persistor} from './src/store';
import {STRIPE_KEY} from 'utils/constants';
import Crashlytic from 'utils/crashlyticService';
import Orientation from 'react-native-orientation-locker';

import {TourGuideProvider} from 'rn-tourguide';

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

momentDurationFormatSetup(moment);

GoogleSignin.configure({
  offlineAccess: true,
  webClientId:
    '558493488596-4boer0m5rut9e5e6mq6gc8qo5ino47qj.apps.googleusercontent.com',
});

const App = () => {
  useEffect(() => {
    Orientation.lockToPortrait();
  }, []);

  return (
    <StripeProvider publishableKey={STRIPE_KEY}>
      <ReduxProvider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <TourGuideProvider androidStatusBarVisible={true}>
            <PaperProvider>
              <SafeAreaProvider>
                <GestureHandlerRootView style={{flex: 1}}>
                  <TopUpLeaderBoard />
                  <StatusBar barStyle="light-content" />
                  <TopAlert />

                  <Navigation />

                  <Modalize />
                  <ModalizeWithAll />

                  {/* <Crashlytic /> */}
                </GestureHandlerRootView>
              </SafeAreaProvider>
            </PaperProvider>
          </TourGuideProvider>
        </PersistGate>
      </ReduxProvider>
    </StripeProvider>
  );
};

export default App;
