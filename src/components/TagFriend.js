import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';

import Text from './Text';

import orangeLight from '../theme/orangeLight';

const TagFriend = ({
  value,
  active,
  onPress,
  wrapperStyle,
  labelStyle,
  containerStyle,
}) => {
  return (
    <TouchableOpacity
      style={wrapperStyle}
      activeOpacity={0.7}
      onPress={onPress}>
      <View
        style={[
          styles.wrapper,
          active && styles.wrapperActive,
          containerStyle,
        ]}>
        <Text style={[styles.tagTxt, active && styles.textActive, labelStyle]}>
          {value}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: {},
  wrapperActive: {
    backgroundColor: orangeLight.colors.tagBgActive,
  },
  tagTxt: {
    color: orangeLight.colors.tagTxt,
    fontWeight: 'bold',
  },
  textActive: {
    color: orangeLight.colors.textContrast,
  },
});

export default TagFriend;
