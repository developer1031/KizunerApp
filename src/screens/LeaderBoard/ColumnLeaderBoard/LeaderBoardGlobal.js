import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Animated, RefreshControl} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useSelector, useDispatch} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import uuid from 'uuid/v4';

import useTheme from 'theme';
import {
  Avatar,
  LeaderboardItem,
  UserInfoBadge,
  Touchable,
  Text,
} from 'components';
import {getSize} from 'utils/responsive';

import {icBadges} from 'utils/icBadge';
import {getListLeaderBoardGlobal} from 'actions';
import FastImage from 'react-native-fast-image';
import _ from 'lodash';

const AnimatedLG = Animated.createAnimatedComponent(LinearGradient);

const LeaderBoardGlobal = ({navigation, route}) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.auth.userInfo);

  const {top_10, top_3} = useSelector(
    (state) => state.trophy.leaderboardGlobalList,
  );

  const [showModalInfo, setShowModalInfo] = useState(false);
  const [userSelected, setUserSelected] = useState({});

  const styles = StyleSheet.create({
    wrapper: {justifyContent: 'center', alignItems: 'center'},
    scrollWrap: {flex: 1},
    scrollCon: {
      paddingBottom: getSize.h(20) + insets.bottom,
    },
    scrollWrapList: {
      flex: 1,
    },
    tabWrap: {
      flexDirection: 'row',
      paddingHorizontal: 12,
      alignItems: 'flex-end',
      paddingTop: getSize.h(20),
    },
    rank: {
      width: '100%',
    },
    wrapRankTop2: {
      flex: 0.32,
    },
    wrapRankTop1: {flex: 0.38},
    wrapRankTop3: {flex: 0.3},
    wrapContentRankGole: {
      width: '100%',
      height: 190,
      justifyContent: 'center',
      alignItems: 'center',
    },
    wrapContentRankSilver: {
      width: '100%',
      height: 170,
    },
    wrapContentRankBrozen: {
      width: '100%',
      height: 160,
      justifyContent: 'center',
      alignItems: 'center',
    },
    name: {
      fontSize: getSize.f(13),
      fontFamily: theme.fonts.sfPro.bold,
      //textTransform: 'uppercase',
      color: theme.colors.grayDark,
      marginTop: getSize.h(8),
    },
    order: {
      fontSize: getSize.f(14),
      color: theme.colors.text2,
      fontFamily: theme.fonts.sfPro.medium,
      paddingHorizontal: getSize.w(8),
    },
    point: {
      fontSize: getSize.f(14),
      fontFamily: theme.fonts.sfPro.bold,
      color: '#FF6464',
      textTransform: 'uppercase',
      marginTop: getSize.h(4),
    },
    wrapChild: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    avatarSilver: {
      justifyContent: 'center',
      alignItems: 'center',
      marginVertical: getSize.h(8),
    },
    avatarGold: {
      justifyContent: 'center',
      alignItems: 'center',
      marginVertical: getSize.h(8),
    },
    avatarBrozen: {
      justifyContent: 'center',
      alignItems: 'center',
      marginVertical: getSize.h(8),
    },
    contextNamePoint: {
      position: 'absolute',
      justifyContent: 'center',
      alignItems: 'center',
      top: 28,
      left: 0,
      right: 0,
    },
  });

  const headerListTopRank = () => {
    return (
      <View style={styles.tabWrap}>
        <View style={styles.wrapRankTop2}>
          <View style={styles.avatarSilver}>
            <Touchable
              onPress={() => setShowUserSelected(top_3?.data[1])}
              scalable>
              <Avatar
                size="trophy"
                noShadow
                data={top_3?.data[1]?.user?.data?.media?.avatar}
                source={{uri: top_3?.data[1]?.user?.data?.avatar}}
              />
            </Touchable>
          </View>
          <View style={styles.wrapContentRankSilver}>
            <FastImage
              resizeMode={'stretch'}
              source={icBadges.rank.rankTop2}
              style={{
                width: '100%',
                height: 170,
              }}
            />
            <View style={styles.contextNamePoint}>
              <FastImage
                resizeMode={'stretch'}
                source={{uri: top_3?.data[1]?.trophy_icons[1]}}
                style={{
                  width: getSize.w(32),
                  height: getSize.w(32),
                }}
              />
              <Text style={styles.name} numberOfLines={1} number>
                {top_3?.data[1]?.user?.data?.name}
              </Text>
              <Text style={styles.point}>{top_3?.data[1]?.point}</Text>
            </View>
          </View>
        </View>
        <View style={styles.wrapRankTop1}>
          <View style={styles.avatarGold}>
            <Touchable
              onPress={() => setShowUserSelected(top_3?.data[0])}
              scalable>
              <Avatar
                size="trophy"
                noShadow
                data={top_3?.data[0]?.user?.data?.media?.avatar}
                source={{uri: top_3?.data[0]?.user?.data?.avatar}}
              />
            </Touchable>
          </View>
          <View style={styles.wrapContentRankGole}>
            <FastImage
              resizeMode={'stretch'}
              source={icBadges.rank.rankTop1}
              style={{
                width: '100%',
                height: 190,
              }}
            />
            <View style={styles.contextNamePoint}>
              <FastImage
                resizeMode={'stretch'}
                source={{uri: top_3?.data[1]?.trophy_icons[0]}}
                style={{
                  width: getSize.w(32),
                  height: getSize.w(32),
                }}
              />
              <Text style={styles.name} numberOfLines={1} number>
                {top_3?.data[0]?.user?.data?.name}
              </Text>
              <Text style={styles.point}>{top_3?.data[0]?.point}</Text>
            </View>
          </View>
        </View>
        <View style={styles.wrapRankTop3}>
          <View style={styles.avatarBrozen}>
            <Touchable
              onPress={() => setShowUserSelected(top_3?.data[2])}
              scalable>
              <Avatar
                size="trophy"
                noShadow
                data={top_3?.data[2]?.user?.data?.media?.avatar}
                source={{uri: top_3?.data[2]?.user?.data?.avatar}}
              />
            </Touchable>
          </View>
          <View style={styles.wrapContentRankBrozen}>
            <FastImage
              resizeMode={'stretch'}
              source={icBadges.rank.rankTop3}
              style={{
                width: '100%',
                height: 160,
              }}
            />
            <View style={styles.contextNamePoint}>
              <FastImage
                resizeMode={'stretch'}
                source={{uri: top_3?.data[1]?.trophy_icons[2]}}
                style={{
                  width: getSize.w(32),
                  height: getSize.w(32),
                }}
              />
              <Text style={styles.name} numberOfLines={1} number>
                {top_3?.data[2]?.user?.data?.name}
              </Text>
              <Text style={styles.point}>{top_3?.data[2]?.point}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  useEffect(() => {
    dispatch(getListLeaderBoardGlobal('global'));
  }, []);

  const handleRefresh = () => {
    dispatch(getListLeaderBoardGlobal('global'));
  };

  function getMore() {}

  function renderItem({item, index}) {
    return (
      <LeaderboardItem
        onSelect={() => setShowUserSelected(item)}
        data={item}
        index={index}
      />
    );
  }

  const setShowUserSelected = (item) => {
    setUserSelected(item);
    setShowModalInfo(true);
  };

  return (
    <AnimatedLG
      colors={theme.colors.gradient}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 0}}
      style={styles.scrollWrap}>
      <Animated.FlatList
        ListHeaderComponent={headerListTopRank}
        refreshControl={
          <RefreshControl
            refreshing={false}
            colors={theme.colors.gradient}
            tintColor={theme.colors.primary}
            onRefresh={handleRefresh}
          />
        }
        contentContainerStyle={styles.scrollCon}
        data={top_10?.data || []}
        keyExtractor={(i) => uuid()}
        showsVerticalScrollIndicator={false}
        renderItem={renderItem}
        initialNumToRender={20}
        ItemSeparatorComponent={() => (
          <View
            style={{
              height: getSize.w(1),
              backgroundColor: theme.colors.secondary,
            }}
          />
        )}
      />
      <UserInfoBadge
        userInfo={userSelected}
        open={showModalInfo}
        onClose={() => setShowModalInfo(false)}
        onDetail={() =>
          navigation.push('UserProfile', {userId: userSelected?.user?.data?.id})
        }
      />
    </AnimatedLG>
  );
};

export default LeaderBoardGlobal;
