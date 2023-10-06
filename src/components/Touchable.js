import React from 'react';
import {TouchableOpacity, Animated} from 'react-native';
import TouchableScale from 'react-native-touchable-scale';

const Touchable = ({scalable, slop, animated, ...props}) => {
  if (scalable) {
    return (
      <TouchableScale activeScale={0.97} tension={50} friction={5} {...props} />
    );
  }

  const Component = animated
    ? Animated.createAnimatedComponent(TouchableOpacity)
    : TouchableOpacity;
  return (
    <Component
      hitSlop={slop ? {top: 15, left: 15, right: 15, bottom: 15} : undefined}
      activeOpacity={0.7}
      {...props}
    />
  );
};

export default Touchable;
