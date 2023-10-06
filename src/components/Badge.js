import React from 'react';
import {StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import Text from './Text';
import useTheme from 'theme';
import {getSize} from 'utils/responsive';

const Badge = ({value, style}) => {
  const theme = useTheme();

  const styles = StyleSheet.create({
    wrapper: {
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: getSize.w(5),
      height: getSize.h(16),
      borderRadius: getSize.h(16 / 2),
    },
  });

  return (
    <LinearGradient
      colors={theme.colors.gradient}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 0}}
      style={[styles.wrapper, style]}>
      <Text variant="badge" numberOfLines={1}>
        {value > 99 ? '99+' : value}
      </Text>
    </LinearGradient>
  );
};

export default Badge;
