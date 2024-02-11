import React from 'react';
import {StyleSheet} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import useTheme from 'theme';
import {getSize} from 'utils/responsive';
import {Touchable, Text} from 'components';
import orangeLight from '../../theme/orangeLight';

const HangoutCapacity = ({capacity, onPress, disabled, isMinCapacity}) => {
  const theme = useTheme();
  if (!!capacity) {
    return (
      <>
        {!!isMinCapacity && (
          <Touchable
            onPress={onPress}
            style={stylesMain.wrapper}
            disabled={disabled ? true : false}>
            <MaterialCommunityIcons
              name="account-multiple"
              color={theme.colors.primary}
              size={getSize.f(20)}
            />
            <Text style={stylesMain.label}>{'Guest Minimum Capacity'}: </Text>
            <Text style={stylesMain.value}>{isMinCapacity}</Text>
          </Touchable>
        )}
        <Touchable
          onPress={onPress}
          style={stylesMain.wrapper}
          disabled={disabled ? true : false}>
          <MaterialCommunityIcons
            name="account-multiple"
            color={theme.colors.primary}
            size={getSize.f(20)}
          />
          <Text style={stylesMain.label}>{'Guest Capacity'}: </Text>
          <Text style={stylesMain.value}>{capacity}</Text>
        </Touchable>
      </>
    );
  }
  return null;
};

const stylesMain = StyleSheet.create({
  wrapper: {
    marginTop: getSize.h(10),
    height: getSize.h(54),
    paddingHorizontal: getSize.w(24),
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: orangeLight.colors.capacityBg,
  },
  label: {
    fontFamily: orangeLight.fonts.sfPro.medium,
    color: orangeLight.colors.primary,
    marginLeft: getSize.w(10),
    fontSize: getSize.f(15),
  },
  value: {
    fontFamily: orangeLight.fonts.sfPro.medium,
    color: orangeLight.colors.tagTxt,
    fontSize: getSize.f(15),
  },
});

export default HangoutCapacity;
