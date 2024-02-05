import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Dimensions, StatusBar} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import OTPInputView from '@twotalltotems/react-native-otp-input';

import {verifyEmail, sendVerifyEmailCode} from 'actions';

import Wrapper from 'components/Wrapper';
import Text from 'components/Text';
import Button from 'components/Button';
import Touchable from 'components/Touchable';
import Paper from 'components/Paper';
import HeaderBg from 'components/HeaderBg';
import Loading from 'components/Loading';
import {getSize} from 'utils/responsive';
import useTheme from 'theme';
import i18n from 'i18n';
import InputOTPCustom from '../../components/InputOTPCustom';

const {width} = Dimensions.get('window');

const VerifyEmailScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const {userInfo, beingVerifyEmail, beingSendVerifyEmailCode} = useSelector(
    (state) => state.auth,
  );
  const [code, setCode] = useState('');
  const [expireTime, setExpireTime] = useState(5 * 60);
  const [isSent, setIsSent] = useState(false);

  const onValidate = () => {
    dispatch(verifyEmail(code));
  };

  const displayTimeLeft = (seconds) => {
    let minutesLeft = Math.floor(seconds / 60);
    let secondsLeft = seconds % 60;
    minutesLeft =
      minutesLeft.toString().length === 1 ? '0' + minutesLeft : minutesLeft;
    secondsLeft =
      secondsLeft.toString().length === 1 ? '0' + secondsLeft : secondsLeft;
    return `${minutesLeft}:${secondsLeft}`;
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (!expireTime) {
        clearInterval(intervalId);
        return;
      }

      setExpireTime(expireTime - 1);
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [expireTime]);

  const lang = {
    title: i18n.t('verifyEmail.title'),
    validate: i18n.t('verifyEmail.validate'),
    subTitle: i18n.t('verifyEmail.subTitle', {email: userInfo?.email}),
    expiredIn: i18n.t('verifyEmail.expiredIn'),
    resendHint: i18n.t('verifyEmail.resendHint'),
    resendText: i18n.t('verifyEmail.resendText'),
    codeExpired: i18n.t('verifyEmail.codeExpired'),
    isResent: 'New verify code sent!',
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
      top: insets.top + getSize.h(35),
      left: 0,
      right: 0,
      width,
    },
    backBtn: {
      position: 'absolute',
      top: insets.top + getSize.h(28),
      left: getSize.w(24),
      zIndex: 10,
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
      marginBottom: getSize.h(35),
      textAlign: 'center',
    },
    codeInput: {
      height: getSize.h(40),
    },
    codeInputField: {
      borderWidth: 2,
      borderColor: theme.colors.grayLight,
      height: getSize.h(40),
      width: getSize.h(40),
      borderRadius: getSize.h(20),
      fontFamily: theme.fonts.sfPro.medium,
      fontSize: getSize.f(20),
      color: theme.colors.text,
      padding: 0,
    },
    codeInputHighlight: {
      borderColor: theme.colors.primary,
    },
    expiredText: {
      textAlign: 'center',
      fontSize: getSize.f(15),
      marginTop: getSize.h(30),
      marginBottom: getSize.h(10),
    },
    expiredTime: {
      color: theme.colors.primary,
      fontVariant: ['tabular-nums'],
    },
    resendHint: {
      textAlign: 'center',
      fontSize: getSize.f(15),
      marginTop: getSize.h(27),
    },
    resendText: {
      color: theme.colors.primary,
    },
  });

  return (
    <Wrapper dismissKeyboard>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <View style={styles.container}>
        <HeaderBg height={327} />
        <Touchable onPress={navigation.goBack} style={styles.backBtn}>
          <MaterialCommunityIcons
            name="chevron-left"
            size={getSize.f(34)}
            color={theme.colors.textContrast}
          />
        </Touchable>
        <View style={styles.innerContainer}>
          <Text variant="header">{lang.title}</Text>
          <Text style={styles.guideText}>{lang.subTitle}</Text>
          <Paper style={styles.formWrapper}>
            {/* <OTPInputView
              style={styles.codeInput}
              pinCount={6}
              code={code}
              onCodeChanged={value => setCode(value)}
              autoFocusOnLoad
              codeInputFieldStyle={styles.codeInputField}
              codeInputHighlightStyle={styles.codeInputHighlight}
            /> */}

            <InputOTPCustom onChange={(code) => setCode(code)} />

            <Text style={styles.expiredText}>
              {expireTime > 0 ? (
                <>
                  {lang.expiredIn}{' '}
                  <Text style={[styles.expiredText, styles.expiredTime]}>
                    {displayTimeLeft(expireTime)}
                  </Text>
                </>
              ) : (
                lang.codeExpired
              )}
            </Text>
            <Button
              containerStyle={styles.button}
              title={lang.validate}
              fullWidth
              onPress={onValidate}
              disabled={code.length < 6}
              loading={beingVerifyEmail}
            />
          </Paper>
          <Text style={styles.resendHint}>
            {isSent ? (
              lang.isSent
            ) : (
              <>
                {lang.resendHint}{' '}
                {beingSendVerifyEmailCode ? (
                  <Loading dark />
                ) : (
                  <Text
                    onPress={() =>
                      dispatch(
                        sendVerifyEmailCode(() => {
                          setExpireTime(5 * 60);
                          setIsSent(true);
                        }),
                      )
                    }
                    style={[styles.resendHint, styles.resendText]}>
                    {lang.resendText}
                  </Text>
                )}
              </>
            )}
          </Text>
        </View>
      </View>
    </Wrapper>
  );
};

export default VerifyEmailScreen;
