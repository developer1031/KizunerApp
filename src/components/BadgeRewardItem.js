import React from 'react';
import {View} from 'react-native';
import {StyleSheet} from 'react-native';
import FastImage from 'react-native-fast-image';
import {icBadges} from 'utils/icBadge';
import orangeLight from '../theme/orangeLight';

import {getSize} from 'utils/responsive';
import Text from './Text';

export const BADGE_ICON = {
  activeLv1: icBadges.icBadgesActive.badgeActiveLv1,
  activeLv2: icBadges.icBadgesActive.badgeActiveLv2,
  activeLv3: icBadges.icBadgesActive.badgeActiveLv3,
  activeLv4: icBadges.icBadgesActive.badgeActiveLv4,
  activeLv5: icBadges.icBadgesActive.badgeActiveLv5,

  inActiveLv1: icBadges.icBadgesInActive.badgeInActiveLv1,
  inActiveLv2: icBadges.icBadgesInActive.badgeInActiveLv2,
  inActiveLv3: icBadges.icBadgesInActive.badgeInActiveLv3,
  inActiveLv4: icBadges.icBadgesInActive.badgeInActiveLv4,
  inActiveLv5: icBadges.icBadgesInActive.badgeInActiveLv5,
};

const BadgeRewardItem = ({name, number, sizeBox, sizeIcon}) => {
  const styles = StyleSheet.create({
    ccIcon: {
      width: getSize.f(sizeIcon),
      height: getSize.f(sizeIcon),
    },
    view: {
      width: getSize.f(sizeBox),
      height: getSize.f(sizeBox),
      borderRadius: getSize.f(sizeBox / 2),
      borderWidth: 2,
      borderColor: orangeLight.colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

  if (!sizeBox) {
    return (
      <FastImage
        source={BADGE_ICON[name]}
        style={styles.ccIcon}
        resizeMode="contain"
      />
    );
  }

  if (!BADGE_ICON[name]) {
    <View style={styles.view}>
      <Text variant={'badgeRewardGray'}>{number}</Text>
    </View>;
  }
  return (
    <View style={styles.view}>
      <FastImage
        source={BADGE_ICON[name]}
        style={styles.ccIcon}
        resizeMode="contain"
      />
    </View>
  );
};

export default BadgeRewardItem;
