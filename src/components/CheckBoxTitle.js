import React from 'react';
import {View, StyleSheet, Platform} from 'react-native';

import useTheme from 'theme';
import {getSize} from 'utils/responsive';
import {Text} from 'components';

import CheckBox from '@react-native-community/checkbox';

export const CheckBoxTitle = ({
  styleContainerProps,
  callback,
  status,
  choose,
  isReverse = false,
  title,
  isDisable,
  isGroup = true,
  ...props
}) => {
  const theme = useTheme();

  const styles = StyleSheet.create({
    rowBox: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: getSize.w(12),
    },
    rowBoxReverse: {
      alignItems: 'center',
      marginRight: getSize.w(12),
      flexDirection: 'row-reverse',
    },
    agreeBox: {
      left: -getSize.w(3),
      transform: [
        {
          scale: Platform.OS === 'ios' ? 0.8 : 1,
        },
      ],
    },
    formHeaderText: {
      fontFamily: theme.fonts.sfPro.medium,
      fontSize: getSize.f(14),
      marginRight: isReverse === true ? 8 : 0,
    },
  });

  const styleContainer = isReverse
    ? [styles.rowBoxReverse, styleContainerProps]
    : [styles.rowBox, styleContainerProps];

  return (
    <View style={styleContainer}>
      <CheckBox
        // disabled={isDisable}
        disabled={isDisable}
        value={choose === status}
        onValueChange={(event) => {
          if (event) {
            callback && callback(isGroup ? status : event);
          } else {
            callback && callback(null);
          }
        }}
        style={styles.agreeBox}
        boxType="square"
        lineWidth={3}
        onCheckColor={theme.colors.primary}
        onTintColor={theme.colors.primary}
        tintColors={{
          true: theme.colors.primary,
          false: theme.colors.inputLabel,
        }}
        animationDuration={0.1}
      />
      <Text style={styles.formHeaderText}>{title}</Text>
    </View>
  );
};
