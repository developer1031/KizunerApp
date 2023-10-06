import React from 'react';
import {View, StyleSheet, Animated} from 'react-native';

import {getSize} from 'utils/responsive';
import theme from '../theme/orangeLight';

const Paper = ({style, animated, noBorder, noShadow, ...props}) => {
  const styles = StyleSheet.create({
    wrapper: {
      borderRadius: !noBorder ? getSize.h(30) : 0,
      backgroundColor: theme.colors.paper,
      minHeight: getSize.h(50),
      minWidth: getSize.w(50),
    },
  });

  const Component = animated ? Animated.View : View;

  return (
    <Component
      style={[
        styles.wrapper,
        !noShadow && theme.shadow.large.ios,
        !noShadow && theme.shadow.large.android,
        style,
      ]}
      {...props}
    />
  );
};

export default Paper;
