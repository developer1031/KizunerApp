import React, {useEffect, useState} from 'react';
import {StyleSheet, Animated, View, RefreshControl} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FastImage from 'react-native-fast-image';
import {useSelector, useDispatch} from 'react-redux';

import useTheme from 'theme';
import {getSize} from 'utils/responsive';
import {
  Wrapper,
  Paper,
  HeaderBg,
  Text,
  Touchable,
  EmptyState,
} from 'components';
import {getKizunaPackages} from 'actions';
import orangeLight from '../../theme/orangeLight';
import {Icons} from 'utils/icon';
const HEADER_HEIGHT = 120;
const BuyKizunaScreen = ({navigation}) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [scrollAnim] = useState(new Animated.Value(0));
  const {packages, beingLoadPackages, current} = useSelector(
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
    headerInfo: {
      paddingVertical: getSize.h(22),
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: insets.top + getSize.h(30),
      marginBottom: getSize.h(20),
      zIndex: 10,
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
    headerInfoItem: {
      flex: 1,
      paddingHorizontal: getSize.w(24),
      alignItems: 'flex-end',
    },
    balanceKizuna: {
      color: orangeLight.colors.primary,
      fontSize: getSize.f(15),
    },
    incomeKizuna: {
      color: orangeLight.colors.secondary,
      fontSize: getSize.f(15),
    },
    kizunaNumber: {
      fontSize: getSize.f(32),
      fontFamily: orangeLight.fonts.sfPro.bold,
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
    priceItem: {
      paddingHorizontal: getSize.w(24),
      paddingVertical: getSize.h(30),
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: getSize.h(20),
      ...orangeLight.shadow.small.ios,
      ...orangeLight.shadow.small.android,
      backgroundColor: 'white',
    },
    priceItemKizuna: {
      fontSize: getSize.f(18),
      fontFamily: orangeLight.fonts.sfPro.bold,
      color: orangeLight.colors.primary,
    },
    priceItemPrice: {
      fontSize: getSize.f(18),
      color: orangeLight.colors.text2,
    },
    priceItemBold: {
      fontSize: getSize.f(18),
      fontFamily: orangeLight.fonts.sfPro.bold,
      color: orangeLight.colors.tagTxt,
    },
    buyNowBtn: {
      backgroundColor: orangeLight.colors.primary,
      height: getSize.h(38),
      borderRadius: getSize.h(38 / 2),
      paddingHorizontal: getSize.w(20),
      justifyContent: 'center',
      alignItems: 'center',
    },
    buyNowTxt: {
      fontFamily: orangeLight.fonts.sfPro.medium,
      color: orangeLight.colors.textContrast,
    },
  });

  useEffect(() => {
    dispatch(getKizunaPackages());
  }, []);

  function renderPriceItem({item}) {
    return (
      <Paper style={styles.priceItem}>
        <View>
          <Text style={styles.priceItemKizuna}>{item.point} Kizuna</Text>
          <Text style={styles.priceItemPrice}>
            for only <Text style={styles.priceItemBold}>${item.price} USD</Text>
          </Text>
        </View>
        <Touchable
          onPress={() =>
            navigation.navigate('PaymentMethod', {package_id: item.id})
          }
          scalable
          style={styles.buyNowBtn}>
          <Text style={styles.buyNowTxt}>Buy Now</Text>
        </Touchable>
      </Paper>
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
        Get Kizuna
      </Text>
      <Animated.FlatList
        data={packages}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollAnim}}}],
          {useNativeDriver: false},
        )}
        style={styles.scrollWrap}
        ListHeaderComponent={
          <Paper style={styles.headerInfo}>
            <FastImage source={Icons.Logo} style={styles.headerLogo} />
            <View style={styles.headerInfoItem}>
              <Text style={styles.headerInfoLabel}>Kizuna Balance</Text>
              <Text numberOfLines={1} style={styles.balanceKizuna}>
                <Text inherit style={styles.kizunaNumber}>
                  {current?.balance}
                </Text>{' '}
                Kizuna
              </Text>
            </View>
          </Paper>
        }
        contentContainerStyle={styles.scrollCon}
        showsVerticalScrollIndicator={false}
        keyExtractor={(i) => i.id}
        renderItem={renderPriceItem}
        ListEmptyComponent={<EmptyState label="No package available" />}
        refreshControl={
          <RefreshControl
            colors={theme.colors.gradient}
            tintColor={theme.colors.primary}
            progressViewOffset={insets.top}
            onRefresh={() => dispatch(getKizunaPackages())}
            refreshing={beingLoadPackages}
          />
        }
      />
    </Wrapper>
  );
};

export default BuyKizunaScreen;
