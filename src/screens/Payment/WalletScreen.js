import React, {useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {CONTACT_US} from 'utils/constants';
import useTheme from 'theme';
import {getSize} from 'utils/responsive';
import {Wrapper, Text, Touchable} from 'components';
import {WebView} from 'react-native-webview';
import LinearGradient from 'react-native-linear-gradient';
import {useSelector, useDispatch} from 'react-redux';
import {connectStripe, getUserInfo} from 'actions';
import {ScrollView} from 'react-native';
import {View} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {getWalletStripeStatus} from 'actions';
import {num_delimiter} from 'utils/util';

const WalletScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const walletState = useSelector((state) => state.wallet);
  const {stripeStatusResponse} = walletState;
  const {amount, status, currency} = stripeStatusResponse;

  const statusLabel =
    status === 'CONNECTED'
      ? 'Connected'
      : status === 'PENDING'
      ? 'Pending'
      : '';
  const isStripeConnected = status === 'CONNECTED';
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const HEADER_HEIGHT = 68 + insets.top;

  useEffect(() => {
    dispatch(getWalletStripeStatus());
  }, []);

  const styles = StyleSheet.create({
    wrapper: {flex: 1},
    backBtn: {
      position: 'absolute',
      top: insets.top + getSize.h(20),
      left: getSize.w(24),
      zIndex: 10,
    },
    headerTitle: {
      top: insets.top + getSize.h(26),
      textAlign: 'center',
    },
    menuItemWrap: {
      paddingHorizontal: getSize.h(24),
    },
    menuItemContainer: {
      borderBottomColor: theme.colors.divider,
      borderBottomWidth: getSize.h(1),
      minHeight: getSize.h(64),
      flexDirection: 'row',
      alignItems: 'center',
      paddingRight: getSize.h(12),
    },
    menuItemWrapLabel: {
      fontSize: getSize.f(15),
      color: theme.colors.tagTxt,
      fontFamily: theme.fonts.sfPro.medium,
    },
    menuItemLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    menuItemIcon: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: getSize.w(19),
      width: getSize.w(24),
    },
  });

  const labelConnection = 'Stripe Connection';
  const MENU_ITEMS = [
    {
      icon: (
        <FontAwesome
          name="credit-card-alt"
          color={theme.colors.primary}
          size={getSize.f(22)}
        />
      ),
      label: 'Credit Card Management',
      onPress: () => navigation.navigate('PaymentCreditCardManagement'),
    },
    {
      icon: (
        <FontAwesome
          name="bitcoin"
          color={theme.colors.primary}
          size={getSize.f(22)}
        />
      ),
      label: 'Crypto Card Management',
      onPress: () => navigation.navigate('PaymentCryptoCardManagement'),
    },
    // secretKeyThinh
    {
      icon: (
        <MaterialCommunityIcons
          name="transit-connection-variant"
          color={theme.colors.primary}
          size={getSize.f(22)}
        />
      ),
      label: labelConnection,
      onPress: () => navigation.navigate('PaymentConnectStripe'),
    },
  ];

  return (
    <Wrapper style={styles.wrapper}>
      <LinearGradient
        style={{height: HEADER_HEIGHT}}
        colors={theme.colors.gradient}
        start={{x: 0, y: 1}}
        end={{x: 1, y: 1}}>
        <Touchable onPress={navigation.goBack} style={styles.backBtn}>
          <MaterialCommunityIcons
            name="chevron-left"
            size={getSize.f(34)}
            color={theme.colors.textContrast}
          />
        </Touchable>

        <Text variant="header" style={styles.headerTitle}>
          Wallet
        </Text>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false}>
        {MENU_ITEMS.map((item) => {
          return (
            <Touchable
              onPress={item.onPress}
              key={item.label}
              style={styles.menuItemWrap}>
              <View style={styles.menuItemContainer}>
                <View style={styles.menuItemLeft}>
                  {item.icon && (
                    <View style={styles.menuItemIcon}>{item.icon}</View>
                  )}
                  <View style={{flex: 1}}>
                    <Text style={styles.menuItemWrapLabel}>
                      {item.label}{' '}
                      <Text style={{color: 'green'}}>
                        {item.label === labelConnection &&
                          statusLabel != '' &&
                          `(${statusLabel})`}
                      </Text>
                    </Text>

                    {item.label === labelConnection && isStripeConnected && (
                      <>
                        <Text variant="headerBlack">
                          {currency == 'jpy' ? '￥' : '$'}
                          {num_delimiter(amount)}
                        </Text>
                        <Text
                          variant="caption"
                          style={{fontSize: getSize.w(11)}}>
                          • Expires 120 days after receipt of sales.
                        </Text>
                      </>
                    )}
                  </View>
                </View>

                <MaterialCommunityIcons
                  name="chevron-right"
                  color={theme.colors.text}
                  size={getSize.f(24)}
                />
              </View>
            </Touchable>
          );
        })}
      </ScrollView>
    </Wrapper>
  );
};

export default WalletScreen;
