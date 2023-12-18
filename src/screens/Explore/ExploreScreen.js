import React, {useState, useEffect, useRef, useMemo} from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  Animated,
  FlatList,
  RefreshControl,
} from 'react-native';

import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {useSelector, useDispatch} from 'react-redux';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation, useScrollToTop} from '@react-navigation/native';

import theme from '../../theme/orangeLight';

import {getSize} from 'utils/responsive';
import {
  Badge,
  Wrapper,
  Text,
  Touchable,
  SearchBar,
  EmptyState,
  Loading,
  ChatRoomExplore,
} from 'components';
import VideoItem, {VideoPlaceholder} from 'components/VideoItem';
import HangoutExploreItem, {
  PlaceholderItems,
  CARD_HEIGHT,
} from 'components/HangoutExploreItem';
import i18n from 'i18n';
import {
  getRecommendHangouts,
  getNearbyHangouts,
  getFriendRequestList,
  getGuideVideos,
  getNotiCount,
  listChatRoomPublic,
  getRewardSetting,
} from 'actions';
import {fetchAddressForLocation} from 'utils/geolocationService';
import {createUUID} from 'utils/util';
import Paper from 'components/Paper';
import {Icons} from 'utils/icon';

const width = Dimensions.get('window').width;

const ExploreScreen = () => {
  const navigation = useNavigation();
  const userInfo = useSelector((state) => state.auth.userInfo);
  const {guideVideos, guideVideosLoading, guideVideoLastPage} = useSelector(
    (state) => state.app,
  );
  const {area, coords, areaLoaded, locationLoaded} = useSelector(
    (state) => state.location,
  );
  const dispatch = useDispatch();
  const {
    recommendList,
    recommendListLoading,
    recommendListLastPage,
    nearbyList,
    nearbyListLoading,
    nearbyListLastPage,

    chatRoomPublicList,
    chatRoomPublicListLoading,
    chatRoomPublicListLastPage,
  } = useSelector((state) => state.feed);
  const nearbyRadius = useSelector((state) => state.app.nearbyRadius);
  const {requestList} = useSelector((state) => state.contact);
  const [recommendPage, setRecommendPage] = useState(1);
  const [chatRoomPublicPage, setChatRoomPublicPage] = useState(1);
  const [nearbyPage, setNearbyPage] = useState(1);
  const {count} = useSelector((state) => state.notification);
  const [videoPage, setVideoPage] = useState(1);
  const listRef = useRef(null);

  const filteredNearbyList = useMemo(() => {
    const ids = nearbyList.map((i) => i.id);
    return nearbyList.filter(({id}, index) => !ids.includes(id, index + 1));
  }, [nearbyList]);

  useScrollToTop(listRef);

  const handleGetRecommend = (p = recommendPage) =>
    dispatch(getRecommendHangouts({page: p}));

  const handleGetMoreRecommend = () => {
    if (recommendPage < recommendListLastPage) {
      handleGetRecommend(recommendPage + 1);
      setRecommendPage(recommendPage + 1);
    }
  };

  const handleGetRoomPublic = (p = chatRoomPublicPage) =>
    dispatch(listChatRoomPublic({page: p}));

  const handleGetMoreRoomPublic = () => {
    if (chatRoomPublicPage < chatRoomPublicListLastPage) {
      handleGetRoomPublic(chatRoomPublicPage + 1);
      setChatRoomPublicPage(chatRoomPublicPage + 1);
    }
  };

  const handleGetNearby = (p = nearbyPage) => {
    dispatch(
      getNearbyHangouts({
        page: p,
        lat: coords.latitude,
        lng: coords.longitude,
        radius: nearbyRadius,
      }),
    );
    // if (coords?.latitude && coords?.longitude) {
    //   dispatch(
    //     getNearbyHangouts({
    //       page: p,
    //       lat: coords.latitude,
    //       lng: coords.longitude,
    //       radius: nearbyRadius,
    //     }),
    //   )
    // }
  };

  const handleGetPlaceDetail = async (value) => {
    const result = await fetchAddressForLocation(value);
  };

  const handleGetMoreNearby = () => {
    if (nearbyPage < nearbyListLastPage) {
      handleGetNearby(nearbyPage + 1);
      setNearbyPage(nearbyPage + 1);
    }
  };

  const handleRefresh = () => {
    setRecommendPage(1);
    handleGetRecommend(1);
    setNearbyPage(1);
    handleGetNearby(1);
    dispatch(getNotiCount());
    setVideoPage(1);
    handleGetVideo(1);

    setChatRoomPublicPage(1);
    handleGetRoomPublic(1);
  };

  const handleGetVideo = (p = videoPage) => {
    dispatch(getGuideVideos({page: p}));
  };

  const handleGetMoreVideo = () => {
    if (videoPage < guideVideoLastPage) {
      handleGetVideo(videoPage + 1);
      setVideoPage(videoPage + 1);
    }
  };

  useEffect(() => {
    dispatch(getRewardSetting());
    dispatch(getFriendRequestList({page: 1}));
    handleGetRecommend(1);
    handleGetRoomPublic(1);
    dispatch(getNotiCount());
    handleGetVideo(1);
    //dispatch(listChatRoom({page: 1, reset: true}));
  }, []);

  useEffect(() => {
    handleGetNearby(1);
    // if (nearbyRadius) {
    //   handleGetNearby(1)
    // }
  }, [area, nearbyRadius]);

  const TOP_SPACE = getStatusBarHeight();

  const [scrollAnim] = useState(new Animated.Value(0));

  const lang = {
    greeting: i18n.t('explore.greeting'),
    description: i18n.t('explore.description'),
    searchPlaceholder: i18n.t('explore.searchPlaceholder'),
    categories: i18n.t('explore.categories'),
    nearBy: i18n.t('explore.nearBy'),
    recommendation: i18n.t('explore.recommendation'),
    seeAll: i18n.t('explore.seeAll'),
    videos: i18n.t('explore.videos'),
    roomPublic: 'Rooms chat public',
    online: 'online',
  };

  const HEADER_PAPER_HEIGHT = getSize.h(220);
  const IMAGE_BG_HEIGHT = getSize.h(195);

  const styles = StyleSheet.create({
    wrapper: {
      flex: 1,
    },
    headerContainer: {
      paddingHorizontal: getSize.w(24),
      flexDirection: 'row',
      height: TOP_SPACE + getSize.h(45),
      paddingTop: getStatusBarHeight() + getSize.h(16),
      alignItems: 'center',
      justifyContent: 'space-between',
      zIndex: 1,
    },
    logoWrap: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    logo: {
      width: getSize.h(30),
      height: getSize.h(30),
      resizeMode: 'cover',
      marginRight: getSize.w(10),
    },
    bellBtn: {
      width: getSize.w(50),
      alignItems: 'flex-end',
    },
    notiBadge: {
      position: 'absolute',
      top: -getSize.h(7),
      right: -getSize.w(5),
    },
    headerContent: {
      marginTop: TOP_SPACE + getSize.h(5),
      paddingHorizontal: getSize.w(24),
      zIndex: 1,
    },
    greetingText: {
      fontFamily: theme.fonts.sfPro.bold,
      fontSize: getSize.f(18),
      color: theme.colors.textContrast,
      letterSpacing: 0.41,
    },
    descriptionText: {
      fontSize: getSize.f(15),
      color: theme.colors.textContrast,
      letterSpacing: 0.04,
      marginBottom: getSize.h(20),
      marginTop: getSize.h(5),
    },
    headerSearch: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: getSize.h(48),
    },
    paper: {
      ...StyleSheet.absoluteFillObject,
      height: TOP_SPACE + HEADER_PAPER_HEIGHT,
      zIndex: 0,
      justifyContent: 'flex-end',
    },
    categoryWrap: {
      paddingTop: getSize.h(13),
      paddingBottom: getSize.h(23),
      zIndex: 1,
    },
    categoryTitleWrap: {
      marginHorizontal: getSize.w(24),
      flexDirection: 'row',
      alignItems: 'center',
    },
    sectionHeaderText: {
      marginRight: getSize.w(5),
      fontSize: getSize.f(15),
      textTransform: 'uppercase',
      fontFamily: theme.fonts.sfPro.medium,
    },
    categoryList: {
      marginTop: getSize.h(8),
    },
    categoryListContent: {
      paddingHorizontal: getSize.w(24),
    },
    categoryTag: {
      marginRight: getSize.w(10),
    },
    imageBgWrap: {
      height: TOP_SPACE + IMAGE_BG_HEIGHT,
      position: 'absolute',
      top: 0,
      width,
      zIndex: 1,
      borderBottomLeftRadius: getSize.h(30),
      borderBottomRightRadius: getSize.h(30),
      overflow: 'hidden',
      backgroundColor: theme.colors.primary,
    },
    imageBg: {
      width,
      height: TOP_SPACE + IMAGE_BG_HEIGHT,
      borderBottomLeftRadius: getSize.h(30),
      borderBottomRightRadius: getSize.h(30),
    },
    scrollWrap: {
      ...StyleSheet.absoluteFillObject,
      zIndex: -1,
    },
    scrollContainer: {
      paddingTop: TOP_SPACE + HEADER_PAPER_HEIGHT,
      paddingBottom: getSize.h(30),
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: getSize.w(24),
      marginTop: getSize.h(30),
    },
    mapIcon: {
      width: getSize.h(24),
      height: getSize.h(24),
      resizeMode: 'contain',
    },
    sectionList: {
      marginTop: getSize.h(8),
      overflow: 'visible',
    },
    sectionListContent: {
      paddingHorizontal: getSize.w(19),
    },
    sectionListSeparator: {
      width: getSize.w(4),
    },
    itemWrapper: {
      marginHorizontal: getSize.h(5),
      marginVertical: getSize.w(5),
    },
    sectionEmpty: {
      height: CARD_HEIGHT,
      width: width - getSize.w(48),
    },
    mapBtnWrap: {
      position: 'relative',
      height: getSize.h(48),
      width: getSize.h(48),
      borderRadius: getSize.h(48 / 2),
      ...theme.shadow.small.ios,
      ...theme.shadow.small.android,
    },
    mapBtn: {
      position: 'absolute',
      height: getSize.h(48),
      width: getSize.h(48),
      borderRadius: getSize.h(48 / 2),
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.paper,
    },
    mapIconBlack: {tintColor: '#000'},
  });

  function renderHangoutItem({item}) {
    return <HangoutExploreItem wrapperStyle={styles.itemWrapper} data={item} />;
  }

  function renderChatRoomPublic({item}) {
    return <ChatRoomExplore wrapperStyle={styles.itemWrapper} data={item} />;
  }

  function renderVideoItem({item}) {
    return <VideoItem data={item} wrapperStyle={styles.itemWrapper} />;
  }

  const OUTPUT_TR_BG = getSize.h(68) + TOP_SPACE;
  const imageBgTranslate = scrollAnim.interpolate({
    inputRange: [0, HEADER_PAPER_HEIGHT - IMAGE_BG_HEIGHT, HEADER_PAPER_HEIGHT],
    outputRange: [
      0,
      -IMAGE_BG_HEIGHT - TOP_SPACE + OUTPUT_TR_BG,
      -IMAGE_BG_HEIGHT - TOP_SPACE + OUTPUT_TR_BG,
    ],
    extrapolate: 'clamp',
  });

  const OUTPUT_TR = -getSize.h(163);
  const headerContentTranslate = scrollAnim.interpolate({
    inputRange: [
      0,
      HEADER_PAPER_HEIGHT - IMAGE_BG_HEIGHT + getSize.h(20),
      getSize.h(160) + IMAGE_BG_HEIGHT,
    ],
    outputRange: [0, OUTPUT_TR, OUTPUT_TR],
    extrapolate: 'extend',
  });

  const headerOpacity = scrollAnim.interpolate({
    inputRange: [0, getSize.h(90), getSize.h(120)],
    outputRange: [1, 1, 0],
    extrapolate: 'clamp',
  });

  const greetingOpacity = scrollAnim.interpolate({
    inputRange: [0, getSize.h(70)],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const bgScale = scrollAnim.interpolate({
    inputRange: [-getSize.h(200), 0],
    outputRange: [2.7, 1],
    extrapolate: 'clamp',
  });

  const bgOpacity = scrollAnim.interpolate({
    inputRange: [0, IMAGE_BG_HEIGHT],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const mapBtnOpacity = scrollAnim.interpolate({
    inputRange: [0, IMAGE_BG_HEIGHT],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const nearbyLoading = !locationLoaded || !areaLoaded || nearbyListLoading;

  return (
    <Wrapper style={styles.wrapper}>
      <Animated.View
        style={[
          styles.imageBgWrap,
          {
            transform: [{translateY: imageBgTranslate}, {scale: bgScale}],
          },
        ]}>
        <Animated.Image
          style={[
            styles.imageBg,
            {
              opacity: bgOpacity,
            },
          ]}
          source={Icons.ex_headerBgImg}
        />
      </Animated.View>

      <Animated.View style={[styles.headerContainer, {opacity: headerOpacity}]}>
        <View style={styles.logoWrap}>
          <FastImage source={Icons.Logo} style={[styles.logo]} />
          <Text variant="logo">Kizuner</Text>
        </View>
        <Touchable
          onPress={() => navigation.navigate('Notification')}
          style={styles.bellBtn}>
          <SimpleLineIcons
            name="bell"
            color={theme.colors.textContrast}
            size={getSize.f(22)}
            style={{
              right:
                count + requestList.length > 99
                  ? getSize.w(15)
                  : count + requestList.length > 9
                  ? getSize.w(5)
                  : 0,
            }}
          />
          <Badge value={count + requestList.length} style={styles.notiBadge} />
        </Touchable>
      </Animated.View>

      <Animated.View
        style={[
          styles.headerContent,
          {transform: [{translateY: headerContentTranslate}]},
        ]}>
        <Animated.Text
          numberOfLines={1}
          style={[styles.greetingText, {opacity: greetingOpacity}]}>
          {i18n.t('explore.greeting', {name: userInfo?.name})}
        </Animated.Text>
        <Animated.Text
          style={[styles.descriptionText, {opacity: greetingOpacity}]}>
          {lang.description}
        </Animated.Text>
        <View style={styles.headerSearch}>
          <SearchBar
            placeholder={lang.searchPlaceholder}
            wrapperStyle={{width: width - getSize.w(48 + 10 + 48)}}
            autoFocus={false}
            onPress={() => navigation.navigate('Search')}
          />
          <Touchable
            style={styles.mapBtnWrap}
            scalable
            onPress={() => navigation.navigate('ExploreMap')}>
            <LinearGradient
              colors={theme.colors.gradient}
              start={{x: 0, y: 0}}
              style={styles.mapBtn}
              end={{x: 1, y: 0}}>
              <FastImage
                source={Icons.ic_mapIcon}
                style={styles.mapIcon}
                resizeMode="contain"
              />
            </LinearGradient>
            <Animated.View style={[styles.mapBtn, {opacity: mapBtnOpacity}]}>
              <Animated.Image
                source={Icons.ic_mapIcon}
                style={[
                  styles.mapIcon,
                  styles.mapIconBlack,
                  {opacity: mapBtnOpacity},
                ]}
                resizeMode="contain"
              />
            </Animated.View>
          </Touchable>
        </View>
      </Animated.View>

      <Animated.ScrollView
        bounces={false}
        ref={listRef}
        style={styles.scrollWrap}
        nestedScrollEnabled
        contentContainerStyle={styles.scrollContainer}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={nearbyListLoading || recommendListLoading}
            colors={theme.colors.gradient}
            tintColor={theme.colors.primary}
            onRefresh={handleRefresh}
            progressViewOffset={TOP_SPACE + IMAGE_BG_HEIGHT + getSize.h(20)}
          />
        }
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollAnim}}}],
          {useNativeDriver: false},
        )}>
        {/* <View style={styles.sectionHeader}>
          <Text style={styles.sectionHeaderText}>{lang.online}</Text>
        </View>
        <FlatList
          data={chatRoomPublicList}
          renderItem={renderChatRoomPublic}
          horizontal
          style={styles.sectionList}
          contentContainerStyle={styles.sectionListContent}
          keyExtractor={item => createUUID()}
          showsHorizontalScrollIndicator={false}
          ListFooterComponent={
            chatRoomPublicListLoading && (
              <PlaceholderItems
                // eslint-disable-next-line react-native/no-inline-styles
                style={{
                  marginLeft: chatRoomPublicList.length ? getSize.w(4) : 0,
                }}
              />
            )
          }
          ItemSeparatorComponent={() => (
            <View style={styles.sectionListSeparator} />
          )}
          initialNumToRender={6}
          onEndReachedThreshold={0.5}
          onEndReached={handleGetMoreRoomPublic}
          ListEmptyComponent={
            !chatRoomPublicListLoading && (
              <EmptyState wrapperStyle={styles.sectionEmpty} />
            )
          }
        /> */}

        {/* <Paper style={styles.paper}>
          <View style={[styles.categoryWrap]}>
            <View style={styles.categoryTitleWrap}>
              <Text style={styles.sectionHeaderText}>{lang.categories}</Text>
              <PaperIconButton
                icon='plus-circle'
                color={theme.colors.primary}
                size={getSize.h(24)}
                onPress={() =>
                  navigation.navigate('EditCategories', {isEdit: true})
                }
              />
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.categoryList}
              contentContainerStyle={styles.categoryListContent}>
              {userInfo?.categories?.data?.map(item => (
                <Tag
                  value={item.name}
                  key={createUUID()}
                  wrapperStyle={styles.categoryTag}
                />
              ))}
            </ScrollView>
          </View>
        </Paper> */}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionHeaderText}>Online</Text>
          {!nearbyLoading && !area ? (
            <Loading dark />
          ) : (
            <Touchable onPress={() => navigation.navigate('ExploreMap')}>
              <Text variant="btnText">
                {area || userInfo?.location?.address}
              </Text>
            </Touchable>
          )}
        </View>
        <FlatList
          data={filteredNearbyList}
          renderItem={renderHangoutItem}
          horizontal
          style={styles.sectionList}
          contentContainerStyle={styles.sectionListContent}
          keyExtractor={(item) => createUUID()}
          showsHorizontalScrollIndicator={false}
          ListFooterComponent={
            nearbyLoading && (
              <PlaceholderItems
                // eslint-disable-next-line react-native/no-inline-styles
                style={{
                  marginLeft: filteredNearbyList.length ? getSize.w(4) : 0,
                }}
              />
            )
          }
          ItemSeparatorComponent={() => (
            <View style={styles.sectionListSeparator} />
          )}
          initialNumToRender={6}
          onEndReachedThreshold={0.5}
          onEndReached={handleGetMoreNearby}
          ListEmptyComponent={
            !nearbyLoading && <EmptyState wrapperStyle={styles.sectionEmpty} />
          }
        />

        {/* <View style={styles.sectionHeader}>
          <Text style={styles.sectionHeaderText}>{lang.nearBy}</Text>
          {!nearbyLoading && !area ? (
            <Loading dark />
          ) : (
            <Touchable onPress={() => navigation.navigate('ExploreMap')}>
              <Text variant='btnText'>
                {area || userInfo?.location?.address}
              </Text>
            </Touchable>
          )}
        </View>
        <FlatList
          data={filteredNearbyList}
          renderItem={renderHangoutItem}
          horizontal
          style={styles.sectionList}
          contentContainerStyle={styles.sectionListContent}
          keyExtractor={item => createUUID()}
          showsHorizontalScrollIndicator={false}
          ListFooterComponent={
            nearbyLoading && (
              <PlaceholderItems
                // eslint-disable-next-line react-native/no-inline-styles
                style={{
                  marginLeft: filteredNearbyList.length ? getSize.w(4) : 0,
                }}
              />
            )
          }
          ItemSeparatorComponent={() => (
            <View style={styles.sectionListSeparator} />
          )}
          initialNumToRender={6}
          onEndReachedThreshold={0.5}
          onEndReached={handleGetMoreNearby}
          ListEmptyComponent={
            !nearbyLoading && <EmptyState wrapperStyle={styles.sectionEmpty} />
          }
        /> */}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionHeaderText}>{lang.recommendation}</Text>
          {/* <Touchable>
            <Text variant="btnText">{lang.seeAll}</Text>
          </Touchable> */}
        </View>
        <FlatList
          data={recommendList}
          renderItem={renderHangoutItem}
          horizontal
          style={styles.sectionList}
          contentContainerStyle={styles.sectionListContent}
          keyExtractor={(item) => createUUID()}
          showsHorizontalScrollIndicator={false}
          ListFooterComponent={
            recommendListLoading && (
              <PlaceholderItems
                // eslint-disable-next-line react-native/no-inline-styles
                style={{marginLeft: recommendList.length ? getSize.w(4) : 0}}
              />
            )
          }
          ItemSeparatorComponent={() => (
            <View style={styles.sectionListSeparator} />
          )}
          initialNumToRender={6}
          onEndReachedThreshold={0.5}
          onEndReached={handleGetMoreRecommend}
          ListEmptyComponent={
            !recommendListLoading && (
              <EmptyState wrapperStyle={styles.sectionEmpty} />
            )
          }
        />

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionHeaderText}>{lang.videos}</Text>
        </View>
        <FlatList
          data={guideVideos}
          renderItem={renderVideoItem}
          horizontal
          style={styles.sectionList}
          contentContainerStyle={styles.sectionListContent}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          snapToInterval={width - getSize.w(24 + 10)}
          pagingEnabled
          initialNumToRender={6}
          onEndReachedThreshold={0.5}
          onEndReached={handleGetMoreVideo}
          ItemSeparatorComponent={() => (
            <View style={styles.sectionListSeparator} />
          )}
          ListEmptyComponent={
            !guideVideosLoading ? (
              <EmptyState wrapperStyle={styles.sectionEmpty} />
            ) : (
              <VideoPlaceholder />
            )
          }
        />
      </Animated.ScrollView>
    </Wrapper>
  );
};

export default ExploreScreen;
