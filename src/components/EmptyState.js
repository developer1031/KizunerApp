import React from 'react';
import {View, StyleSheet} from 'react-native';
import FastImage from 'react-native-fast-image';

import {getSize} from 'utils/responsive';
import {Text} from 'components';
import useTheme from 'theme';
import {Icons} from 'utils/icon';

const EmptyState = ({wrapperStyle, label, imageSource, imageStyle}) => {
  const theme = useTheme();
  const styles = StyleSheet.create({
    wrapper: {
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: getSize.h(20),
      paddingHorizontal: getSize.w(20),
    },
    maskWrap: {
      width: getSize.h(70),
      height: getSize.h(70),
    },
    image: {
      width: getSize.h(70),
      height: getSize.h(70),
      marginBottom: getSize.h(20),
      resizeMode: 'contain',
      tintColor: !imageSource ? theme.colors.grayLight : undefined,
    },
  });

  return (
    <View style={[styles.wrapper, wrapperStyle]}>
      <FastImage
        source={imageSource || Icons.Logo}
        tintColor={!imageSource && theme.colors.grayLight}
        style={[styles.image, imageStyle]}
        resizeMode="contain"
      />
      <Text variant="emptyState">{label || 'No data'}</Text>
    </View>
  );
};

export default EmptyState;
