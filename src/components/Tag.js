import React, {memo} from 'react';
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import Touchable from './Touchable';
import useTheme from 'theme';
import {getSize} from 'utils/responsive';

const Tag = memo(
  ({
    value,
    active,
    onPress,
    onRemove,
    wrapperStyle,
    noPunc,
    labelStyle,
    containerStyle,
  }) => {
    const theme = useTheme();

    const styles = StyleSheet.create({
      wrapper: {
        height: getSize.h(38),
        borderRadius: getSize.h(38 / 2),
        paddingHorizontal: getSize.w(noPunc ? 20 : 12),
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.tagBg,
        paddingRight: onRemove ? 0 : getSize.w(noPunc ? 20 : 12),
      },
      wrapperActive: {
        backgroundColor: theme.colors.tagBgActive,
      },
      tagTxt: {
        color: theme.colors.tagTxt,
      },
      textActive: {
        color: theme.colors.textContrast,
      },
      closeBtn: {
        marginHorizontal: getSize.w(6),
      },
    });

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
          <Text
            style={[styles.tagTxt, active && styles.textActive, labelStyle]}
            numberOfLines={1}>
            {!noPunc && '#'}
            {value}
          </Text>
          {onRemove && (
            <Touchable onPress={onRemove}>
              <MaterialCommunityIcons
                name="close"
                size={getSize.f(22)}
                style={styles.closeBtn}
                color={active ? theme.colors.textContrast : theme.colors.text}
              />
            </Touchable>
          )}
        </View>
      </TouchableOpacity>
    );
  },
);

export default Tag;
