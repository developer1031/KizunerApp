import React from 'react';
import {View, StyleSheet, ActivityIndicator} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import useTheme from 'theme';
import {getSize} from 'utils/responsive';
import {Text, Touchable} from 'components';

const Button = ({
  variant = 'default',
  title,
  containerStyle,
  buttonStyle,
  titleStyle,
  style,
  disabled,
  onPress,
  loading,
  leftIcon,
  rightIcon,
  fullWidth,
  gradient,
  ...props
}) => {
  const theme = useTheme();

  const styles = StyleSheet.create({
    titleStyle: {
      color: theme.colors.textContrast,
    },
    containerStyle: {
      overflow: 'visible',
      backgroundColor: theme.colors.paper,
      borderRadius: getSize.h(48 / 2),
    },
    buttonViewStyle: {
      height: getSize.h(48),
      paddingHorizontal: getSize.w(23),
      borderRadius: getSize.h(48 / 2),
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      width: fullWidth && '100%',
    },
    iconLeft: {
      marginRight: getSize.w(10),
    },
    iconRight: {
      marginLeft: getSize.w(10),
    },
    disabledStyle: {
      backgroundColor: theme.colors.disabled,
    },
    buttonStyle: {},
    ghostStyle: {
      borderWidth: getSize.h(2),
      borderColor: theme.colors.tagTxt,
      backgroundColor: theme.colors.paper,
      borderRadius: getSize.h(48 / 2),
    },
  });

  const ViewComponent =
    variant === 'default' && !disabled
      ? (p) => (
          <LinearGradient
            colors={gradient ? gradient : theme.colors.gradient}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            {...p}
          />
        )
      : View;

  return (
    <View
      style={[
        styles.containerStyle,
        variant !== 'ghost' && !disabled && !loading && theme.shadow.small.ios,
        containerStyle,
      ]}>
      <Touchable
        scalable
        style={[styles.buttonStyle, buttonStyle]}
        onPress={() => (!disabled && !loading && onPress ? onPress() : null)}
        {...props}>
        <ViewComponent
          style={[
            styles.buttonViewStyle,
            variant === 'ghost' && styles.ghostStyle,
            !disabled && !loading && theme.shadow.small.android,
            (disabled || loading) && styles.disabledStyle,
            style,
          ]}>
          {loading ? (
            <ActivityIndicator
              size="small"
              color={
                variant === 'ghost'
                  ? theme.colors.btnGhostText
                  : theme.colors.textContrast
              }
            />
          ) : (
            <>
              {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}
              <Text
                numberOfLines={1}
                variant="button"
                style={[
                  styles.titleStyle,
                  variant === 'ghost' && {color: theme.colors.tagTxt},
                  titleStyle,
                ]}>
                {title}
              </Text>
              {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
            </>
          )}
        </ViewComponent>
      </Touchable>
    </View>
  );
};

export default Button;
