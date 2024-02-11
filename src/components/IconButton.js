import React from 'react';
import {StyleSheet, View, Platform} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import {Touchable, Loading} from 'components';
import useTheme from 'theme';
import {getSize} from 'utils/responsive';

const IconButton = ({
  style,
  wrapperStyle,
  variant = 'default',
  disabled,
  icon,
  loading,
  size = 48,
  ...props
}) => {
  const theme = useTheme();

  const styles = StyleSheet.create({
    container: {
      height: getSize.h(size),
      width: getSize.h(size),
      borderRadius: getSize.h(size / 2),
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.paper,
      paddingTop: Platform.OS === 'ios' ? getSize.h(2) : 0,
      ...theme.shadow.small.ios,
      ...theme.shadow.small.android,
    },
    primary: {
      backgroundColor: theme.colors.primary,
      ...theme.shadow.small.ios,
      ...theme.shadow.small.android,
    },
    ghost: {
      ...theme.shadow.small.android,
      ...theme.shadow.small.ios,
    },
  });

  const ViewComponent =
    variant === 'default' && !disabled
      ? (p) => (
          <LinearGradient
            colors={theme.colors.gradient}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            {...p}
          />
        )
      : View;

  return (
    <Touchable
      scalable
      disabled={disabled || loading ? true : false}
      style={wrapperStyle}
      {...props}>
      <ViewComponent
        style={[styles.container, style, styles[variant] && styles[variant]]}>
        {loading ? <Loading dark size="small" /> : icon}
      </ViewComponent>
    </Touchable>
  );
};

export default IconButton;
