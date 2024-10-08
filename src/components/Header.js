import React from 'react';
import {View, StyleSheet, Animated} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import FastImage from 'react-native-fast-image';

import HeaderBg from './HeaderBg';
import {getSize} from 'utils/responsive';
import Text from './Text';
import {Icons} from 'utils/icon';

const Header = ({
  leftComponent,
  rightComponent,
  wrapperStyle,
  animatedStyle,
  bgAnimatedStyle,
  ...props
}) => {
  const insets = useSafeAreaInsets();

  const minHeight = insets.top + getSize.h(45);
  const height = props.height < minHeight ? props.height : minHeight;

  const styles = StyleSheet.create({
    container: {
      paddingHorizontal: getSize.w(24),
      flexDirection: 'row',
      height: minHeight,
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
  });

  return (
    <View style={wrapperStyle}>
      <HeaderBg animatedStyle={bgAnimatedStyle} {...props} />
      <Animated.View style={[styles.container, animatedStyle]}>
        <View style={styles.logoWrap}>
          <FastImage source={Icons.Logo} style={styles.logo} />
          <Text variant="logo">Kizuner</Text>
        </View>
        {rightComponent}
      </Animated.View>
    </View>
  );
};

export default Header;
