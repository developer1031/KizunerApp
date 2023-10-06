import React, {useState, useEffect} from 'react';
import {StyleSheet, View, KeyboardAvoidingView, Keyboard} from 'react-native';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {useSelector, useDispatch} from 'react-redux';
import {Formik} from 'formik';
import * as yup from 'yup';
import {useSafeArea} from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import cardValid from 'card-validator';
import creditCardType from 'credit-card-type';
import {
  createPaymentMethod,
  confirmSetupIntent,
  CardForm,
} from '@stripe/stripe-react-native';
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

import {
  addPaymentCard,
  showAlert,
  purchasePackage,
  getCurrentWallet,
  getUserInfo,
  removePaymentCard,
} from 'actions';

const PaymentDataScreen = ({navigation, route}) => {
  const STATUS_BAR = getStatusBarHeight();
  const {beingAddCard, beingPurchase, beingRemoveCard} = useSelector(
    (state) => state.wallet,
  );
  const HEADER_HEIGHT = 120;
  const theme = useTheme();
  const insets = useSafeArea();
  const dispatch = useDispatch();
  const {client_secret, data, package_id} = route.params;
  const [loading, setLoading] = useState(false);
  const [keyboardShown, setKeyboardShown] = useState(false);

  useEffect(() => {
    const keyboardShowListener = Keyboard.addListener('keyboardDidShow', () =>
      setKeyboardShown(true),
    );
    const keyboardHideListener = Keyboard.addListener('keyboardDidHide', () =>
      setKeyboardShown(false),
    );
    return () => {
      keyboardShowListener.remove();
      keyboardHideListener.remove();
    };
  }, []);

  useEffect(() => {
    console.log(data);
  }, [data]);

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

  const onPressCreate = async () => {
    setLoading(true);
    try {
      const {paymentMethod, error} = await createPaymentMethod({type: 'Card'});

      if (error) {
        dispatch(
          showAlert({
            type: 'error',
            title: 'Error',
            body: error?.message,
          }),
        );

        return;
      }

      // const paymentIntent = await stripe.confirmSetupIntent({
      //   paymentMethodId: paymentMethod.id,
      //   clientSecret: client_secret,
      // })
      // console.warn('paymentIntent ============')
      // console.log(paymentIntent)
      r;
      // confirmSetupIntent(client_secret, {
      // },{paymentMethod: paymentMethod.paymentMethod.id})

      dispatch(
        addPaymentCard(
          {payment_method: paymentMethod.id},
          {
            success: () => {
              dispatch(
                showAlert({
                  title: 'Success',
                  body: 'Card added!',
                  type: 'success',
                }),
              );
              navigation.goBack();
            },
          },
        ),
      );
    } catch (error) {
      console.log(error);
      dispatch(
        showAlert({
          type: 'error',
          title: 'Error',
          body: error?.message || error,
        }),
      );
    } finally {
      setLoading(false);
    }
  };

  function handleDeleteCard() {
    dispatch(
      removePaymentCard(data.id, {
        success: () => {
          dispatch(
            showAlert({
              title: 'Success',
              type: 'success',
              body: 'Card removed!',
            }),
          );
          navigation.goBack();
        },
      }),
    );
  }

  return (
    <Wrapper dismissKeyboard style={styles.wrapper}>
      <HeaderBg height={HEADER_HEIGHT} style={styles.headerBg} addSBHeight />
      <Text variant="header" style={styles.headerTitle}>
        Card Info
      </Text>

      <View style={styles.headerActions}>
        <Touchable onPress={navigation.goBack}>
          <Text style={styles.headerBtn}>Cancel</Text>
        </Touchable>
        {data &&
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
          <CardForm
            style={{width: '100%', height: '100%'}}
            placeholders={{
              number: '4242424242424242',
              cvc: '456',
            }}
          />
        </KeyboardAvoidingView>

        {!keyboardShown && !data && (
          <Button
            title="Create"
            containerStyle={styles.processBtn}
            onPress={onPressCreate}
            loading={beingAddCard || loading}
          />
        )}
      </Paper>
    </Wrapper>
  );
};

export default PaymentDataScreen;
