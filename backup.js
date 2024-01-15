import React, {useState, useEffect} from 'react';
import {StyleSheet, View, KeyboardAvoidingView, Keyboard} from 'react-native';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {useSelector, useDispatch} from 'react-redux';
import {Formik} from 'formik';
import * as yup from 'yup';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
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
  const insets = useSafeAreaInsets();
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

  const lang = {
    title: 'Card Info',
    cancel: 'Cancel',
    cardNumberLabel: 'Card number',
  };

  const initialValues = {
    number: '',
    cvc: '',
    validUntil: '',
    name: '',
  };

  async function handleSubmit(values, {resetForm}) {
    if (data) {
      dispatch(
        purchasePackage(
          {package_id, card_id: data.id},
          {
            success: () => {
              dispatch(
                showAlert({
                  title: 'Succcess',
                  body: 'Kizuna purchased!',
                  type: 'success',
                }),
              );
              dispatch(getCurrentWallet());
              dispatch(getUserInfo());
              navigation.navigate('BuyKizuna');
            },
          },
        ),
      );
    } else {
      setLoading(true);
      try {
        // const paymentMethod = await stripe.createPaymentMethod({
        //   card: {
        //     number: values.number,
        //     cvc: values.cvc,
        //     expMonth: parseInt(values.validUntil.split('/')[0], 10),
        //     expYear: parseInt(`20${values.validUntil.split('/')[1]}`, 10),
        //   },
        //   billingDetails: {
        //     name: values.name,
        //   },
        // })
        // console.warn('paymentMethod ===========')
        // console.log(paymentMethod)

        const {paymentMethod, error} = await createPaymentMethod({
          // formDetails: {
          //   accountNumber: values.number,
          // },
          // cvc: values.cvc,
          // billingDetails: {
          //   name: values.name,
          // },
          type: 'Card',
        });

        if (error) {
          console.log('error ===================');
          console.log(error);

          return;
        }

        console.log(paymentMethod);

        // const paymentIntent = await stripe.confirmSetupIntent({
        //   paymentMethodId: paymentMethod.id,
        //   clientSecret: client_secret,
        // })
        // console.warn('paymentIntent ============')
        // console.log(paymentIntent)

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
            // body: __DEV__ ? error?.message || error : 'Something went wrong!',
          }),
        );
      } finally {
        setLoading(false);
      }
    }
  }

  function renderCardIcon(number) {
    const ambiguousCards = creditCardType(number);
    const color =
      number &&
      ambiguousCards.length &&
      cardValid.number(number.replace(' ', '')).isValid
        ? theme.colors.primary
        : theme.colors.disabled;
    if (ambiguousCards.length === 1) {
      const cardType = ambiguousCards[0].type;
      const supportedIcons = [
        'visa',
        'mastercard',
        'jcb',
        'american-express',
        'discovery',
        'diners-club',
      ];
      if (supportedIcons.includes(cardType)) {
        return (
          <Fontisto
            size={getSize.f(18)}
            name={cardType}
            color={color}
            style={styles.cardIcon}
          />
        );
      }
    }
    return (
      <Fontisto
        size={getSize.f(18)}
        name="credit-card"
        color={color}
        style={styles.cardIcon}
      />
    );
  }

  function getCardCode(number) {
    const ambiguousCards = creditCardType(number);
    if (ambiguousCards.length > 0) {
      return ambiguousCards[0].code;
    }
    return {name: 'CVV', size: 3};
  }

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
    <Formik
      validateOnChange={false}
      initialValues={initialValues}
      validationSchema={yup.object().shape(
        data
          ? {
              name: yup.string(),
              cvc: yup.string(),
              number: yup.string(),
              validUntil: yup.string(),
            }
          : {
              name: yup.string().required('card holder is a required field'),
              cvc: yup
                .string()
                .test(
                  'test-cvc',
                  'invalid cvc',
                  (value) => value && value.length === getCardCode(value).size,
                )
                .required(),
              number: yup
                .string()
                .test(
                  'test-number',
                  'credit card number is invalid',
                  (value) =>
                    value && cardValid.number(value.replace(' ', '')).isValid,
                )
                .required(),
              validUntil: yup
                .string()
                .test('test-month', 'invalid date', (value) => {
                  if (!value) {
                    return false;
                  }
                  const month = value.split('/')[0];
                  return month > 0 && month < 13;
                })
                .required(),
            },
      )}
      onSubmit={handleSubmit}>
      {(formikProps) => (
        <Wrapper dismissKeyboard style={styles.wrapper}>
          <HeaderBg
            height={HEADER_HEIGHT}
            style={styles.headerBg}
            addSBHeight
          />
          <Text variant="header" style={styles.headerTitle}>
            {lang.title}
          </Text>

          <View style={styles.headerActions}>
            <Touchable onPress={navigation.goBack}>
              <Text style={styles.headerBtn}>{lang.cancel}</Text>
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
              <FormikInput
                name="number"
                {...formikProps}
                inputProps={{
                  label: lang.cardNumberLabel,
                  style: {marginLeft: getSize.w(10)},
                  disabled: data,
                  masked: true,
                  keyboardType: 'numeric',
                  mask: '[0000] [0000] [0000] [0000]',
                  placeholder: data
                    ? `**** **** **** ${data?.['4digit']}`
                    : '**** **** **** ****',
                  leftIcon: renderCardIcon(formikProps.values.number),
                }}
              />
              <FormikInput
                name="validUntil"
                {...formikProps}
                inputProps={{
                  label: 'Valid until',
                  masked: true,
                  keyboardType: 'numeric',
                  mask: '[00]{/}[00]',
                  placeholder: 'MM/YY',
                  disabled: data,
                }}
              />
              <FormikInput
                name="cvc"
                {...formikProps}
                inputProps={{
                  label: getCardCode(formikProps.values.number).name,
                  keyboardType: 'numeric',
                  placeholder: '***',
                  type: 'password',
                  disabled: data,
                }}
              />
              <FormikInput
                name="name"
                {...formikProps}
                inputProps={{
                  label: 'Card holder',
                  placeholder: data?.name
                    ? data?.name.toUpperCase()
                    : 'enter card holder name',
                  autoCapitalize: 'characters',
                  autoCorrect: false,
                  spellCheck: false,
                  disabled: data,
                }}
              />

              <CardForm style={{width: '100%', height: '100%'}} />
            </KeyboardAvoidingView>

            {/* {!keyboardShown && (
              <Button
                title={data ? 'Process to Payment' : 'Create'}
                containerStyle={styles.processBtn}
                onPress={formikProps.handleSubmit}
                loading={beingAddCard || loading || beingPurchase}
              />
            )} */}
            {!keyboardShown && !data && (
              <Button
                title="Create"
                containerStyle={styles.processBtn}
                onPress={formikProps.handleSubmit}
                loading={beingAddCard || loading}
              />
            )}
          </Paper>
        </Wrapper>
      )}
    </Formik>
  );
};

export default PaymentDataScreen;
