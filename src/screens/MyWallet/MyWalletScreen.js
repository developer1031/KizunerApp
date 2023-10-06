import React, {useRef, useEffect} from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  RefreshControl,
  Platform,
} from 'react-native';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch, useSelector} from 'react-redux';

import useTheme from 'theme';
import {getSize} from 'utils/responsive';
import {Wrapper, Paper, HeaderBg, Text, Touchable} from 'components';
import {getCurrentWallet} from 'actions';

const MyWalletScreen = ({navigation}) => {
  const theme = useTheme();
  const HEADER_HEIGHT = 120;
  const listRef = useRef(null);
  const dispatch = useDispatch();
  const {current, loading} = useSelector((state) => state.wallet);
  const userInfo = useSelector((state) => state.auth.userInfo);

  useEffect(() => {
    dispatch(getCurrentWallet());
    listRef?.current.scrollTo({
      y: -getStatusBarHeight() - getSize.h(30),
    });
  }, []);

  const styles = StyleSheet.create({
    wrapper: {flex: 1},
    scrollWrap: {flex: 1},
    scrollCon: {
      paddingHorizontal: getSize.w(24),
    },
    headerInfoWrap: {
      paddingVertical: getSize.h(22),
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: getSize.h(20),
      marginTop:
        Platform.OS === 'android' ? getStatusBarHeight() + getSize.h(30) : 0,
    },
    backBtn: {
      position: 'absolute',
      top: getStatusBarHeight() + getSize.h(20),
      left: getSize.w(24),
      zIndex: 10,
    },
    headerTitle: {
      top: getStatusBarHeight() + getSize.h(26),
      textAlign: 'center',
    },
    menuItemWrap: {
      borderBottomColor: theme.colors.divider,
      borderBottomWidth: getSize.h(1),
      height: getSize.h(64),
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
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
    headerInfoItem: {
      flex: 1,
      paddingHorizontal: getSize.w(20),
    },
    headerInfoDivider: {
      width: 1,
      height: getSize.h(64),
      backgroundColor: theme.colors.divider,
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
  });

  const MENU_ITEMS = [
    {
      icon: (
        <MaterialCommunityIcons
          name="credit-card"
          color={theme.colors.primary}
          size={getSize.f(22)}
        />
      ),
      label: 'Get Kizuna',
      onPress: () => navigation.navigate('BuyKizuna'),
    },
    {
      icon: (
        <MaterialCommunityIcons
          name="wallet-giftcard"
          color={theme.colors.primary}
          size={getSize.f(22)}
        />
      ),
      label: 'Transfer Kizuna',
      onPress: () => navigation.navigate('TransferKizuna'),
    },
    {
      icon: (
        <MaterialCommunityIcons
          name="history"
          color={theme.colors.primary}
          size={getSize.f(22)}
        />
      ),
      label: 'Transaction History',
      onPress: () => navigation.navigate('TransactionHistory'),
    },
  ];

  return (
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
        My Wallet
      </Text>
      <ScrollView
        ref={listRef}
        style={styles.scrollWrap}
        contentInset={{top: getStatusBarHeight() + getSize.h(30)}}
        contentContainerStyle={styles.scrollCon}
        refreshControl={
          <RefreshControl
            colors={theme.colors.gradient}
            tintColor={theme.colors.primary}
            progressViewOffset={getStatusBarHeight()}
            onRefresh={() => dispatch(getCurrentWallet())}
            refreshing={loading}
          />
        }
        showsVerticalScrollIndicator={false}>
        <Paper style={styles.headerInfoWrap}>
          <View style={styles.headerInfoItem}>
            <Text style={styles.headerInfoLabel}>Kizuna Balance</Text>
            <Text numberOfLines={1} style={styles.balanceKizuna}>
              <Text inherit style={styles.kizunaNumber}>
                {current?.balance || userInfo?.kizuna || 0}
              </Text>{' '}
              Kizuna
            </Text>
          </View>
          <View style={styles.headerInfoDivider} />
          <View style={styles.headerInfoItem}>
            <Text style={styles.headerInfoLabel}>Today Income</Text>
            <Text numberOfLines={1} style={styles.incomeKizuna}>
              <Text inherit style={styles.kizunaNumber}>
                {current?.today}
              </Text>{' '}
              Kizuna
            </Text>
          </View>
        </Paper>
        {MENU_ITEMS.map((item) => (
          <Touchable
            onPress={item.onPress}
            key={item.label}
            style={styles.menuItemWrap}>
            <View style={styles.menuItemLeft}>
              {item.icon && (
                <View style={styles.menuItemIcon}>{item.icon}</View>
              )}
              <Text style={styles.menuItemWrapLabel}>{item.label}</Text>
            </View>
            <MaterialCommunityIcons
              name="chevron-right"
              color={theme.colors.text}
              size={getSize.f(24)}
            />
          </Touchable>
        ))}
      </ScrollView>
    </Wrapper>
  );
};

export default MyWalletScreen;
