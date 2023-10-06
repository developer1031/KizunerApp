import React, {useState, useEffect} from 'react';
import {View, Animated, StyleSheet, Easing, Platform} from 'react-native';
import {ShadowBox} from 'react-native-neomorph-shadows';

import {getSize} from 'utils/responsive';
import useTheme from 'theme';

import orangeLight from '../theme/orangeLight';

const UserMarker = () => {
  const [animated] = useState(new Animated.Value(0));
  const theme = useTheme();

  const cycleAnimation = () => {
    Animated.sequence([
      Animated.timing(animated, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        delay: 1500,
      }),
      Animated.timing(animated, {
        toValue: 0,
        duration: 0,
      }),
    ]).start(() => {
      cycleAnimation();
    });
  };

  useEffect(() => {
    cycleAnimation();
  }, []);

  const sizeInterpolate = animated.interpolate({
    inputRange: [0, 1],
    outputRange: [getSize.h(0), getSize.h(120)],
  });

  const opacityInterpolate = animated.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  const bgInterpolate = animated.interpolate({
    inputRange: [0, 1],
    outputRange: [
      theme.colors.userMarkerOverlay1,
      theme.colors.userMarkerOverlay2,
    ],
  });

  const animatedStyle = {
    width: sizeInterpolate,
    height: sizeInterpolate,
    borderRadius: sizeInterpolate,
    opacity: opacityInterpolate,
    backgroundColor: bgInterpolate,
  };

  return (
    <View style={styles.container}>
      <ShadowBox style={styles.circle}>
        <View style={styles.circleInner}>
          <Animated.View style={[styles.animatedCircle, animatedStyle]} />
        </View>
      </ShadowBox>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: getSize.h(120),
    height: getSize.h(120),
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    width: getSize.h(23),
    height: getSize.h(23),
    backgroundColor: orangeLight.colors.paper,
    borderRadius: getSize.h(23 / 2),
    ...orangeLight.shadow.small.ios,
    shadowOpacity: Platform.OS === 'ios' ? 1 : 0.2,
  },
  circleInner: {
    width: getSize.h(17),
    height: getSize.h(17),
    borderRadius: getSize.h(17 / 2),
    margin: getSize.h(3),
    backgroundColor: orangeLight.colors.primary,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  animatedCircle: {
    backgroundColor: 'transparent',
    width: 0,
    height: 0,
    borderRadius: 5,
    borderWidth: 1,
    alignSelf: 'center',
    borderColor: orangeLight.colors.primary,
  },
});

export default UserMarker;
