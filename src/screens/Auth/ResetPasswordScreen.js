import React from 'react';
import {View, StyleSheet, Dimensions, StatusBar} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import * as yup from 'yup';
import {Formik} from 'formik';
import {useSafeArea} from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {getStatusBarHeight} from 'react-native-status-bar-height';

import {resetPassword} from 'actions';
import i18n from 'i18n';

import Wrapper from 'components/Wrapper';
import Text from 'components/Text';
import Button from 'components/Button';
import Touchable from 'components/Touchable';
import Paper from 'components/Paper';
import FormikInput from 'components/FormikInput';
import HeaderBg from 'components/HeaderBg';
import {getSize} from 'utils/responsive';
import useTheme from 'theme';
import {Icons} from 'utils/icon';

const {width} = Dimensions.get('window');

const ResetPasswordScreen = ({navigation, route}) => {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.auth.beingResetPassword);
  const theme = useTheme();
  const insets = useSafeArea();
  const {email, token, callback} = route.params;

  const lang = {
    title: i18n.t('forgotPassword.title'),
    send: 'Update password',
    subTitle: `Please enter new password for account ${email}`,
    passwordLabel: i18n.t('signUp.passwordLabel'),
    passwordPlaceholder: i18n.t('signUp.passwordPlaceholder'),
    password2Label: i18n.t('signUp.password2Label'),
    password2Placeholder: i18n.t('signUp.password2Placeholder'),
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
      marginBottom: getSize.h(40),
      textAlign: 'center',
    },
  });

  return (
    <Formik
      onSubmit={(values) => {
        dispatch(
          resetPassword(
            email,
            values.password,
            values.password_confirmation,
            token,
            callback,
          ),
        );
      }}
      initialValues={{
        password: '',
        password_confirmation: '',
      }}
      validationSchema={yup.object().shape({
        password: yup.string().min(6).max(255).required(),
        password_confirmation: yup
          .string()
          .min(6)
          .max(255)
          .oneOf([yup.ref('password'), null], 'passwords must match')
          .required(),
      })}>
      {(formikProps) => (
        <Wrapper dismissKeyboard>
          <StatusBar
            translucent
            backgroundColor="transparent"
            barStyle="light-content"
          />
          <View style={styles.container}>
            <HeaderBg image={Icons.bgImage} height={327} />
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
                <Button
                  containerStyle={styles.button}
                  onPress={formikProps.handleSubmit}
                  title={lang.send}
                  fullWidth
                  loading={loading}
                />
              </Paper>
            </View>
          </View>
        </Wrapper>
      )}
    </Formik>
  );
};

export default ResetPasswordScreen;
