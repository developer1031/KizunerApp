import React from 'react';
import {StyleSheet, Dimensions, Animated} from 'react-native';
import Video from 'react-native-video';
import LinearGradient from 'react-native-linear-gradient';
import FastImage from 'react-native-fast-image';
import {getStatusBarHeight} from 'react-native-status-bar-height';

import useTheme from 'theme';
import {getSize} from 'utils/responsive';
import {Touchable} from 'components';

const {width} = Dimensions.get('window');

const AnimatedLG = Animated.createAnimatedComponent(LinearGradient);
const AnimatedFI = Animated.createAnimatedComponent(FastImage);

const HeaderBg = ({
  image,
  video,
  height,
  noBorder,
  style,
  overlayStyle,
  animatedStyle,
  onPress,
  addSBHeight,
}) => {
  const theme = useTheme();

  const HEIGHT = addSBHeight
    ? getSize.h(height || 611) + getStatusBarHeight()
    : getSize.h(height || 611);

  const styles = StyleSheet.create({
    background: {
      position: 'absolute',
      top: 0,
      width,
      height: HEIGHT,
      borderBottomLeftRadius: noBorder ? 0 : getSize.h(30),
      borderBottomRightRadius: noBorder ? 0 : getSize.h(30),
      borderColor: theme.colors.primary,
      borderWidth: 0,
    },
    overlay: {
      backgroundColor: theme.colors.bgOverlay,
    },
  });

  return (
    <>
      <AnimatedLG
        colors={theme.colors.gradient}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={[styles.background, style, animatedStyle]}
      />
      <AnimatedFI
        source={image}
        resizeMode="cover"
        style={[styles.background, style, animatedStyle]}
      />
      {video && (
        <Video
          source={video}
          style={[styles.background, style]}
          resizeMode="cover"
          muted
          onError={(err) => console.log(err)}
          repeat
        />
      )}
      <Touchable
        onPress={onPress}
        style={[styles.background, styles.overlay, overlayStyle]}
      />
    </>
  );
};

export default HeaderBg;
