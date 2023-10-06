import React from 'react';
import {View, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MaskedView from '@react-native-community/masked-view';

import useTheme from 'theme';
import {getSize} from 'utils/responsive';
import Text from './Text';

const PriceMarker = ({value, selected}) => {
  const theme = useTheme();

  const styles = StyleSheet.create({
    wrapper: {
      ...theme.shadow.small.ios,
      ...theme.shadow.small.android,
      justifyContent: 'center',
      alignItems: 'center',
    },
    maskView: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    maskGradient: {
      height: getSize.h(29),
      paddingHorizontal: getSize.w(5),
      justifyContent: 'center',
      alignItems: 'center',
      paddingBottom: getSize.h(5),
    },
    body: {
      height: getSize.h(24),
      borderRadius: getSize.h(5),
      paddingHorizontal: getSize.w(5),
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.markerBg,
    },
    triangle: {
      borderTopWidth: getSize.h(5),
      borderRightWidth: getSize.w(10) / 2.0,
      borderBottomWidth: 0,
      borderLeftWidth: getSize.w(10) / 2.0,
      borderTopColor: theme.colors.markerBg,
      borderRightColor: 'transparent',
      borderBottomColor: 'transparent',
      borderLeftColor: 'transparent',
      top: -1,
    },
  });

  const gradientProps = {
    style: styles.maskGradient,
    colors: theme.colors.gradient,
    start: {x: 0, y: 0},
    end: {x: 1, y: 0},
  };

  if (selected) {
    return (
      <MaskedView
        style={styles.wrapper}
        maskElement={
          <View style={styles.maskView}>
            <View style={styles.body}>
              <Text variant="badge">{value || 0} USD</Text>
            </View>
            <View style={styles.triangle} />
          </View>
        }>
        <LinearGradient {...gradientProps}>
          <Text variant="badge">{value || 0} USD</Text>
        </LinearGradient>
      </MaskedView>
    );
  }

  return (
    <View style={styles.wrapper}>
      <View style={styles.body}>
        <Text variant="badge">{value || 0} USD</Text>
      </View>
      <View style={styles.triangle} />
    </View>
  );
};

export default PriceMarker;
