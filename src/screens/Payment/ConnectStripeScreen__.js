import React, {useEffect, useRef, useState} from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import useTheme from 'theme';
import {getSize} from 'utils/responsive';
import {Wrapper, Text, Touchable, Button} from 'components';
import {useDispatch, useSelector} from 'react-redux';
import {connectStripe, getStripeCustomAccount} from 'actions';
import Paper from 'components/Paper';
import WithdrawModel from './components/WithdrawModel';
import {SpaceView} from 'components/SpaceView';
import CountryPicker from 'components/CountryPicker';
import {countries as countriesData} from 'assets/data';
import FastImage from 'react-native-fast-image';
import * as yup from 'yup';
import moment from 'moment';
import {
  Platform,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  View,
  TouchableWithoutFeedback,
  Linking,
} from 'react-native';
import {showAlert} from 'actions';
import {getWalletStripeStatus} from 'actions';
import {HeaderLinear} from 'components/HeaderLinear';
import {useAppState} from '@react-native-community/hooks';
import {set} from 'lodash';

const {width, height} = Dimensions.get('window');

const ConnectStripeScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const appState = useAppState();

  const {stripeStatusResponse} = useSelector((state) => state.wallet);
  const {amount, status} = stripeStatusResponse;
  const isEdit = status == 'CONNECTED' || status == 'PENDING';
  const notConnected = status == 'NOT_CONNECTED';

  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const HEADER_HEIGHT = 68 + insets.top;

  const refWithdraw = useRef(null);

  const [showCountryPicker, setShowCountryPicker] = useState(false);

  const [countryCode, setCountryCode] = useState('JP');
  const [initialized, setInitialized] = useState(false);
  const [externalAccountId, setExternalAccountId] = useState('');
  const [loading, setLoading] = useState(false);

  //init datepicker
  const countryData = countriesData[countryCode];

  const styles = StyleSheet.create({
    btnBack: {
      position: 'absolute',
      top: insets.top + getSize.h(20),
      left: getSize.w(24),
      zIndex: 10,
    },
    headerTitle: {
      top: insets.top + getSize.h(26),
      textAlign: 'center',
    },
    mainContainer: {
      paddingVertical: getSize.w(24),
      paddingHorizontal: getSize.w(24),
      minHeight: height - HEADER_HEIGHT,
    },
    formWrapper: {
      paddingVertical: getSize.h(40),
      paddingHorizontal: getSize.w(24),
    },
    btnContainer: {
      position: 'absolute',
      bottom: insets.bottom + getSize.h(12),
      left: 0,
      right: 0,
      paddingHorizontal: getSize.w(24),
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    countryInput: {
      minWidth: 100,
      borderBottomWidth: getSize.h(1),
      borderBottomColor: theme.colors.divider,
    },
    countryWrap: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    countryFlag: {
      width: getSize.w(28),
      height: getSize.h(20),
      borderRadius: getSize.h(2),
      resizeMode: 'contain',
      marginRight: getSize.w(5),
    },
    countryValue: {
      paddingVertical: getSize.h(Platform.OS === 'ios' ? 10 : 8),
      fontSize: getSize.f(16),
      letterSpacing: 1,
    },
  });

  useEffect(() => {
    // Handle app state changes
    console.log('App State:', appState);

    // Check if the app has just become active (opened)
    if (appState === 'active') {
      dispatch(getWalletStripeStatus());
    }
  }, [appState]);

  const onConnect = () => {
    setLoading(true);
    const req = {
      // country_code: countryCode,
    };

    dispatch(
      connectStripe(req, {
        success: (result) => {
          setLoading(false);
          Linking.openURL(result.url);
        },
        failure: (err) => {
          setLoading(false);
          dispatch(
            showAlert({
              title: 'Error',
              type: 'error',
              body: 'Something went wrong',
            }),
          );
        },
      }),
    );
  };
  const onPressWithdraw = () => refWithdraw.current?.show();

  return (
    <>
      <CountryPicker
        open={showCountryPicker}
        onClose={() => setShowCountryPicker(false)}
        value={countryCode}
        showCode={false}
        onSelect={(value) => {
          setCountryCode(value);
          setShowCountryPicker(false);
        }}
      />

      <WithdrawModel
        ref={refWithdraw}
        externalAccountId={externalAccountId}
        countryCode={countryCode}
      />

      <View style={{flex: 1}}>
        <HeaderLinear
          style={{height: HEADER_HEIGHT}}
          colors={theme.colors.gradient}
          start={{x: 0, y: 1}}
          end={{x: 1, y: 1}}
          iconLeft={
            <Touchable
              onPress={navigation.goBack}
              style={styles.btnBack}
              textStyles={styles.headerTitle}>
              <MaterialCommunityIcons
                name="chevron-left"
                size={getSize.f(34)}
                color={theme.colors.textContrast}
              />
            </Touchable>
          }
          textStyles={styles.headerTitle}
          title={'Payment connect'}
        />

        <ScrollView
          style={{flex: 1}}
          contentContainerStyle={styles.mainContainer}>
          {/* {notConnected && (
            <TouchableWithoutFeedback
              onPress={() => setShowCountryPicker(true)}>
              <View style={styles.countryInput}>
                <Text variant="inputLabel">Country </Text>
                <View style={styles.countryWrap}>
                  <FastImage
                    style={styles.countryFlag}
                    source={{uri: countryData?.flag}}
                  />
                  <Text style={[styles.countryValue, {flex: 1}]}>
                    {' '}
                    {countryData?.name?.common}
                  </Text>
                  <MaterialCommunityIcons
                    name="menu-down"
                    size={getSize.f(24)}
                    color={theme.colors.text}
                  />
                </View>
              </View>
            </TouchableWithoutFeedback>
          )} */}

          <View style={[styles.btnContainer]}>
            {notConnected ? (
              <Button
                title="Connect"
                fullWidth
                loading={loading}
                onPress={onConnect}
                containerStyle={{flex: 1 / 2}}
              />
            ) : (
              <View style={{flexDirection: 'row', width: '100%'}}>
                <Button
                  title="Edit"
                  onPress={onConnect}
                  fullWidth
                  loading={loading}
                  containerStyle={{flex: 1 / 2}}
                />

                <SpaceView />

                <Button
                  onPress={onPressWithdraw}
                  title="Withdraw"
                  fullWidth
                  containerStyle={{flex: 1 / 2}}
                />
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </>
  );
};
export default ConnectStripeScreen;
