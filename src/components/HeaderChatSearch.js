import React from 'react';
import {View, StyleSheet, Animated} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import HeaderBg from './HeaderBg';
import {getSize} from 'utils/responsive';
import SearchBar from './SearchBar';
import orangeLight from '../theme/orangeLight';

const HeaderChatSearch = ({
  leftComponent,
  rightComponent,
  wrapperStyle,
  animatedStyle,
  bgAnimatedStyle,
  placeholder,
  ...props
}) => {
  const insets = useSafeAreaInsets();

  const styles = StyleSheet.create({
    container: {
      paddingHorizontal: getSize.w(24),
      flexDirection: 'row',
      height: insets.top + getSize.h(35),
      paddingTop: insets.top + getSize.h(16),
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    logoWrap: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    logo: {
      width: getSize.h(30),
      height: getSize.h(30),
      resizeMode: 'contain',
      marginRight: getSize.w(10),
    },
    searchWrap: {
      width: '100%',
    },
  });

  return (
    <View style={wrapperStyle}>
      <HeaderBg animatedStyle={bgAnimatedStyle} {...props} />
      <Animated.View style={[styles.container, animatedStyle]}>
        <SearchBar
          autoFocus={false}
          placeholder={placeholder || 'Search'}
          wrapperStyle={styles.searchWrap}
          colorIconSearch={orangeLight.colors.primary}
          sizeIconSearch={getSize.w(20)}
        />
      </Animated.View>
    </View>
  );
};

export default HeaderChatSearch;
