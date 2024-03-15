import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Animated,
  Keyboard,
  RefreshControl,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useSelector, useDispatch} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import {defaultFormatDate} from 'utils/datetime';
import moment from 'moment-timezone';

import useTheme from 'theme';
import {
  LeaderboardItem,
  UserInfoBadge,
  Paper,
  Input,
  DateTimePicker,
  Touchable,
  Avatar,
  Text,
} from 'components';
import {getSize} from 'utils/responsive';
import {icBadges} from 'utils/icBadge';

import {getListLeaderBoardCast} from 'actions';
import FastImage from 'react-native-fast-image';
import {createUUID} from 'utils/util';

const AnimatedLG = Animated.createAnimatedComponent(LinearGradient);

const LeaderBoardCast = ({navigation}) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();

  const {top_10, top_3} = useSelector(
    (state) => state.trophy?.leaderboardCastList,
  );

  const [scrollAnim] = useState(new Animated.Value(0));
  const [animatedHeight] = useState(new Animated.Value(0));
  const [opacityHeader] = useState(new Animated.Value(0));

  const [showModalInfo, setShowModalInfo] = useState(false);
  const [userSelected, setUserSelected] = useState({});

  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [startDate, setStartDate] = useState(moment().subtract(1, 'months'));

  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [endDate, setEndDate] = useState(moment());

  const headerTranslate = scrollAnim.interpolate({
    inputRange: [0, getSize.w(60), getSize.w(180)],
    outputRange: [0, 0, -getSize.h(80)],
    extrapolate: 'clamp',
  });

  const interpolatedHeight = animatedHeight.interpolate({
    inputRange: [0, getSize.w(1)],
    outputRange: [1, 0], // <---- HERE
    extrapolate: 'clamp',
  });

  const interpolatedOpacityHeight = opacityHeader.interpolate({
    inputRange: [getSize.w(30), getSize.h(50), getSize.h(60)],
    outputRange: [1, 1, 0],
    extrapolate: 'clamp',
  });

  const styles = StyleSheet.create({
    wrapper: {justifyContent: 'center', alignItems: 'center'},
    scrollWrap: {flex: 1},
    scrollCon: {
      paddingBottom: getSize.h(20) + insets.bottom,
      zIndex: 10000,
    },
    scrollWrapList: {
      backgroundColor: 'rgba(255, 255, 255, 0.0)',
      flex: 1,
    },
    tabWrap: {
      flexDirection: 'row',
      paddingHorizontal: 12,
      alignItems: 'flex-end',
      marginTop: -getSize.w(12),
      // paddingTop: getSize.h(80),
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
    formDate: {
      paddingHorizontal: getSize.w(12),
      backgroundColor: 'transparent',
      paddingTop: getSize.w(8),
      paddingBottom: getSize.w(4),
      flex: 1,
    },
    label: {
      color: 'white',
      fontWeight: '500',
      fontSize: 12,
    },
    text: {
      color: 'white',
      fontWeight: '600',
      fontSize: 14,
    },
  });

  const setShowUserSelected = (item) => {
    setUserSelected(item);
    setShowModalInfo(true);
  };

  useEffect(() => {
    dispatch(
      getListLeaderBoardCast({
        from_date: defaultFormatDate(startDate),
        to_date: defaultFormatDate(endDate),
      }),
    );
  }, [startDate, endDate]);

  const handleRefresh = () => {
    dispatch(
      getListLeaderBoardCast({
        from_date: defaultFormatDate(startDate),
        to_date: defaultFormatDate(endDate),
      }),
    );
  };

  function renderItem({item, index}) {
    return (
      <LeaderboardItem
        onSelect={() => setShowUserSelected(item)}
        data={item}
        index={index}
      />
    );
  }

  const renderHeaderDate = () => {
    return (
      <Animated.View
        style={[
          {
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingVertical: getSize.w(6),
          },
          // {
          //   transform: [{translateY: headerTranslate}],
          //   height: interpolatedHeight,
          // },
        ]}>
        <Paper noBorder={true} noShadow={true} style={styles.formDate}>
          <Input
            placeholder={'Today at 05:00'}
            label={'From date'}
            onPress={() => {
              Keyboard.dismiss();
              setShowStartTimePicker(true);
            }}
            value={defaultFormatDate(startDate)}
            rightIconProps={{
              icon: 'calendar',
              color: theme.colors.textContrast,
              size: getSize.f(24),
            }}
            labelStyle={styles.label}
            style={styles.text}
          />
        </Paper>
        <Paper noBorder={true} noShadow={true} style={styles.formDate}>
          <Input
            placeholder={'Today at 05:00'}
            label={'To date'}
            onPress={() => {
              Keyboard.dismiss();
              setShowEndTimePicker(true);
            }}
            value={defaultFormatDate(endDate)}
            rightIconProps={{
              icon: 'calendar',
              color: theme.colors.textContrast,
              size: getSize.f(24),
            }}
            labelStyle={styles.label}
            style={styles.text}
          />
        </Paper>
      </Animated.View>
    );
  };

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
              <Text style={styles.point}>{top_3?.data[1]?.quantity}</Text>
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
              <Text style={styles.point}>{top_3?.data[0]?.quantity}</Text>
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
              <Text style={styles.point}>{top_3?.data[2]?.quantity}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <AnimatedLG
      colors={theme.colors.gradient}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 0}}
      style={styles.scrollWrap}>
      <Animated.FlatList
        ListHeaderComponent={
          <>
            {renderHeaderDate()}
            {headerListTopRank()}
          </>
        }
        refreshControl={
          <RefreshControl
            refreshing={false}
            colors={theme.colors.gradient}
            tintColor={theme.colors.primary}
            onRefresh={handleRefresh}
          />
        }
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollAnim}}}],
          {
            useNativeDriver: true,
          },
        )}
        contentContainerStyle={styles.scrollCon}
        style={styles.scrollWrapList}
        data={top_10?.data || []}
        keyExtractor={(i) => createUUID() + i}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        initialNumToRender={20}
        ItemSeparatorComponent={() => (
          <View
            style={{
              height: getSize.w(1.5),
              backgroundColor: theme.colors.secondary,
            }}
          />
        )}
      />
      <DateTimePicker
        open={showStartTimePicker}
        onCancel={() => {
          setShowStartTimePicker(false);
        }}
        onConfirm={(date) => {
          setShowStartTimePicker(false);
          setStartDate(date);
        }}
        mode="date"
        maximumDate={moment().toDate()}
        date={moment(startDate).toDate()}
      />

      <DateTimePicker
        open={showEndTimePicker}
        onCancel={() => {
          setShowEndTimePicker(false);
        }}
        onConfirm={(date) => {
          setShowEndTimePicker(false);
          setEndDate(date);
        }}
        mode="date"
        minimumDate={moment(startDate).toDate()}
        maximumDate={moment().toDate()}
        date={moment(endDate).toDate()}
      />

      <UserInfoBadge
        userInfo={userSelected}
        open={showModalInfo}
        onClose={() => setShowModalInfo(false)}
        onDetail={() => {
          navigation.push('UserProfile', {
            userId: userSelected?.user?.data?.id,
          });
        }}
      />
    </AnimatedLG>
  );
};

export default LeaderBoardCast;
