import React from 'react';

import {View, StyleSheet} from 'react-native';

import {Text} from 'components';
import useTheme from 'theme';
import {getSize} from 'utils/responsive';

const sliderRadius = getSize.w(0);
const width = getSize.w(35);

const SelectRangeLabel = ({
  oneMarkerValue,
  twoMarkerValue,
  oneMarkerLeftPosition,
  twoMarkerLeftPosition,
  oneMarkerPressed,
  twoMarkerPressed,
}) => {
  const theme = useTheme();

  const styles = StyleSheet.create({
    sliderLabel: {
      position: 'absolute',
      bottom: -10,
      minWidth: width,
      height: width,
      backgroundColor: theme.colors.primary,
      borderRadius: width / 2,
      justifyContent: 'center',
      alignItems: 'center',
    },
    sliderLabelText: {
      alignItems: 'center',
      textAlign: 'center',
      fontSize: getSize.f(12),
      color: theme.colors.textContrast,
    },
    markerPressed: {
      backgroundColor: theme.colors.secondary,
    },
    wrapper: {position: 'relative'},
  });

  return (
    <View style={styles.wrapper}>
      {Number.isFinite(oneMarkerLeftPosition) &&
        Number.isFinite(oneMarkerValue) && (
          <View
            style={[
              styles.sliderLabel,
              {left: oneMarkerLeftPosition - width / 2 + sliderRadius},
              oneMarkerPressed && styles.markerPressed,
            ]}>
            <Text style={styles.sliderLabelText}>{oneMarkerValue}</Text>
          </View>
        )}

      {Number.isFinite(twoMarkerLeftPosition) &&
        Number.isFinite(twoMarkerValue) && (
          <View
            style={[
              styles.sliderLabel,
              {left: twoMarkerLeftPosition - width / 2 + sliderRadius},
              twoMarkerPressed && styles.markerPressed,
            ]}>
            <Text style={styles.sliderLabelText}>{twoMarkerValue}</Text>
          </View>
        )}
    </View>
  );
};

export default SelectRangeLabel;
