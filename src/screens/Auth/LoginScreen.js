import React, {useState, useEffect, memo} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  StatusBar,
  Keyboard,
  KeyboardAvoidingView,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {Formik} from 'formik';
import * as yup from 'yup';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSafeArea} from 'react-native-safe-area-context';
import {LoginManager, AccessToken} from 'react-native-fbsdk';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';

import FastImage from 'react-native-fast-image';
import appleAuth from '@invertase/react-native-apple-authentication';
import analytics from '@react-native-firebase/analytics';

import AsyncStorage from '@react-native-community/async-storage';

import {toggleTheme, login, showAlert, loginSocial} from 'actions';
import i18n from 'i18n';

import Wrapper from 'components/Wrapper';
import Loading from 'components/Loading';
import Button from 'components/Button';
import Touchable from 'components/Touchable';
import Text from 'components/Text';
import Paper from 'components/Paper';
import HeaderBg from 'components/HeaderBg';
import FormikInput from 'components/FormikInput';
import {getSize} from 'utils/responsive';
import useTheme from 'theme';
import NavigationService from 'navigation/service';
import {Icons} from 'utils/icon';

const {width} = Dimensions.get('window');

const LoginScreen = ({navigation, route}) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  // const loading = useSelector(state => state.auth.beingLogin)
  const {isAuth, userInfo, loading} = useSelector((state) => state.auth);
  const [eggCount, setEggCount] = useState(0);
  const [eggDevMode, setEggDevMode] = useState(0);
  const [isLoad, setLoad] = useState(false);
  const insets = useSafeArea();

  useEffect(() => {
    GoogleSignin.configure({
      offlineAccess: true,
      webClientId:
        '558493488596-4boer0m5rut9e5e6mq6gc8qo5ino47qj.apps.googleusercontent.com',
    });
  }, []);

  const activeEasterEgg = () => {
    if (eggCount === 20) {
      setEggCount(0);
      analytics().logEvent('toggle_theme', {name: theme?.name});
      dispatch(toggleTheme());
    } else {
      setEggCount(eggCount + 1);
    }
  };

  const activeDevModeEgg = async () => {
    if (eggDevMode === 10) {
      setEggDevMode(0);
      const isDevMode = await AsyncStorage.getItem('@kizuner/dev-mode');
      if (isDevMode && isDevMode === 'false') {
        await AsyncStorage.setItem('@kizuner/dev-mode', 'true');
        dispatch(
          showAlert({title: 'Info', type: 'info', body: 'Using URL DEV'}),
        );
      } else {
        await AsyncStorage.setItem('@kizuner/dev-mode', 'false');
        dispatch(
          showAlert({title: 'Info', type: 'info', body: 'Using URL PROD'}),
        );
      }
    } else {
      setEggDevMode(eggDevMode + 1);
    }
  };

  const handleLoginSocial = async (provider, token, name) => {
    await dispatch(loginSocial(provider, token, name));
  };

  const handleAppleSignIn = async () => {
    try {
      const {identityToken, fullName, user} = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });

      await setLoad(true);
      const credentialState = await appleAuth.getCredentialStateForUser(user);
      if (credentialState === appleAuth.State.AUTHORIZED) {
        // user is authenticated
        await handleLoginSocial(
          'apple',
          identityToken,
          `${fullName?.familyName} ${fullName?.givenName}`,
        );
      }
      await setLoad(false);
    } catch (error) {
      console.log(error);
      await setLoad(false);
    }
  };

  const handleFacebookSignIn = async () => {
    try {
      const result = await LoginManager.logInWithPermissions([
        'public_profile',
      ]);
      if (result.isCancelled) {
        console.log('Login cancelled');
      } else {
        await setLoad(true);
        const {accessToken} = await AccessToken.getCurrentAccessToken();
        await handleLoginSocial('facebook', accessToken);
        await setLoad(false);
      }
    } catch (error) {
      console.log(error.message);
      dispatch(showAlert({title: 'Error', type: 'error', body: error.message}));
      await setLoad(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const hasPlayServices = await GoogleSignin.hasPlayServices();
      if (!hasPlayServices) {
        dispatch(
          showAlert({
            title: 'Warning',
            type: 'warning',
            body: "Your device don't have google service, we can not login by google.",
          }),
        );

        return;
      }
      await setLoad(true);
      await GoogleSignin.signIn();
      const {accessToken} = await GoogleSignin.getTokens();
      await handleLoginSocial('google', accessToken);
      await setLoad(false);
    } catch (error) {
      let message = '';
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        message = 'User cancelled the login flow';
      } else if (error.code === statusCodes.IN_PROGRESS) {
        message = 'Operation (e.g. sign in) is in progress already';
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        message = 'Play services not available or outdated';
      } else {
        message = 'Some other error happened';
      }
      dispatch(
        showAlert({
          title: 'Error',
          type: 'error',
          body: message,
        }),
      );
      await setLoad(false);
    }
  };

  const lang = {
    login: i18n.t('login.login'),
    emailLabel: i18n.t('login.emailLabel'),
    emailPlaceholder: i18n.t('login.emailPlaceholder'),
    passwordLabel: i18n.t('login.passwordLabel'),
    passwordPlaceholder: i18n.t('login.passwordPlaceholder'),
    forgotPassword: i18n.t('login.forgotPassword'),
    or: i18n.t('login.or'),
    dontHaveAccount: i18n.t('login.dontHaveAccount'),
    signUp: i18n.t('login.signUp'),
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
    appLogo: {
      width: getSize.h(43),
      height: getSize.h(43),
      resizeMode: 'contain',
      marginBottom: getSize.h(57),
    },
    formWrapper: {
      paddingVertical: getSize.h(40),
      paddingHorizontal: getSize.w(24),
      width: width - getSize.w(48),
    },
    button: {
      marginTop: getSize.h(10),
    },
    forgotPasswordBtn: {
      marginVertical: getSize.h(25),
    },
    forgotPasswordTxt: {
      textAlign: 'center',
    },
    orWrapper: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    orText: {
      color: theme.colors.text2,
      marginHorizontal: getSize.w(10),
    },
    orDivider: {
      backgroundColor: theme.colors.grayLight,
      width: getSize.w(30),
      height: getSize.h(1),
    },
    socialWrapper: {
      marginTop: getSize.h(20),
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    socialBtn: {
      width: getSize.h(46),
      height: getSize.h(46),
      borderRadius: getSize.h(23),
      marginHorizontal: getSize.w(7),
      justifyContent: 'center',
      alignItems: 'center',
    },
    facebookBtn: {
      backgroundColor: theme.colors.facebookBtn,
    },
    appleBtn: {
      backgroundColor: theme.colors.appleBtn,
    },
    googleBtn: {
      backgroundColor: theme.colors.googleBtn,
    },
    bottomWrapper: {
      marginTop: getSize.h(30),
      marginBottom: getSize.h(34) + insets.bottom,
    },
    googleLogo: {
      width: getSize.f(24),
      height: getSize.f(24),
    },
    btnLoading: {
      opacity: 0.5,
    },
    keyAvoidView: {
      flex: 1,
    },
    signUpBtn: {alignSelf: 'center', marginTop: getSize.h(25)},
    bottomText: {
      fontSize: getSize.f(12),
      textAlign: 'center',
      marginHorizontal: getSize.w(40),
    },
  });

  return (
    <Formik
      initialValues={{
        email: '',
        password: '',
      }}
      validationSchema={yup.object().shape({
        email: yup.string().email().required(),
        password: yup.string().min(6).max(255).required(),
      })}
      onSubmit={(values) => {
        Keyboard.dismiss();
        dispatch(login(values));
      }}>
      {(formikProps) => (
        <Wrapper dismissKeyboard>
          <StatusBar
            translucent
            backgroundColor="transparent"
            barStyle="light-content"
          />
          <View style={styles.container}>
            <HeaderBg style={{borderWidth: 0}} image={Icons.lg_bgImage} />
            <KeyboardAvoidingView
              behavior="height"
              keyboardVerticalOffset={-200}
              style={styles.keyAvoidView}>
              <View style={styles.innerContainer} behavior="position">
                {/* <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => activeDevModeEgg()}>
                  
                </TouchableOpacity> */}
                <FastImage source={Icons.Logo} style={styles.appLogo} />
                <Text variant="header">{lang.login}</Text>
                <Paper style={styles.formWrapper}>
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
                  <FormikInput
                    name="password"
                    {...formikProps}
                    inputProps={{
                      label: lang.passwordLabel,
                      type: 'password',
                      placeholder: lang.passwordPlaceholder,
                      showEye: true,
                      onEyePress: activeEasterEgg,
                    }}
                  />
                  <Button
                    containerStyle={styles.button}
                    onPress={formikProps.handleSubmit}
                    title="Login"
                    fullWidth
                    loading={loading}
                  />
                  <Touchable
                    style={styles.forgotPasswordBtn}
                    onPress={() =>
                      navigation.navigate('ForgotPassword', {
                        callback: (email) =>
                          formikProps.setFieldValue('email', email),
                      })
                    }>
                    <Text variant="text1" style={styles.forgotPasswordTxt}>
                      {lang.forgotPassword}
                    </Text>
                  </Touchable>
                  <View style={styles.orWrapper}>
                    <View style={styles.orDivider} />
                    <Text style={styles.orText}>{lang.or}</Text>
                    <View style={styles.orDivider} />
                  </View>
                  <LoginSocial
                    isApple={
                      appleAuth.isSupported && appleAuth.isSignUpButtonSupported
                    }
                    styles={styles}
                    color={theme.colors.textContrast}
                    setApple={handleAppleSignIn}
                    setFacebook={handleFacebookSignIn}
                    setGoogle={handleGoogleSignIn}
                    isLoading={loading}
                  />
                  <Touchable
                    style={styles.signUpBtn}
                    onPress={() => navigation.navigate('SignUp')}>
                    <Text variant="text1">
                      {lang.dontHaveAccount}{' '}
                      <Text color={theme.colors.primary}>{lang.signUp}</Text>
                    </Text>
                  </Touchable>
                </Paper>
                <Footer
                  setTerm={() => navigation.navigate('Terms')}
                  setPolicy={() => navigation.navigate('PrivacyPolicy')}
                  color={theme.colors.secondary}
                  styles={styles}
                />
              </View>
            </KeyboardAvoidingView>
            {isLoad && <Loading fullscreen dark />}
          </View>
        </Wrapper>
      )}
    </Formik>
  );
};

const LoginSocial = memo((props) => {
  return (
    <View style={props.styles.socialWrapper}>
      {props.isApple && (
        <Touchable scalable disabled={props.isLoading} onPress={props.setApple}>
          <View
            style={[
              props.styles.socialBtn,
              props.styles.appleBtn,
              props.isLoading && props.styles.btnLoading,
            ]}>
            <MaterialCommunityIcons
              name="apple"
              color={props.color}
              size={getSize.f(25)}
            />
          </View>
        </Touchable>
      )}
      <Touchable
        scalable
        disabled={props.isLoading}
        onPress={props.setFacebook}>
        <View
          style={[
            props.styles.socialBtn,
            props.styles.facebookBtn,
            props.isLoading && props.styles.btnLoading,
          ]}>
          <MaterialCommunityIcons
            name="facebook"
            color={props.color}
            size={getSize.f(25)}
          />
        </View>
      </Touchable>
      <Touchable scalable disabled={props.isLoading} onPress={props.setGoogle}>
        <View
          style={[
            props.styles.socialBtn,
            props.styles.googleBtn,
            props.isLoading && props.styles.btnLoading,
          ]}>
          <FastImage
            source={Icons.logo_gg}
            style={props.styles.googleLogo}
            resizeMode="contain"
          />
        </View>
      </Touchable>
    </View>
  );
});

const Footer = memo((props) => {
  return (
    <View style={props.styles.bottomWrapper}>
      <Text variant="text1" style={props.styles.bottomText}>
        By creating an account, I agree to Kizuner’s{' '}
        <Text
          onPress={props.setTerm}
          color={props.color}
          style={props.styles.bottomText}>
          Terms & Conditions
        </Text>
        , and{' '}
        <Text
          onPress={props.setPolicy}
          color={props.color}
          style={props.styles.bottomText}>
          Privacy Policy
        </Text>
        .
      </Text>
    </View>
  );
});

export default LoginScreen;
