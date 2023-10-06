import React from 'react';
import {StyleSheet, Dimensions} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {ShadowBox} from 'react-native-neomorph-shadows';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';

import {getSize} from 'utils/responsive';
import {Touchable, SearchBar} from 'components';
import orangeLight from '../theme/orangeLight';

const width = Dimensions.get('window').width;
const HEADER_HEIGHT = getSize.h(70) + getStatusBarHeight();

const HeaderSearch = ({placeholder}) => {
  const navigation = useNavigation();

  return (
    <ShadowBox style={styles.wrapper}>
      <LinearGradient
        colors={orangeLight.colors.gradient}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={styles.container}>
        <Touchable onPress={navigation.goBack} style={styles.backBtn}>
          <MaterialCommunityIcons
            name="chevron-left"
            size={getSize.f(30)}
            color={orangeLight.colors.textContrast}
          />
        </Touchable>
        <SearchBar
          autoFocus={false}
          placeholder={placeholder || 'Search'}
          onPress={() => navigation.navigate('Search')}
          wrapperStyle={styles.searchWrap}
        />
      </LinearGradient>
    </ShadowBox>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    height: HEADER_HEIGHT,
    borderBottomLeftRadius: getSize.h(30),
    borderBottomRightRadius: getSize.h(30),
    width,
    zIndex: 2,
    ...orangeLight.shadow.large.ios,
  },
  container: {
    height: HEADER_HEIGHT,
    paddingTop: getStatusBarHeight() + getSize.h(5),
    paddingHorizontal: getSize.w(24),
    borderBottomLeftRadius: getSize.h(30),
    borderBottomRightRadius: getSize.h(30),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  searchWrap: {
    width: width - getSize.w(48 + 40),
  },
  backBtn: {
    width: 40,
    left: -getSize.w(8),
    top: -getSize.h(3),
  },
});

export default HeaderSearch;
