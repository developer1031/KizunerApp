import React, {useEffect, useState} from 'react';
import {Animated, Easing} from 'react-native';

export const Fade = ({visible, style, children, ...props}) => {
  const [visibility, setSisibility] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(visibility, {
      toValue: visible ? 1 : 0,
      duration: 300,
      easing: Easing.linear,
    }).start(() => {
      setSisibility(new Animated.Value(visible));
    });
  }, [visible]);

  const containerStyle = {
    opacity: visibility.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    }),
    transform: [
      {
        scale: visibility.interpolate({
          inputRange: [0, 1],
          outputRange: [1.1, 1],
        }),
      },
    ],
  };

  const combinedStyle = [containerStyle, style];

  return (
    <Animated.View style={visible ? combinedStyle : containerStyle} {...props}>
      {children}
    </Animated.View>
  );
};
