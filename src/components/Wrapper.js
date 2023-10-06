import React, {useEffect} from 'react';
import {
  View,
  TouchableWithoutFeedback,
  Keyboard,
  StyleSheet,
  StatusBar,
  Platform,
} from 'react-native';

import useTheme from '../theme';

const Wrapper = ({style, dismissKeyboard, onPress, barStyle, ...props}) => {
  const theme = useTheme();

  const styles = StyleSheet.create({
    wrapper: {
      backgroundColor: theme.colors.background,
      flex: 1,
    },
  });

  useEffect(() => {
    StatusBar.setBarStyle('light-content');
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor('transparent');
      StatusBar.setTranslucent(true);
    }
  }, []);

  return (
    <>
      <StatusBar
        barStyle={barStyle || 'light-content'}
        translucent
        backgroundColor="transparent"
      />
      {dismissKeyboard || onPress ? (
        <TouchableWithoutFeedback
          onPress={() => (onPress ? onPress() : Keyboard.dismiss())}>
          <View style={[styles.wrapper, style]} {...props} />
        </TouchableWithoutFeedback>
      ) : (
        <View style={[styles.wrapper, style]} {...props} />
      )}
    </>
  );
};

export default Wrapper;
