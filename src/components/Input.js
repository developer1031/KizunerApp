import React, {useState, useEffect} from 'react';
import {TextInput, StyleSheet, View, Platform} from 'react-native';
import {IconButton} from 'react-native-paper';
import TextInputMask from 'react-native-text-input-mask';
import CheckBox from '@react-native-community/checkbox';

import useTheme from 'theme';
import {getSize} from 'utils/responsive';
import {Text, Touchable} from 'components';

const Input = ({
  type,
  label,
  style,
  wrapperStyle,
  showEye,
  error,
  onEyePress,
  rightIconProps,
  leftIcon,
  labelStyle,
  onPress,
  touched,
  labelRight,
  masked,
  disabled,
  placeholderStyle,
  rightIconPropsCheckBox,
  callback,
  valueCheckBox,
  ...props
}) => {
  const theme = useTheme();
  const [eyeOpen, setEyeOpen] = useState(false);

  /**
   * Workaround for https://github.com/facebook/react-native/issues/27204
   */
  const [editable, setEditable] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setEditable(true);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  const styles = StyleSheet.create({
    wrapper: {},
    labelWrapper: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    container: {
      borderBottomWidth: getSize.h(1),
      borderBottomColor: theme.colors.divider,
    },
    input: {
      fontSize: getSize.f(16),
      letterSpacing: 1,
      color: theme.colors.text,
      paddingVertical: getSize.h(Platform.OS === 'ios' ? 10 : 6),
      paddingHorizontal: 0,
      paddingLeft: leftIcon ? getSize.w(35) : 0,
      paddingRight: rightIconProps ? getSize.w(35) : 0,
    },
    leftIcon: {
      position: 'absolute',
      left: 0,
      top: label ? getSize.h(Platform.OS === 'ios' ? 24 : 27) : getSize.h(7),
      margin: 0,
    },
    rightIconBtn: {
      position: 'absolute',
      right: 0,
      top: getSize.h(20),
      margin: 0,
    },
    helper: {
      marginBottom: getSize.h(4),
    },
    agreeBox: {
      position: 'absolute',
      right: 0,
      transform: [
        {
          scale: Platform.OS === 'ios' ? 0.75 : 1,
        },
      ],
      ...Platform.select({
        ios: {
          top: -35,
        },
        android: {
          top: getSize.h(25),
        },
      }),
    },
  });

  let inputProps;
  if (type === 'email') {
    inputProps = {
      keyboardType: 'email-address',
      autoCapitalize: 'none',
    };
  } else if (type === 'password') {
    inputProps = {
      secureTextEntry: showEye ? !eyeOpen : true,
    };
  }

  const WrapperComponent =
    onPress && Platform.OS === 'android' ? Touchable : View;
  const InputComponent = masked ? TextInputMask : TextInput;

  const showLabel = label || labelRight;

  return (
    <View style={[styles.wrapper, wrapperStyle]}>
      <WrapperComponent
        onPress={() => onPress && Platform.OS === 'android' && onPress()}
        style={[styles.container]}>
        {showLabel && (
          <View style={styles.labelWrapper}>
            {label && (
              <Text variant="inputLabel" style={labelStyle}>
                {label}
              </Text>
            )}
            {labelRight}
          </View>
        )}

        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
        <InputComponent
          editable={!disabled && !onPress && editable}
          onTouchEnd={onPress}
          placeholderTextColor={
            placeholderStyle ? placeholderStyle : theme.colors.grayLight
          }
          style={[styles.input, style]}
          selectionColor={theme.colors.primary}
          allowFontScaling={false}
          {...inputProps}
          {...props}
          keyboardType={type}
          autoCapitalize={false}
        />
        {showEye && (
          <IconButton
            icon={eyeOpen ? 'eye-off' : 'eye'}
            color={theme.colors.grayDark}
            onPress={() => {
              onEyePress && onEyePress();
              setEyeOpen(!eyeOpen);
            }}
            style={styles.rightIconBtn}
          />
        )}
        {rightIconProps && (
          <IconButton {...rightIconProps} style={styles.rightIconBtn} />
        )}
        {rightIconPropsCheckBox && (
          <CheckBox
            value={valueCheckBox}
            disabled={disabled ? true : false}
            style={styles.agreeBox}
            boxType="square"
            lineWidth={3}
            onCheckColor={theme.colors.primary}
            onTintColor={theme.colors.primary}
            tintColors={{
              true: theme.colors.primary,
              false: theme.colors.inputLabel,
            }}
            onValueChange={(event) => {
              if (event) {
                callback && callback(true);
              } else {
                callback && callback(false);
              }
            }}
          />
        )}
      </WrapperComponent>
      <Text style={styles.helper} variant="errorHelper">
        {touched ? error?.message || error : ''}
      </Text>
    </View>
  );
};

export default Input;
