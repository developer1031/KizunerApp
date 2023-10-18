import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  StatusBar,
  Keyboard,
  Platform,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import * as yup from 'yup';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Formik} from 'formik';
import FastImage from 'react-native-fast-image';

import {updateUserIdentify, sendVerifyEmailCode} from 'actions';
import i18n from 'i18n';

import Wrapper from 'components/Wrapper';
import Text from 'components/Text';
import Button from 'components/Button';
import Touchable from 'components/Touchable';
import Paper from 'components/Paper';
import FormikInput from 'components/FormikInput';
import HeaderBg from 'components/HeaderBg';
import CountryPicker from 'components/CountryPicker';
import Loading from 'components/Loading';
import {getSize} from 'utils/responsive';
import useTheme from 'theme';

const {width} = Dimensions.get('window');

const MyDetailsScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const {userInfo, beingSendVerifyEmailCode, beingSendVerifyPhoneCode} =
    useSelector((state) => state.auth);
  const loading = useSelector((state) => state.auth.beingUpdateIdentify);
  // const [showCountryPicker, setShowCountryPicker] = useState(false)

  // const phone = parsePhoneNumber(userInfo.phone)
  // const [country, setCountry] = useState(phone.country || 'VN')

  const lang = {
    title: 'My details',
    emailLabel: i18n.t('forgotPassword.emailLabel'),
    emailPlaceholder: i18n.t('forgotPassword.emailPlaceholder'),
    send: 'Update',
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      width,
    },
    innerContainer: {
      position: 'absolute',
      alignItems: 'center',
      top: getStatusBarHeight() + getSize.h(26),
      left: 0,
      right: 0,
      width,
    },
    countryFlag: {
      width: getSize.w(28),
      height: getSize.h(20),
      borderRadius: getSize.h(2),
      resizeMode: 'contain',
      marginRight: getSize.w(5),
    },
    backBtn: {
      position: 'absolute',
      top: getStatusBarHeight() + getSize.h(20),
      left: getSize.w(24),
      zIndex: 1,
    },
    formWrapper: {
      paddingVertical: getSize.h(40),
      paddingHorizontal: getSize.w(24),
      width: width - getSize.w(48),
    },
    button: {
      marginTop: getSize.h(20),
    },
    guideText: {
      color: theme.colors.textContrast,
      fontSize: getSize.f(15),
      marginHorizontal: getSize.w(24),
      letterSpacing: 0.04,
      marginBottom: getSize.h(72),
      textAlign: 'center',
    },
    phoneInputWrapper: {
      flexDirection: 'row',
    },
    phoneWrapper: {
      marginLeft: 20,
      flexGrow: 1,
      width: width - getSize.w(48 * 2 + 20 + 100),
    },
    countryWrap: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    countryInput: {
      minWidth: 100,
      borderBottomWidth: getSize.h(1),
      borderBottomColor: theme.colors.divider,
    },
    countryValue: {
      paddingVertical: getSize.h(Platform.OS === 'ios' ? 10 : 8),
      fontSize: getSize.f(16),
      letterSpacing: 1,
      color: theme.colors.text,
    },
    phoneInput: {
      overflow: 'hidden',
      flexGrow: 1,
      maxWidth: width / 2 + getSize.w(10) - getSize.w(48),
    },
    disabled: {
      opacity: 0.3,
    },
  });

  // const countryData = countriesData[country]

  return (
    <Formik
      validationSchema={yup.object().shape({
        name: yup.string().max(18).min(2).trim().required(),
        email: yup.string().email(),
        // phone: yup
        //   .string()
        //   .trim()
        //   .max(11)
        //   .min(8),
      })}
      initialValues={{
        username: userInfo?.username?.trim() || '',
        name: userInfo?.name?.trim() || '',
        email: userInfo?.email || '',
        // phone: phone.phoneNumber || '',
      }}
      initialErrors={
        {
          // phone: phone.error,
        }
      }
      onSubmit={(values) => {
        Keyboard.dismiss();
        let data = {
          ...values,
          // phone: '+' + countryData?.callingCode + values.phone,
        };

        dispatch(updateUserIdentify(data));
      }}>
      {(formikProps) => (
        <Wrapper dismissKeyboard>
          <StatusBar
            translucent
            backgroundColor="transparent"
            barStyle="light-content"
          />
          <View style={styles.container}>
            <HeaderBg height={getStatusBarHeight() + 120} />
            <Touchable onPress={navigation.goBack} style={styles.backBtn}>
              <MaterialCommunityIcons
                name="chevron-left"
                size={getSize.f(34)}
                color={theme.colors.textContrast}
              />
            </Touchable>
            <View style={styles.innerContainer}>
              <Text variant="header">{lang.title}</Text>
              <Paper style={styles.formWrapper}>
                <FormikInput
                  name="username"
                  {...formikProps}
                  inputProps={{
                    label: 'Username',
                    returnKeyType: 'next',
                    placeholder: 'enter your username',
                  }}
                />
                <FormikInput
                  name="name"
                  {...formikProps}
                  inputProps={{
                    label: 'Name',
                    returnKeyType: 'next',
                    placeholder: 'enter your name',
                  }}
                />
                <FormikInput
                  name="email"
                  {...formikProps}
                  inputProps={{
                    type: 'email',
                    label: lang.emailLabel,
                    returnKeyType: 'next',
                    placeholder: lang.emailPlaceholder,
                    labelRight: (
                      <View
                        style={
                          formikProps.values.email !== userInfo?.email &&
                          styles.disabled
                        }>
                        {userInfo?.email &&
                          (userInfo.email_verified_at ? (
                            <Text
                              variant="inputLabel"
                              color={theme.colors.offered}>
                              Verified
                            </Text>
                          ) : beingSendVerifyEmailCode ? (
                            <Loading dark />
                          ) : (
                            <Touchable
                              disabled={
                                formikProps.values.email !== userInfo?.email
                              }
                              onPress={() => dispatch(sendVerifyEmailCode())}>
                              <Text
                                variant="inputLabel"
                                color={theme.colors.primary}>
                                Verify
                              </Text>
                            </Touchable>
                          ))}
                      </View>
                    ),
                  }}
                />
                {/* <View style={styles.phoneInputWrapper}>
                  <Touchable onPress={() => setShowCountryPicker(true)}>
                    <View style={styles.countryInput}>
                      <Text variant="inputLabel">Country</Text>
                      <View style={styles.countryWrap}>
                        <FastImage
                          style={styles.countryFlag}
                          source={{uri: countryData?.flag}}
                        />
                        <Text style={styles.countryValue}>
                          (+{countryData?.callingCode?.[0]})
                        </Text>
                        <MaterialCommunityIcons
                          name="menu-down"
                          size={getSize.f(24)}
                          color={theme.colors.text}
                        />
                      </View>
                    </View>
                  </Touchable>
                  <FormikInput
                    name="phone"
                    {...formikProps}
                    inputProps={{
                      label: 'Phone number',
                      returnKeyType: 'next',
                      placeholder: '',
                      wrapperStyle: styles.phoneWrapper,
                      keyboardType: 'phone-pad',
                      style: styles.phoneInput,
                      labelRight: (
                        <View>
                          {userInfo.phone &&
                            (userInfo.phone_verified_at ? (
                              <Text
                                variant="inputLabel"
                                color={theme.colors.offered}>
                                Verified
                              </Text>
                            ) : beingSendVerifyPhoneCode ? (
                              <Loading dark />
                            ) : (
                              <Touchable
                                onPress={() => {
                                  if (!phone.error) {
                                    dispatch(
                                      sendVerifyPhoneCode(userInfo.phone),
                                    );
                                  } else {
                                    formikProps.setFieldError(
                                      'phone',
                                      phone.error,
                                    );
                                  }
                                }}>
                                <Text
                                  variant="inputLabel"
                                  color={theme.colors.primary}>
                                  {formikProps?.values?.phone &&
                                    formikProps?.values?.phone.length > 0 &&
                                    'Verify'}
                                </Text>
                              </Touchable>
                            ))}
                        </View>
                      ),
                    }}
                  />
                </View> */}
                <Button
                  containerStyle={styles.button}
                  onPress={formikProps.handleSubmit}
                  title={lang.send}
                  loading={loading}
                  fullWidth
                  disabled={!formikProps.dirty}
                />
              </Paper>
            </View>
          </View>
          {/* <CountryPicker
            open={showCountryPicker}
            onClose={() => setShowCountryPicker(false)}
            value={country}
            onSelect={value => {
              setCountry(value)
              setShowCountryPicker(false)
            }}
          /> */}
        </Wrapper>
      )}
    </Formik>
  );
};

export default MyDetailsScreen;
