import React from 'react';
import {ActivityIndicator, Platform, StyleSheet, View} from 'react-native';

import useTheme from 'theme';
import {getSize} from 'utils/responsive';

const Loading = ({size, dark, fullscreen, ...props}) => {
  const theme = useTheme();

  if (fullscreen) {
    return (
      <View style={styles.overlay}>
        <ActivityIndicator
          size="large"
          color={dark ? theme.colors.tagTxt : theme.colors.textContrast}
          {...props}
        />
      </View>
    );
  }
  return (
    <ActivityIndicator
      size={size}
      color={dark ? theme.colors.tagTxt : theme.colors.textContrast}
      style={Platform.OS === 'android' && styles.wrapper}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: getSize.h(20),
    height: getSize.h(20),
  },
  overlay: {
    position: 'absolute',
    top: -10,
    left: -10,
    right: -10,
    bottom: -10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
    zIndex: 99,
    elevation: 5,
  },
});

export default Loading;
