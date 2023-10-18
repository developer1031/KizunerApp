import React, {useState} from 'react';
import {View, StyleSheet, Dimensions, StatusBar} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useSafeArea} from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import {getStatusBarHeight} from 'react-native-status-bar-height';

import {verifyResetPwCode, sendResetPwCode} from 'actions';

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
import {Icons} from 'utils/icon';

const {width} = Dimensions.get('window');

const VerifyPhoneScreen = ({navigation, route}) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const insets = useSafeArea();
  const [code, setCode] = useState('');
  const [isResent, setIsResent] = useState(false);
  const loading = useSelector((state) => state.auth.beingVerifyResetPwCode);
  const resending = useSelector((state) => state.auth.beingSendResetPwCode);
  const {email, callback} = route.params;

  const onValidate = () => {
    dispatch(verifyResetPwCode(email, code, callback));
  };

  const onResent = () => {
    dispatch(sendResetPwCode(email, () => setIsResent(true)));
  };

  const lang = {
    title: 'Forgot Password',
    validate: 'Verify OTP',
    subTitle: 'Please input the password reset code sent to your email',
    resendHint: i18n.t('verifyPhone.resendHint'),
    resendText: i18n.t('verifyPhone.resendText'),
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
      top: getStatusBarHeight() + getSize.h(28),
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
      marginBottom: getSize.h(65),
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
        <HeaderBg style={{borderWidth: 0}} image={Icons.bgImage} height={327} />
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
            <OTPInputView
              style={styles.codeInput}
              pinCount={6}
              code={code}
              onCodeChanged={(value) => setCode(value)}
              autoFocusOnLoad
              codeInputFieldStyle={styles.codeInputField}
              codeInputHighlightStyle={styles.codeInputHighlight}
            />
            <Button
              containerStyle={styles.button}
              title={lang.validate}
              fullWidth
              onPress={onValidate}
              disabled={code.length < 6}
              loading={loading}
            />
          </Paper>
          <Text style={styles.resendHint}>
            {isResent ? (
              lang.isResent
            ) : (
              <>
                {lang.resendHint}{' '}
                {resending ? (
                  <Loading dark />
                ) : (
                  <Text
                    onPress={onResent}
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

export default VerifyPhoneScreen;
