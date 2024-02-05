import React, {useState, useEffect} from 'react';
import {StyleSheet, View, KeyboardAvoidingView, Keyboard} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useSelector, useDispatch} from 'react-redux';
import {Formik} from 'formik';
import * as yup from 'yup';
import {useSafeArea} from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  Wrapper,
  HeaderBg,
  Text,
  Touchable,
  Paper,
  FormikInput,
  Loading,
  Button,
} from 'components';
import useTheme from 'theme';
import {getSize} from 'utils/responsive';

import {postPaymentCryptoCard, deletePaymentCryptoCard} from 'actions';
import InputChooseCryptoCurrencyPayment from 'components/InputChooseCryptoCurrencyPayment';

const CryptoPanelScreen = ({navigation, route}) => {
  const STATUS_BAR = insets.top;
  const {beingAddCard, beingRemoveCard} = useSelector((state) => state.wallet);
  const HEADER_HEIGHT = 120;
  const theme = useTheme();
  const insets = useSafeArea();
  const dispatch = useDispatch();
  const defaultInitialData = route.params?.data;

  const styles = StyleSheet.create({
    wrapper: {flex: 1},
    headerBg: {zIndex: 1},
    headerTitle: {
      top: STATUS_BAR + getSize.h(26),
      textAlign: 'center',
      left: 0,
      right: 0,
      position: 'absolute',
      zIndex: 1,
    },
    headerActions: {
      position: 'absolute',
      top: STATUS_BAR + getSize.h(25),
      left: getSize.w(24),
      right: getSize.w(24),
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      zIndex: 1,
    },
    headerBtn: {
      fontSize: getSize.f(16),
      fontFamily: theme.fonts.sfPro.medium,
      color: theme.colors.textContrast,
    },
    scrollWrap: {flex: 1},
    scrollCon: {
      paddingBottom: getSize.h(20) + insets.bottom,
      paddingTop: getSize.h(10),
      flexGrow: 1,
      flex: 1,
    },
    formWrap: {
      position: 'absolute',
      paddingVertical: getSize.h(40),
      paddingHorizontal: getSize.w(24),
      left: getSize.w(24),
      right: getSize.w(24),
      bottom: getSize.h(24),
      flex: 1,
      zIndex: 2,
      top: STATUS_BAR + getSize.h(65),
      overflow: 'hidden',
    },
    statusInput: {
      textAlignVertical: 'top',
      height: getSize.h(70),
      paddingTop: getSize.h(10),
    },
    processBtn: {
      position: 'absolute',
      bottom: getSize.h(40),
      right: getSize.w(24),
      left: getSize.w(24),
    },
    cardIcon: {
      marginTop: getSize.h(5),
    },
    keyboardAvoidingView: {
      flex: 1,
    },
  });

  const handleSubmit = (values) => {
    console.log(values);
    dispatch(postPaymentCryptoCard(values));
  };

  function handleDeleteCard() {
    dispatch(deletePaymentCryptoCard(defaultInitialData.id));
  }

  const validationSchema = () => {
    return yup.object().shape({
      currency: yup.string().required(),
      wallet_address: yup.string().max(255).required(),
    });
  };

  return (
    <Formik
      validateOnChange={false}
      initialValues={{
        currency: '',
        wallet_address: defaultInitialData?.wallet_address,
        extra_id: defaultInitialData?.extra_id,
      }}
      validationSchema={!defaultInitialData && validationSchema}
      onSubmit={handleSubmit}>
      {(formikProps) => (
        <Wrapper dismissKeyboard style={styles.wrapper}>
          <HeaderBg
            height={HEADER_HEIGHT}
            style={styles.headerBg}
            addSBHeight
          />
          <Text variant="header" style={styles.headerTitle}>
            Crypto Info
          </Text>
          <View style={styles.headerActions}>
            <Touchable onPress={navigation.goBack}>
              <Text style={styles.headerBtn}>Cancel</Text>
            </Touchable>
            {!!defaultInitialData &&
              (beingRemoveCard ? (
                <Loading />
              ) : (
                <Touchable onPress={handleDeleteCard}>
                  <MaterialCommunityIcons
                    name="delete"
                    size={getSize.f(24)}
                    color={theme.colors.textContrast}
                  />
                </Touchable>
              ))}
          </View>
          <Paper style={styles.formWrap}>
            <KeyboardAvoidingView
              style={styles.keyboardAvoidingView}
              behavior="position"
              keyboardVerticalOffset={-90}>
              <InputChooseCryptoCurrencyPayment
                defaultCurrency={defaultInitialData?.currency}
                disabled={!!defaultInitialData?.currency}
                onChange={(value) =>
                  formikProps.setFieldValue('currency', value)
                }
              />

              <Text variant="errorHelper" style={{marginBottom: 10}}>
                {formikProps.errors.currency
                  ? 'Please choose payment method'
                  : ' '}
              </Text>

              <FormikInput
                name="wallet_address"
                {...formikProps}
                inputProps={{
                  label: 'Address',
                  placeholder: 'enter address',
                  disabled: !!defaultInitialData,
                }}
              />

              <FormikInput
                name="extra_id"
                {...formikProps}
                inputProps={{
                  label: 'Extra ID',
                  placeholder: 'enter extra id (optional)',
                  disabled: !!defaultInitialData,
                }}
              />
            </KeyboardAvoidingView>

            {!defaultInitialData && (
              <Button
                title="Create"
                containerStyle={styles.processBtn}
                onPress={formikProps.handleSubmit}
                loading={beingAddCard}
              />
            )}
          </Paper>
        </Wrapper>
      )}
    </Formik>
  );
};

export default CryptoPanelScreen;
