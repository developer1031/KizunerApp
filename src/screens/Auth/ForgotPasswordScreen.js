import React from 'react';
import {View, StyleSheet, Dimensions, StatusBar} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import * as yup from 'yup';
import {Formik} from 'formik';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {getStatusBarHeight} from 'react-native-status-bar-height';

import {sendResetPwCode} from 'actions';
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

const ForgotPasswordScreen = ({navigation, route}) => {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.auth.beingSendResetPwCode);
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const {callback} = route.params;

  const lang = {
    title: i18n.t('forgotPassword.title'),
    emailLabel: i18n.t('forgotPassword.emailLabel'),
    emailPlaceholder: i18n.t('forgotPassword.emailPlaceholder'),
    send: i18n.t('forgotPassword.send'),
    subTitle: i18n.t('forgotPassword.subTitle'),
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
      marginBottom: getSize.h(72),
      textAlign: 'center',
    },
  });

  return (
    <Formik
      onSubmit={(values) => {
        dispatch(sendResetPwCode(values.email, null, callback));
      }}
      initialValues={{
        email: '',
      }}
      validationSchema={yup.object().shape({
        email: yup.string().email().required(),
      })}>
      {(formikProps) => (
        <Wrapper dismissKeyboard>
          <StatusBar
            translucent
            backgroundColor="transparent"
            barStyle="light-content"
          />
          <View style={styles.container}>
            <HeaderBg
              style={{borderWidth: 0}}
              image={Icons.bgImage}
              height={327}
            />
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
                  name="email"
                  {...formikProps}
                  inputProps={{
                    type: 'email',
                    label: lang.emailLabel,
                    returnKeyType: 'next',
                    placeholder: lang.emailPlaceholder,
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

export default ForgotPasswordScreen;
