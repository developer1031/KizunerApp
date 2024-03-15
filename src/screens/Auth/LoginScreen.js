import React, {useState, useEffect, memo} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  StatusBar,
  Keyboard,
  Platform,
  KeyboardAvoidingView,
  Linking,
  Image,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {Formik} from 'formik';
import * as yup from 'yup';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
// import {
//   Settings,
//   AccessToken,
//   AuthenticationToken,
//   LoginManager,
// } from 'react-native-fbsdk-next';
// import {NativeModules} from 'react-native';
import auth from '@react-native-firebase/auth';

import FastImage from 'react-native-fast-image';
import {
  appleAuth,
  appleAuthAndroid,
} from '@invertase/react-native-apple-authentication';
import analytics from '@react-native-firebase/analytics';
import AsyncStorage from '@react-native-community/async-storage';

import {twitterAuth} from 'utils/fetchApi';
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
  const insets = useSafeAreaInsets();
  // const loading = useSelector(state => state.auth.beingLogin)
  const {isAuth, userInfo, loading} = useSelector((state) => state.auth);
  const [eggCount, setEggCount] = useState(0);
  const [eggDevMode, setEggDevMode] = useState(0);
  const [isLoad, setLoad] = useState(false);

  useEffect(() => {
    async function handleDeepLink({url}) {
      // const route = url.replace(/.*?:\/\//g, '');
      // const routeName = route.split('/')[0];
      const token = url.split('token=')[1];
      if (token) {
        await handleLoginSocial('twitter', token, null);
      }
    }

    const listener = Linking.addEventListener('url', handleDeepLink);

    return () => {
      listener.remove();
    };
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

  const handleLoginSocial = async (provider, token, name, secret = null) => {
    await dispatch(loginSocial(provider, token, name, secret));
  };

  const handleAppleSignIn = async () => {
    try {
      const {user, identityToken, fullName} = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
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

  const handleTwitterSignIn = async () => {
    try {
      await twitterAuth();
    } catch (error) {
      console.log(error);
    }
  };

  // const handleFacebookSignIn = async () => {
  //   try {
  //     const result = await LoginManager.logInWithPermissions([
  //       'public_profile',
  //       'email',
  //     ]);
  //     if (result.isCancelled) {
  //       console.log('Login cancelled');
  //     } else {
  //       await setLoad(true);

  //       let token;
  //       if (Platform.OS === 'ios') {
  //         const result = await AuthenticationToken.getAuthenticationTokenIOS();
  //         token = result?.authenticationToken;
  //       } else {
  //         const result = await AccessToken.getCurrentAccessToken();
  //         token = result?.accessToken;
  //       }
  //       await handleLoginSocial('facebook', token);
  //       await setLoad(false);
  //     }
  //   } catch (error) {
  //     console.log(error.message);
  //     dispatch(showAlert({title: 'Error', type: 'error', body: error.message}));
  //     await setLoad(false);
  //   }
  // };

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
      const googleTokens = await GoogleSignin.getTokens();
      await handleLoginSocial('google', googleTokens.accessToken);
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
    twitterBtn: {
      backgroundColor: theme.colors.twitterBtn,
    },
    twitterIcon: {
      width: getSize.f(25),
      height: getSize.f(25),
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
                    appleSupported={
                      Platform.OS == 'ios' ? true : appleAuthAndroid.isSupported
                    }
                    setApple={handleAppleSignIn}
                    // setFacebook={handleFacebookSignIn}
                    setGoogle={handleGoogleSignIn}
                    setTwitter={handleTwitterSignIn}
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
  const appleSupported = props.appleSupported && props.isApple;
  return (
    <View style={props.styles.socialWrapper}>
      {appleSupported && (
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
      <Touchable scalable disabled={props.isLoading} onPress={props.setTwitter}>
        <View
          style={[
            props.styles.socialBtn,
            props.styles.twitterBtn,
            props.isLoading && props.styles.btnLoading,
          ]}>
          <Image source={Icons.ic_twitter} style={[props.styles.twitterIcon]} />
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
