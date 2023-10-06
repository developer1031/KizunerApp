import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FastImage from 'react-native-fast-image';
import * as yup from 'yup';
import {Formik} from 'formik';
import {useSelector, useDispatch} from 'react-redux';

import useTheme from 'theme';
import {getSize} from 'utils/responsive';
import {
  Wrapper,
  Paper,
  HeaderBg,
  Text,
  Touchable,
  Input,
  FormikInput,
} from 'components';
import {transferKizuna, showAlert} from 'actions';
import {Icons} from 'utils/icon';

const TransferKizunaScreen = ({navigation}) => {
  const theme = useTheme();
  const HEADER_HEIGHT = 120;
  const {current} = useSelector((state) => state.wallet);
  const [user, setUser] = useState(null);
  const dispatch = useDispatch();

  const styles = StyleSheet.create({
    wrapper: {flex: 1},
    scrollWrap: {marginTop: -getSize.h(60), flex: 1},
    scrollCon: {
      paddingHorizontal: getSize.w(24),
      paddingTop: getSize.h(80),
      paddingBottom: getSize.h(20),
    },
    headerInfo: {
      paddingVertical: getSize.h(22),
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: getStatusBarHeight() + getSize.h(30),
      marginHorizontal: getSize.w(24),
      zIndex: 10,
    },
    backBtn: {
      position: 'absolute',
      top: getStatusBarHeight() + getSize.h(20),
      left: getSize.w(24),
      zIndex: 10,
    },
    sendBtn: {
      position: 'absolute',
      top: getStatusBarHeight() + getSize.h(26),
      right: getSize.w(24),
      zIndex: 10,
    },
    headerTitle: {
      top: getStatusBarHeight() + getSize.h(26),
      textAlign: 'center',
    },
    headerInfoItem: {
      flex: 1,
      paddingHorizontal: getSize.w(24),
      alignItems: 'flex-end',
    },
    balanceKizuna: {
      color: theme.colors.primary,
      fontSize: getSize.f(15),
    },
    incomeKizuna: {
      color: theme.colors.secondary,
      fontSize: getSize.f(15),
    },
    kizunaNumber: {
      fontSize: getSize.f(32),
      fontFamily: theme.fonts.sfPro.bold,
      letterSpacing: 0,
    },
    headerInfoLabel: {
      fontSize: getSize.f(15),
    },
    headerLogo: {
      width: getSize.w(43),
      height: getSize.w(43),
      resizeMode: 'contain',
      marginLeft: getSize.w(24),
    },
    sendBtnTxt: {
      fontSize: getSize.f(17),
      fontFamily: theme.fonts.sfPro.medium,
      color: theme.colors.textContrast,
    },
    formWrap: {
      marginHorizontal: getSize.w(24),
      marginVertical: getSize.h(20),
      paddingHorizontal: getSize.w(24),
      paddingVertical: getSize.h(45),
    },
    disabled: {
      opacity: 0.3,
    },
  });

  return (
    <Formik
      validateOnChange={false}
      initialValues={{
        kizuna: '',
      }}
      validationSchema={yup.object().shape({
        kizuna: yup
          .number()
          .min(10)
          .max(current.balance, 'not enough kizuna')
          .nullable()
          .integer()
          .required(),
      })}
      onSubmit={(values) => {
        if (user) {
          dispatch(
            transferKizuna(
              {user_id: user?.id, amount: values.kizuna},
              {
                success: () => {
                  dispatch(
                    showAlert({
                      type: 'success',
                      title: 'Success',
                      body: 'Kizuna transfered!',
                    }),
                  );
                  navigation.goBack();
                },
              },
            ),
          );
        }
      }}>
      {(formikProps) => (
        <Wrapper style={styles.wrapper}>
          <HeaderBg height={HEADER_HEIGHT} addSBHeight />
          <Touchable onPress={navigation.goBack} style={styles.backBtn}>
            <MaterialCommunityIcons
              name="chevron-left"
              size={getSize.f(34)}
              color={theme.colors.textContrast}
            />
          </Touchable>
          <Text variant="header" style={styles.headerTitle}>
            Transfer Kizuna
          </Text>
          <Touchable
            onPress={formikProps.handleSubmit}
            disabled={!user && styles.disabled}
            style={[styles.sendBtn, !user && styles.disabled]}>
            <Text style={styles.sendBtnTxt}>Send</Text>
          </Touchable>
          <Paper style={styles.headerInfo}>
            <FastImage source={Icons.Logo_color} style={styles.headerLogo} />
            <View style={styles.headerInfoItem}>
              <Text style={styles.headerInfoLabel}>Kizuna Balance</Text>
              <Text numberOfLines={1} style={styles.balanceKizuna}>
                <Text inherit style={styles.kizunaNumber}>
                  {current?.balance || 0}
                </Text>{' '}
                Kizuna
              </Text>
            </View>
          </Paper>
          <Paper style={styles.formWrap}>
            <FormikInput
              name="kizuna"
              {...formikProps}
              inputProps={{
                placeholder: 'enter kizuna amount',
                label: 'Transfering amount',
                keyboardType: 'number-pad',
              }}
            />
            <Input
              placeholder="Select friend"
              label="Friend"
              value={user?.name}
              onPress={() =>
                navigation.navigate('SelectFriendTransfer', {
                  onSend: (selected) => {
                    setUser(selected);
                    navigation.goBack();
                  },
                })
              }
              rightIconProps={{
                icon: 'account',
                color: theme.colors.primary,
                size: getSize.f(24),
              }}
            />
          </Paper>
        </Wrapper>
      )}
    </Formik>
  );
};

export default TransferKizunaScreen;
