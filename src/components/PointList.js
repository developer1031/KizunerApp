import React from 'react';
import {View, StyleSheet} from 'react-native';

import {getSize} from 'utils/responsive';
import {Text} from 'components';
import orangeLight from '../theme/orangeLight';
import {ScrollView} from 'react-native';
import BadgeRewardItem from './BadgeRewardItem';
import {createUUID} from 'utils/util';

const PointList = ({
  variant = 'default',
  current = 0,
  max,
  min = 1,
  ...props
}) => {
  function renderIconActive() {
    const lstIcon = [];
    for (let c = min; c <= current; c++) {
      lstIcon.push(<Icon key={createUUID()} point={1} active={true} />);
    }
    return lstIcon;
  }

  function renderIconInActive() {
    const lstIcon = [];
    for (let c = current; c < max; c++) {
      lstIcon.push(<Icon key={createUUID()} point={c + 1} active={false} />);
    }
    return lstIcon;
  }

  return (
    <ScrollView
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
      horizontal={true}
      style={{flex: 1, height: getSize.h(40)}}>
      {renderIconActive()}
      {renderIconInActive()}
    </ScrollView>
  );
};

const Icon = ({point, active, ...props}) => {
  return (
    <View style={active ? styles.iconActive : styles.iconInActive}>
      {!active && (
        <View style={styles.iconSubInActive}>
          <Text style={styles.badge}>{point}</Text>
        </View>
      )}
      {active && (
        <BadgeRewardItem sizeIcon={getSize.w(21)} name={'activeLv1'} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: getSize.w(12),
  },
  iconActive: {
    width: getSize.w(32),
    height: getSize.w(32),
    borderRadius: getSize.w(32 / 2),
    borderWidth: 3,
    borderColor: orangeLight.colors.primary,
    marginRight: getSize.w(4),
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconInActive: {
    width: getSize.w(32),
    height: getSize.w(32),
    borderRadius: getSize.w(32 / 2),
    borderWidth: 3,
    borderColor: '#D4D2D2',
    marginRight: getSize.w(4),
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconSubInActive: {
    width: getSize.w(20),
    height: getSize.w(20),
    borderRadius: getSize.w(20 / 2),
    backgroundColor: '#F1F1F1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    color: '#D4D2D2',
    fontSize: getSize.f(8),
    fontFamily: orangeLight.fonts.sfPro.bold,
  },
});

export default PointList;
