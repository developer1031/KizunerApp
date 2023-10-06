import React from 'react';
import {View, StyleSheet} from 'react-native';
import StarRating from 'react-native-star-rating';

import {getSize} from 'utils/responsive';
import {Touchable, Text} from 'components';
import orangeLight from '../theme/orangeLight';

const Rating = ({
  onPress,
  value,
  hideValue,
  reviewCount,
  hideReviewCount,
  wrapperStyle,
  small,
}) => {
  return (
    <Touchable style={wrapperStyle} scalable onPress={onPress}>
      <View style={styles.wrapper}>
        {!hideValue && Boolean(value) && (
          <View style={styles.valueBadge}>
            <Text style={styles.valueText}>{value.toFixed(1)}</Text>
          </View>
        )}
        <StarRating
          starSize={getSize.f(small ? 12 : 17)}
          maxStars={5}
          rating={value}
          disabled
          starStyle={styles.star}
          emptyStarColor={orangeLight.colors.grayLight}
          fullStarColor={orangeLight.colors.primary}
          halfStarColor={orangeLight.colors.primary}
        />
        {!hideReviewCount && (
          <Text style={styles.reviewCountText}>({reviewCount})</Text>
        )}
      </View>
    </Touchable>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  valueBadge: {
    height: getSize.h(16),
    borderRadius: getSize.h(4),
    paddingHorizontal: getSize.w(4),
    backgroundColor: orangeLight.colors.primary,
    justifyContent: 'center',
    marginRight: getSize.w(5),
  },
  valueText: {
    color: orangeLight.colors.textContrast,
    fontSize: getSize.f(8),
    letterSpacing: 0,
    fontFamily: orangeLight.fonts.sfPro.medium,
    textAlign: 'center',
  },
  reviewCountText: {
    color: orangeLight.colors.primary,
    fontSize: getSize.f(12),
    marginLeft: getSize.w(5),
  },
  star: {
    marginHorizontal: getSize.w(1.5),
  },
});

export default Rating;
