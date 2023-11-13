import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  ScrollView,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import * as yup from 'yup';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Formik} from 'formik';
import CheckBox from '@react-native-community/checkbox';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import LinearGradient from 'react-native-linear-gradient';

import {signUp, showAlert} from 'actions';
import i18n from 'i18n';
import {countries as countriesData} from 'assets/data';

import Wrapper from 'components/Wrapper';
import Button from 'components/Button';
import Touchable from 'components/Touchable';
import Text from 'components/Text';
import Paper from 'components/Paper';
import HeaderBg from 'components/HeaderBg';
import FormikInput from 'components/FormikInput';
import CountryPicker from 'components/CountryPicker';
import {getSize} from 'utils/responsive';
import useTheme from 'theme';
import {Icons} from 'utils/icon';

const {width, height} = Dimensions.get('window');

const SignUpScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const loading = useSelector((state) => state.auth.beingSignUp);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [country, setCountry] = useState('VN');
  const [agree, setAgree] = useState(false);

  const insets = useSafeAreaInsets();

  const lang = {
    login: i18n.t('signUp.login'),
    nameLabel: i18n.t('signUp.nameLabel'),
    namePlaceholder: i18n.t('signUp.namePlaceholder'),
    emailLabel: i18n.t('signUp.emailLabel'),
    emailPlaceholder: i18n.t('signUp.emailPlaceholder'),
    countryLabel: i18n.t('signUp.countryLabel'),
    phoneLabel: i18n.t('signUp.phoneLabel'),
    phonePlaceholder: i18n.t('signUp.phonePlaceholder'),
    passwordLabel: i18n.t('signUp.passwordLabel'),
    passwordPlaceholder: i18n.t('signUp.passwordPlaceholder'),
    password2Label: i18n.t('signUp.password2Label'),
    password2Placeholder: i18n.t('signUp.password2Placeholder'),
    forgotPassword: i18n.t('signUp.forgotPassword'),
    or: i18n.t('signUp.or'),
    alreadyHaveAccount: i18n.t('signUp.alreadyHaveAccount'),
    signUp: i18n.t('signUp.signUp'),
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
      bottom: 0,
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
    appLogo: {
      width: getSize.h(43),
      height: getSize.h(43),
      resizeMode: 'contain',
      marginBottom: getSize.h(25),
    },
    formWrapper: {
      paddingBottom: getSize.h(40),
      paddingHorizontal: getSize.w(24),
      width: width - getSize.w(48),
      overflow: 'hidden',
    },
    button: {
      marginTop: getSize.h(10),
    },
    bottomOverlay: {
      position: 'absolute',
      bottom: getSize.h(90),
      height: getSize.h(70),
      left: 0,
      right: 0,
    },
    topOverlay: {
      height: getSize.h(40),
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 2,
    },
    forgotPasswordBtn: {
      marginVertical: getSize.h(20),
    },
    forgotPasswordTxt: {
      textAlign: 'center',
    },
    bottomWrapper: {
      marginTop: getSize.h(30),
      marginBottom: getSize.h(34) + insets.bottom,
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
    keyAvoidView: {
      flex: 1,
    },
    phoneInput: {
      overflow: 'hidden',
      flexGrow: 1,
      maxWidth: width / 2 + getSize.w(10) - getSize.w(48),
    },
    agreeWrap: {
      marginTop: getSize.h(5),
      marginBottom: getSize.h(20),
      flexDirection: 'row',
    },
    agreeText: {
      fontSize: getSize.f(12),
      flexGrow: 1,
      flex: 1,
    },
    agreeBox: {
      left: -getSize.w(3),
      transform: [
        {
          scale: Platform.OS === 'ios' ? 0.7 : 1,
        },
      ],
    },
    formScroll: {
      height: height - getStatusBarHeight() - getSize.h(280),
    },
    formContainer: {
      paddingBottom: getSize.h(50),
      paddingTop: getSize.h(40),
    },
  });

  return (
    <Formik
      initialValues={{
        name: '',
        phone: '',
        email: '',
        password: '',
        password_confirmation: '',
      }}
      validationSchema={yup.object().shape({
        name: yup.string().max(18).min(2).trim().required(),
        email: yup.string().email().required(),
        // phone: yup
        //   .string()
        //   .trim()
        //   .max(11)
        //   .min(8)
        //   .required(),
        password: yup.string().min(6).max(255).required(),
        password_confirmation: yup
          .string()
          .min(6)
          .max(255)
          .oneOf([yup.ref('password'), null], 'passwords must match')
          .required(),
      })}
      onSubmit={(values) => {
        if (!agree) {
          dispatch(
            showAlert({
              title: 'Error',
              type: 'error',
              body: 'You must check agree our policy to continue!',
            }),
          );
        } else {
          Keyboard.dismiss();
          const data = {
            ...values,
            // phone: '+' + countryData?.callingCode + values.phone,
          };
          // dispatch(setNeedVerifyEmail(true))
          dispatch(signUp(data));
        }
      }}>
      {(formikProps) => (
        <Wrapper>
          <StatusBar
            translucent
            backgroundColor="transparent"
            barStyle="light-content"
          />
          <KeyboardAvoidingView
            behavior="height"
            style={styles.keyAvoidView}
            keyboardVerticalOffset={Platform.OS === 'android' ? -200 : -150}>
            <View style={styles.container}>
              <HeaderBg image={Icons.su_bgImage} style={{borderWidth: 0}} />
              <View style={styles.innerContainer}>
                <Text variant="header">{lang.signUp}</Text>
                <Paper style={styles.formWrapper}>
                  <LinearGradient
                    style={styles.topOverlay}
                    colors={[
                      'rgba(255,255,255, 0)',
                      'rgba(255,255,255,0.8)',
                      'rgba(255,255,255,1)',
                    ]}
                    start={{x: 0, y: 1}}
                    end={{x: 0, y: 0}}
                  />
                  <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.formContainer}
                    style={styles.formScroll}>
                    <FormikInput
                      name="name"
                      {...formikProps}
                      inputProps={{
                        label: lang.nameLabel,
                        returnKeyType: 'next',
                        placeholder: lang.namePlaceholder,
                        autoCapitalize: 'words',
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
                      }}
                    />

                    {/* <View style={styles.phoneInputWrapper}>
                      <Touchable onPress={() => setShowCountryPicker(true)}>
                        <View style={styles.countryInput}>
                          <Text variant='inputLabel'>{'Country Code'}</Text>
                          <View style={styles.countryWrap}>
                            <FastImage
                              style={styles.countryFlag}
                              source={{uri: countryData?.flag}}
                            />
                            <Text style={styles.countryValue}>
                              (+{countryData?.callingCode?.[0]})
                            </Text>
                            <MaterialCommunityIcons
                              name='menu-down'
                              size={getSize.f(24)}
                              color={theme.colors.text}
                            />
                          </View>
                        </View>
                      </Touchable>
                      <FormikInput
                        name='phone'
                        {...formikProps}
                        inputProps={{
                          label: lang.phoneLabel,
                          returnKeyType: 'next',
                          placeholder: lang.phonePlaceholder,
                          wrapperStyle: styles.phoneWrapper,
                          keyboardType: 'phone-pad',
                          style: styles.phoneInput,
                        }}
                      />
                    </View> */}

                    <FormikInput
                      name="password"
                      {...formikProps}
                      inputProps={{
                        label: lang.passwordLabel,
                        type: 'password',
                        placeholder: lang.passwordPlaceholder,
                      }}
                    />
                    <FormikInput
                      name="password_confirmation"
                      {...formikProps}
                      inputProps={{
                        label: lang.password2Label,
                        type: 'password',
                        placeholder: lang.password2Placeholder,
                      }}
                    />
                    <View style={styles.agreeWrap}>
                      <CheckBox
                        style={styles.agreeBox}
                        value={agree}
                        onValueChange={setAgree}
                        boxType="square"
                        lineWidth={3}
                        onCheckColor={theme.colors.primary}
                        onTintColor={theme.colors.primary}
                      />
                      <Text variant="text1" style={styles.agreeText}>
                        By creating an account, I agree to Kizuner’s{' '}
                        <Text
                          onPress={() => navigation.navigate('Terms')}
                          color={theme.colors.secondary}
                          style={styles.agreeText}>
                          Terms & Conditions
                        </Text>
                        , and{' '}
                        <Text
                          onPress={() => navigation.navigate('PrivacyPolicy')}
                          color={theme.colors.secondary}
                          style={styles.agreeText}>
                          Privacy Policy
                        </Text>
                        .
                      </Text>
                    </View>
                  </ScrollView>
                  {/* <LinearGradient
                    style={styles.bottomOverlay}
                    colors={[
                      'rgba(255,255,255, 0)',
                      'rgba(255,255,255,0.8)',
                      'rgba(255,255,255,1)',
                    ]}
                    start={{x: 0, y: 0}}
                    end={{x: 0, y: 1}}
                  /> */}
                  <Button
                    containerStyle={styles.button}
                    onPress={formikProps.handleSubmit}
                    title={lang.signUp}
                    fullWidth
                    loading={loading}
                  />
                </Paper>
                <View style={styles.bottomWrapper}>
                  <Touchable onPress={() => navigation.navigate('Login')}>
                    <Text variant="text1">
                      {lang.alreadyHaveAccount}{' '}
                      <Text color={theme.colors.primary}>{lang.login}</Text>
                    </Text>
                  </Touchable>
                </View>
              </View>
            </View>
          </KeyboardAvoidingView>
          <CountryPicker
            open={showCountryPicker}
            onClose={() => setShowCountryPicker(false)}
            value={country}
            onSelect={(value) => {
              setCountry(value);
              setShowCountryPicker(false);
            }}
          />
        </Wrapper>
      )}
    </Formik>
  );
};

export default SignUpScreen;
