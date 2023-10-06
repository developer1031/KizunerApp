import React from 'react';
import {TouchableOpacity, StyleSheet, Image} from 'react-native';
import {getSize} from 'utils/responsive';

const ImageButton = (props) => {
  const {tintColor, image, style, ...otherProps} = props;
  return (
    <TouchableOpacity
      hitSlop={{
        top: getSize.h(6),
        left: getSize.h(6),
        bottom: getSize.h(6),
        right: getSize.h(6),
      }}
      style={[styles.imageButton, style]}
      {...otherProps}>
      <Image
        style={[styles.image, {tintColor: 'white'}]}
        resizeMode={'contain'}
        source={image}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  imageButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: getSize.w(22),
    height: getSize.h(22),
  },
});

export default ImageButton;
