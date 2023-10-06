import React from 'react';

import {Text as RNText, StyleSheet, Animated} from 'react-native';

import useTheme from '../theme';
import {getSize} from '../utils/responsive';

const Text = ({variant, style, color, inherit, animated, ...props}) => {
  const theme = useTheme();

  const styles = StyleSheet.create({
    default: {
      color: inherit ? undefined : theme.colors.text,
      fontSize: getSize.f(14),
      fontFamily: theme.fonts.sfPro.regular,
      letterSpacing: 0.34,
    },
    text1: {
      color: theme.colors.text1,
    },
    caption: {
      color: theme.colors.text2,
    },
    header: {
      color: theme.colors.textContrast,
      fontSize: getSize.f(17),
      fontFamily: theme.fonts.sfPro.bold,
      textTransform: 'uppercase',
      letterSpacing: 1,
      marginBottom: getSize.h(20),
    },
    headerBlack: {
      fontSize: getSize.f(16),
      fontFamily: theme.fonts.sfPro.bold,
      letterSpacing: 1,
      marginBottom: getSize.h(4),
    },
    inputLabel: {
      color: theme.colors.inputLabel,
    },
    button: {
      color: theme.colors.textContrast,
      fontFamily: theme.fonts.sfPro.medium,
      letterSpacing: 1,
      fontSize: getSize.f(16),
    },
    errorHelper: {
      fontSize: getSize.f(12),
      color: theme.colors.error,
    },
    logo: {
      fontSize: getSize.f(24),
      color: theme.colors.textContrast,
      fontFamily: theme.fonts.sfPro.bold,
    },
    bold: {
      fontFamily: theme.fonts.sfPro.bold,
    },
    badge: {
      fontSize: getSize.f(11),
      fontFamily: theme.fonts.sfPro.medium,
      color: theme.colors.textContrast,
    },
    badgeRewardGray: {
      fontSize: getSize.f(12),
      fontFamily: theme.fonts.sfPro.medium,
      color: theme.colors.primary,
    },
    badgeBlack: {
      fontSize: getSize.f(14),
      fontFamily: theme.fonts.sfPro.medium,
    },
    btnText: {
      fontSize: getSize.f(15),
      fontFamily: theme.fonts.sfPro.regular,
      color: theme.colors.primary,
    },
    emptyState: {
      fontFamily: theme.fonts.sfPro.regular,
      color: theme.colors.text2,
      textAlign: 'center',
      fontSize: getSize.f(17),
      lineHeight: getSize.h(22),
      letterSpacing: 0,
    },
  });

  const Component = animated ? Animated.Text : RNText;

  return (
    <Component
      allowFontScaling={false}
      style={[
        styles.default,
        variant && styles[variant],
        color && {color},
        style,
      ]}
      {...props}
    />
  );
};

export default Text;
