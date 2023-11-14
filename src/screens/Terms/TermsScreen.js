import React, {useEffect} from 'react';
import {
  StyleSheet,
  Image,
  ScrollView,
  View,
  RefreshControl,
} from 'react-native';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';
import HTML from 'react-native-render-html';
import {Placeholder, PlaceholderLine, Fade} from 'rn-placeholder';

import useTheme from 'theme';
import {getSize} from 'utils/responsive';
import {
  Wrapper,
  Paper,
  HeaderBg,
  Text,
  Touchable,
  AppVersion,
} from 'components';
import {getConfigs} from 'actions';
import {Icons} from 'utils/icon';

const TermsScreen = ({navigation}) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const data = useSelector((state) => state.app.termData);
  const loading = useSelector((state) => state.app.configLoading);
  const HEADER_HEIGHT = 120;

  useEffect(() => {
    dispatch(getConfigs());
  }, []);

  const styles = StyleSheet.create({
    wrapper: {flex: 1},
    scrollWrap: {flex: 1},
    scrollCon: {
      paddingTop: getSize.h(20),
      paddingBottom: getSize.h(20) + insets.bottom,
      paddingHorizontal: getSize.w(24),
    },
    headerInfo: {
      paddingVertical: getSize.h(30),
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: getStatusBarHeight() + getSize.h(30),
      paddingHorizontal: getSize.w(24),
      marginHorizontal: getSize.w(24),
    },
    headerLogo: {
      width: getSize.h(43),
      height: getSize.h(43),
      resizeMode: 'contain',
    },
    headerRight: {
      marginLeft: getSize.w(20),
    },
    headerAppName: {
      fontFamily: theme.fonts.sfPro.medium,
      fontSize: getSize.f(18),
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
  });

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
        Terms & Conditions
      </Text>
      <Paper style={styles.headerInfo}>
        <Image source={Icons.Logo_color} style={styles.headerLogo} />
        <View style={styles.headerRight}>
          <Text style={styles.headerAppName}>Kizuner App</Text>
          <AppVersion />
        </View>
      </Paper>
      <ScrollView
        style={styles.scrollWrap}
        contentContainerStyle={styles.scrollCon}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            colors={theme.colors.gradient}
            tintColor={theme.colors.primary}
            onRefresh={() => dispatch(getConfigs())}
          />
        }
        showsVerticalScrollIndicator={false}>
        {!loading || data ? (
          <HTML
            html={`<p>${data}</p>`}
            tagsStyles={{
              p: {
                fontSize: getSize.f(15),
                color: theme.colors.tagTxt,
                marginBottom: getSize.h(10),
                fontFamily: theme.fonts.sfPro.regular,
                lineHeight: getSize.f(23),
              },
              b: {
                lineHeight: getSize.f(23),
                fontSize: getSize.f(15),
                fontFamily: theme.fonts.sfPro.medium,
                marginBottom: getSize.h(10),
              },
            }}
          />
        ) : (
          <Placeholder Animation={Fade}>
            <PlaceholderLine width={90} />
            <PlaceholderLine width={50} />
            <PlaceholderLine width={80} />
            <PlaceholderLine width={70} />
            <PlaceholderLine width={30} />
            <PlaceholderLine width={100} />
          </Placeholder>
        )}
      </ScrollView>
    </Wrapper>
  );
};

export default TermsScreen;
