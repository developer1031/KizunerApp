import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {getSize} from 'utils/responsive';
import {orangeLight} from 'theme';
import FastImage from 'react-native-fast-image';

const ImagePath = ({source, style, resizeMode, isVideo = false}) => {
  return (
    <View style={{justifyContent: 'center', alignItems: 'center'}}>
      <FastImage
        source={{
          uri: source,
          priority: FastImage.priority.normal,
          cache: FastImage.cacheControl.immutable,
        }}
        resizeMode={resizeMode}
        style={style}
      />
      {isVideo && (
        <AntDesign
          size={getSize.f(20)}
          name="playcircleo"
          style={{position: 'absolute'}}
          color={orangeLight.colors.primary}
        />
      )}
    </View>
  );
};

export default ImagePath;
