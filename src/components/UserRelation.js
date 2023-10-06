import React, {useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import {moneyToString, MoneyFormat} from 'short-money';
import {useNavigation} from '@react-navigation/native';

import {Text, Touchable} from 'components';
import {getSize} from 'utils/responsive';
import theme from '../theme/orangeLight';
import {useDispatch, useSelector} from 'react-redux';
import {ScrollView} from 'react-native';

const formatNumber = (number) =>
  moneyToString(number, MoneyFormat.shortAndNoDecimal);

const UserRelation = ({relation, userId}) => {
  const navigation = useNavigation();

  return (
    <View style={styles.statisticContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.statisticItem}>
          <Text style={styles.statisticValue}>
            {formatNumber(relation?.cast)}
          </Text>
          <Text style={styles.statisticLabel}>Cast</Text>
        </View>
        <View style={styles.statisticDivider} />
        <View style={styles.statisticItem}>
          <Text style={styles.statisticValue}>
            {formatNumber(relation?.guest)}
          </Text>
          <Text style={styles.statisticLabel}>Guest</Text>
        </View>
        <View style={styles.statisticDivider} />
        <View style={styles.statisticItem}>
          <Text style={styles.statisticValue}>
            {formatNumber(relation?.helped)}
          </Text>
          <Text style={styles.statisticLabel}>Helps</Text>
        </View>
        <View style={styles.statisticDivider} />
        <View style={styles.statisticItem}>
          <Text style={styles.statisticValue}>
            {formatNumber(relation?.helps)}
          </Text>
          <Text style={styles.statisticLabel}>Helped</Text>
        </View>
        <View style={styles.statisticDivider} />
        <Touchable
          onPress={() => {
            if (userId) {
              navigation.push('ContactListOfUser', {
                userId,
                initialTab: 'FollowingTab',
              });
            } else {
              navigation.push('ContactList', {initialTab: 'FollowingsTab'});
            }
          }}
          style={styles.statisticItem}>
          <Text style={[styles.statisticValue, styles.primary]}>
            {formatNumber(relation?.following)}
          </Text>
          <Text style={styles.statisticLabel}>Following</Text>
        </Touchable>
        <View style={styles.statisticDivider} />
        <Touchable
          onPress={() => {
            if (userId) {
              navigation.push('ContactListOfUser', {
                userId,
                initialTab: 'FollowersTab',
              });
            } else {
              navigation.push('ContactList', {initialTab: 'FollowersTab'});
            }
          }}
          style={styles.statisticItem}>
          <Text style={[styles.statisticValue, styles.primary]}>
            {formatNumber(relation?.follower)}
          </Text>
          <Text style={styles.statisticLabel}>Followers</Text>
        </Touchable>
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  statisticContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: getSize.w(10),
  },
  statisticItem: {
    marginHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statisticDivider: {
    backgroundColor: theme.colors.divider,
    width: getSize.w(1),
    height: getSize.h(48),
  },
  statisticValue: {
    fontFamily: theme.fonts.sfPro.bold,
    fontSize: getSize.f(17),
    textAlign: 'center',
  },
  statisticLabel: {
    fontSize: getSize.f(11),
    fontFamily: theme.fonts.sfPro.medium,
    textAlign: 'center',
    marginTop: getSize.h(3),
    color: theme.colors.tagTxt,
    textTransform: 'uppercase',
  },
  primary: {
    color: theme.colors.primary,
  },
});

export default UserRelation;
