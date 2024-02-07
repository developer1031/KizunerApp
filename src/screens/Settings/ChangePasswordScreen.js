import React from 'react';
import {View, StyleSheet, Dimensions, StatusBar, Keyboard} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import * as yup from 'yup';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Formik} from 'formik';

import {updateUserPassword} from 'actions';

import Wrapper from 'components/Wrapper';
import Text from 'components/Text';
import Button from 'components/Button';
import Touchable from 'components/Touchable';
import Paper from 'components/Paper';
import FormikInput from 'components/FormikInput';
import HeaderBg from 'components/HeaderBg';
import {getSize} from 'utils/responsive';
import useTheme from 'theme';

const {width} = Dimensions.get('window');

const ChangePasswordScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const loading = useSelector((state) => state.auth.beingUpdatePassword);
  const insets = useSafeAreaInsets();

  const {userInfo} = useSelector((state) => state.auth);
  const isSocial = userInfo?.social_id != null;

  const lang = {
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
      top: insets.top + getSize.h(26),
      left: 0,
      right: 0,
      width,
    },
    backBtn: {
      position: 'absolute',
      top: insets.top + getSize.h(20),
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
  });

  const initialValues = {
    password: '',
    password_confirm: '',
    password_current: '',
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values, {resetForm}) => {
        Keyboard.dismiss();
        dispatch(
          updateUserPassword(values, {
            success: () => resetForm(initialValues),
          }),
        );
      }}
      validationSchema={yup.object().shape({
        password: yup.string().min(6).required(),
        password_confirm: yup
          .string()
          .min(6)
          .max(255)
          .oneOf([yup.ref('password'), null], 'passwords must match')
          .required(),
        // password_current: yup.string().min(6).max(255).required(),
      })}>
      {(formikProps) => (
        <Wrapper dismissKeyboard>
          <StatusBar
            translucent
            backgroundColor="transparent"
            barStyle="light-content"
          />
          <View style={styles.container}>
            <HeaderBg height={insets.top + 120} />
            <Touchable onPress={navigation.goBack} style={styles.backBtn}>
              <MaterialCommunityIcons
                name="chevron-left"
                size={getSize.f(34)}
                color={theme.colors.textContrast}
              />
            </Touchable>
            <View style={styles.innerContainer}>
              <Text variant="header">Change password</Text>
              <Paper style={styles.formWrapper}>
                <FormikInput
                  name="password_current"
                  {...formikProps}
                  inputProps={{
                    label: 'Current password',
                    returnKeyType: 'next',
                    placeholder: 'enter your current password',
                    type: 'password',
                  }}
                />

                <FormikInput
                  name="password"
                  {...formikProps}
                  inputProps={{
                    label: 'New password',
                    returnKeyType: 'next',
                    type: 'password',
                    placeholder: 'enter your new password',
                  }}
                />
                <FormikInput
                  name="password_confirm"
                  {...formikProps}
                  inputProps={{
                    label: 'Retype new password',
                    type: 'password',
                    placeholder: 'enter your new password',
                  }}
                />
                <Button
                  containerStyle={styles.button}
                  onPress={formikProps.handleSubmit}
                  loading={loading}
                  title={lang.send}
                  fullWidth
                />
              </Paper>
            </View>
          </View>
        </Wrapper>
      )}
    </Formik>
  );
};

export default ChangePasswordScreen;
