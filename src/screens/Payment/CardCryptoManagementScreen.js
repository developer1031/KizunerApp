import React, {useEffect, useState} from 'react';
import {StyleSheet, View, RefreshControl, Animated} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSelector, useDispatch} from 'react-redux';

import useTheme from 'theme';
import {getSize} from 'utils/responsive';
import {
  Wrapper,
  Paper,
  HeaderBg,
  Text,
  Touchable,
  Loading,
  CreditCardIcon,
} from 'components';
import {
  getPaymentCards,
  getCardPaymentSecret,
  getPaymentCryptoCards,
} from 'actions';

const CardCryptoManagementScreen = ({navigation, route}) => {
  const theme = useTheme();
  const HEADER_HEIGHT = 120;
  const dispatch = useDispatch();
  const [scrollAnim] = useState(new Animated.Value(0));
  const {cryptoCards, beingLoadCards, beingLoadPaymentSecret} = useSelector(
    (state) => state.wallet,
  );
  const insets = useSafeAreaInsets();

  const styles = StyleSheet.create({
    wrapper: {flex: 1},
    scrollWrap: {flex: 1},
    scrollCon: {
      paddingHorizontal: getSize.w(24),
      paddingBottom: getSize.h(20),
    },
    headerInfoWrap: {
      marginTop: insets.top + getSize.h(30),
      marginBottom: getSize.h(20),
      zIndex: 10,
    },
    headerInfo: {
      height: getSize.h(109),
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: getSize.w(24),
      justifyContent: 'flex-start',
    },
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
    addCardTxt: {
      fontSize: getSize.f(17),
      color: theme.colors.primary,
      fontFamily: theme.fonts.sfPro.medium,
      marginLeft: getSize.w(18),
    },
    cardItem: {
      paddingHorizontal: getSize.w(24),
      height: getSize.h(109),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    cardItemWrap: {
      marginBottom: getSize.h(20),
      // ...theme.shadow.small.ios,
      // ...theme.shadow.small.android,
      // backgroundColor: theme.colors.paper,
    },
    cardItemKizuna: {
      fontSize: getSize.f(18),
      fontFamily: theme.fonts.sfPro.bold,
      color: theme.colors.primary,
    },
    cardItemNumber: {
      fontSize: getSize.f(15),
      color: theme.colors.text2,
    },
    cardItemBrand: {
      fontSize: getSize.f(17),
      fontFamily: theme.fonts.sfPro.medium,
      color: theme.colors.tagTxt,
      textTransform: 'uppercase',
      marginBottom: getSize.h(8),
    },
    cardIcon: {
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.colors.divider,
      width: getSize.h(65),
      height: getSize.h(65),
      borderRadius: getSize.h(65 / 2),
    },
    buyNowBtn: {
      backgroundColor: theme.colors.primary,
      height: getSize.h(38),
      borderRadius: getSize.h(38 / 2),
      paddingHorizontal: getSize.w(20),
      justifyContent: 'center',
      alignItems: 'center',
    },
    buyNowTxt: {
      fontFamily: theme.fonts.sfPro.medium,
      color: theme.colors.textContrast,
    },
    cardItemMeta: {
      marginLeft: getSize.w(15),
    },
    cardItemRight: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
      marginRight: 15,
    },
  });

  function renderCardItem({item}) {
    return (
      <Touchable
        scalable
        onPress={() => navigation.navigate('PaymentCryptoPanel', {data: item})}
        style={styles.cardItemWrap}>
        <Paper style={styles.cardItem}>
          <View style={styles.cardItemRight}>
            <View style={styles.cardItemMeta}>
              <Text style={styles.cardItemBrand}>{item.currency}</Text>
              <Text style={styles.cardItemNumber} numberOfLines={1}>
                {item.wallet_address}
              </Text>
            </View>
          </View>
          <MaterialCommunityIcons
            name="chevron-right"
            size={getSize.f(24)}
            color={theme.colors.text}
          />
        </Paper>
      </Touchable>
    );
  }

  const headerOpacity = scrollAnim.interpolate({
    inputRange: [0, insets.top + getSize.h(100)],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  return (
    <Wrapper style={styles.wrapper}>
      <HeaderBg height={HEADER_HEIGHT} addSBHeight />
      <Touchable
        animated
        onPress={navigation.goBack}
        style={[styles.backBtn, {opacity: headerOpacity}]}>
        <MaterialCommunityIcons
          name="chevron-left"
          size={getSize.f(34)}
          color={theme.colors.textContrast}
        />
      </Touchable>
      <Text
        animated
        variant="header"
        style={[styles.headerTitle, {opacity: headerOpacity}]}>
        Crypto Address
      </Text>
      <Animated.FlatList
        data={cryptoCards}
        style={styles.scrollWrap}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollAnim}}}],
          {useNativeDriver: true},
        )}
        ListHeaderComponent={
          <Touchable
            scalable
            onPress={() => {
              navigation.navigate('PaymentCryptoPanel');
            }}
            style={styles.headerInfoWrap}>
            <Paper style={styles.headerInfo}>
              <MaterialCommunityIcons
                name="plus-circle"
                color={theme.colors.primary}
                size={getSize.f(36)}
              />
              <Text style={styles.addCardTxt}>Add New Coin</Text>
            </Paper>
          </Touchable>
        }
        contentContainerStyle={styles.scrollCon}
        showsVerticalScrollIndicator={false}
        keyExtractor={(i) => i.id}
        renderItem={renderCardItem}
        refreshControl={
          <RefreshControl
            colors={theme.colors.gradient}
            tintColor={theme.colors.primary}
            progressViewOffset={insets.top}
            onRefresh={() => dispatch(getPaymentCryptoCards())}
            refreshing={beingLoadCards}
          />
        }
      />
    </Wrapper>
  );
};

export default CardCryptoManagementScreen;
