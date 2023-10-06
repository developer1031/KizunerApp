import React, {useState, useEffect, useRef, memo} from 'react';
import {
  StyleSheet,
  RefreshControl,
  View,
  ScrollView,
  Animated,
  Platform,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import {useSelector, useDispatch} from 'react-redux';
import {useSafeArea} from 'react-native-safe-area-context';
import {useScrollToTop} from '@react-navigation/native';
import useTheme from 'theme';
import {
  Wrapper,
  Paper,
  Touchable,
  Header,
  Tag,
  Text,
  EmptyState,
  Loading,
} from 'components';
import {getSize} from 'utils/responsive';
import {getNewsFeed} from 'actions';
import {
  HangoutPlaceholder,
  FeedItemStatus,
  FeedItemHangout,
  FeedItemHelp,
} from 'components/FeedItem';
import {styles as style} from './style';
import orangeLight from '../../theme/orangeLight';
import {createUUID} from 'utils/util';

const NewsFeedScreen = ({navigation}) => {
  const theme = useTheme();
  const [filter, setFilter] = useState('All');
  const [scrollAnim] = useState(new Animated.Value(0));
  const dispatch = useDispatch();
  const insets = useSafeArea();
  const {
    newsFeed,
    newsFeedLoading,
    newsFeedLastPage: lastPage,
    hasNewFeed,
  } = useSelector((state) => state.feed);
  const {isSkipLaunch} = useSelector((state) => state.app);
  const {userInfo} = useSelector((state) => state.auth);
  const has_posted = userInfo?.has_posted || false;
  const [page, setPage] = useState(1);
  const listRef = useRef(null);
  const [feedStatus, setFeedStatus] = useState([
    'All',
    'Status',
    'Hangout',
    'Help',
  ]);

  const [showSkipLauch, setShowSkipLauch] = useState(has_posted);
  useEffect(() => {
    setShowSkipLauch(has_posted);
  }, [has_posted]);

  useScrollToTop(listRef);

  const handleGetFeed = (p = page, type, callback) => {
    dispatch(getNewsFeed({page: p, type}, callback));
  };

  const handleLoadMore = () => {
    if (page < lastPage) {
      handleGetFeed(
        page + 1,
        filter === 'All' ? null : filter && filter.toLowerCase(),
      );
      setPage(page + 1);
    }
  };

  const handleRefresh = () => {
    setPage(1);
    handleGetFeed(1, filter === 'All' ? null : filter && filter.toLowerCase(), {
      success: () =>
        listRef?.current?.getNode().scrollToOffset({offset: -TOP_INSET}),
    });
  };

  useEffect(() => {
    handleGetFeed(1, null, {
      success: () =>
        listRef?.current?.getNode().scrollToOffset({offset: -TOP_INSET}),
    });
  }, []);

  const HEADER_HEIGHT = 89;

  const styles = {
    ...style,
    hasNewFeedWrap: {
      ...style.hasNewFeedWrap,
      bottom: insets.bottom + getSize.h(20),
    },
  };

  function renderItem({item, index}) {
    let data = item?.relation?.data;
    index === 0 &&
      console.log(
        '🚀 ~ file: NewsFeedScreen.js:111 ~ renderItem ~ data:',
        data,
      );
    let type = item?.type;

    let arr = {
      status: <FeedItemStatus key={index} data={data} type={type} />,
      hangout: <FeedItemHangout key={index} data={data} type={type} />,
      help: <FeedItemHelp key={index} data={data} type={type} />,
    };

    return arr[type] || null;
  }

  const TOP_INSET =
    Platform.OS === 'ios'
      ? getStatusBarHeight() + getSize.h(HEADER_HEIGHT + 125)
      : 0;

  const headerOpacity = scrollAnim.interpolate({
    inputRange: [
      -TOP_INSET,
      getSize.h(HEADER_HEIGHT - 30),
      getSize.h(HEADER_HEIGHT + 30),
    ],
    outputRange: [1, 1, 0],
    extrapolate: 'clamp',
  });

  const headerTranslate = scrollAnim.interpolate({
    inputRange: [
      -TOP_INSET,
      getSize.h(HEADER_HEIGHT - 20),
      getSize.h(HEADER_HEIGHT + 60),
    ],
    outputRange: [0, 0, -getSize.h(21)],
    extrapolate: 'clamp',
  });

  const actionTranslate = scrollAnim.interpolate({
    inputRange: [
      -TOP_INSET,
      getSize.h(HEADER_HEIGHT - 40),
      getSize.h(HEADER_HEIGHT + 60),
    ],
    outputRange: [0, 0, -getSize.h(HEADER_HEIGHT - 48 / 2 - 8)],
    extrapolate: 'clamp',
  });

  const filterTranslate = scrollAnim.interpolate({
    inputRange: [-TOP_INSET, getSize.h(HEADER_HEIGHT + 60)],
    outputRange: [0, -getSize.h(HEADER_HEIGHT + 60)],
    extrapolate: 'clamp',
  });
  const _setFilter = (item) => () => {
    setFilter(item);
    setPage(1);
    if (item === 'All') {
      handleGetFeed(1);
    } else {
      handleGetFeed(1, item.toLowerCase());
    }
  };
  return (
    <Wrapper style={styles.wrapper}>
      <Header
        addSBHeight
        wrapperStyle={stylesMain.headerWrap}
        animatedStyle={{opacity: headerOpacity}}
        bgAnimatedStyle={{transform: [{translateY: headerTranslate}]}}
        height={HEADER_HEIGHT}
        rightComponent={
          <Touchable onPress={() => navigation.navigate('Search')}>
            <SimpleLineIcons
              name="magnifier"
              color={theme.colors.textContrast}
              size={getSize.f(22)}
            />
          </Touchable>
        }
      />
      <HeaderFunction
        onPresStatus={() => navigation.navigate('CreateStatus')}
        onPresHangout={() => navigation.navigate('CreateHangout')}
        onPresHelp={() => navigation.navigate('CreateHelp')}
        style={[
          styles.actionWrap,
          {transform: [{translateY: actionTranslate}]},
        ]}
        theme={theme}
      />
      <FilterFunction
        style={[
          styles.statusFilter,
          {transform: [{translateY: filterTranslate}]},
        ]}>
        {feedStatus.map((item) => (
          <Tag
            value={item}
            key={item}
            noPunc
            active={filter === item}
            wrapperStyle={stylesMain.filterItem}
            onPress={_setFilter(item)}
          />
        ))}
      </FilterFunction>
      <Animated.FlatList
        data={newsFeed}
        keyExtractor={(item) => item?.id?.toString() + createUUID()}
        ref={listRef}
        style={stylesMain.scrollWrap}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        renderItem={renderItem}
        contentInset={{top: TOP_INSET}}
        ListFooterComponent={newsFeedLoading && <HangoutPlaceholder />}
        initialNumToRender={10}
        onEndReachedThreshold={0.5}
        onEndReached={handleLoadMore}
        ListEmptyComponent={!newsFeedLoading && <EmptyState />}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollAnim}}}],
          {
            useNativeDriver: true,
          },
        )}
        refreshControl={
          <RefreshControl
            refreshing={newsFeedLoading}
            colors={theme.colors.gradient}
            tintColor={theme.colors.primary}
            onRefresh={handleRefresh}
            progressViewOffset={
              getStatusBarHeight() + getSize.h(HEADER_HEIGHT + 115)
            }
          />
        }
      />
      {hasNewFeed && (
        <Touchable
          onPress={() => handleGetFeed(1)}
          scalable
          style={styles.hasNewFeedWrap}>
          <Text variant="button">You have new feed!</Text>
        </Touchable>
      )}
      {/* {newsFeedLoading && <Loading dark fullscreen />} */}
    </Wrapper>
  );
};

const HeaderFunction = memo((props) => {
  return (
    <Paper animated style={props.style}>
      <Touchable onPress={props.onPresStatus} style={stylesMain.actionItem}>
        <Feather
          name="edit"
          color={props.theme.colors.tagTxt}
          size={getSize.f(20)}
        />
        <Text style={stylesMain.actionText}>Status</Text>
      </Touchable>
      <View style={stylesMain.actionDivider} />
      <Touchable onPress={props.onPresHangout} style={stylesMain.actionItem}>
        <Feather
          name="edit"
          color={props.theme.colors.primary}
          size={getSize.f(20)}
        />
        <Text style={[stylesMain.actionText, stylesMain.primary]}>Hangout</Text>
      </Touchable>

      <View style={stylesMain.actionDivider} />
      <Touchable onPress={props.onPresHelp} style={stylesMain.actionItem}>
        <Feather
          name="edit"
          color={props.theme.colors.secondary}
          size={getSize.f(20)}
        />
        <Text style={[stylesMain.actionText, stylesMain.secondary]}>Help</Text>
      </Touchable>
    </Paper>
  );
});

const FilterFunction = memo((props) => {
  return (
    <Paper animated style={props.style}>
      <ScrollView
        horizontal
        contentContainerStyle={stylesMain.filterContainer}
        showsHorizontalScrollIndicator={false}>
        {props.children}
      </ScrollView>
    </Paper>
  );
});

const stylesMain = StyleSheet.create({
  scrollWrap: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
  hangoutHead: {
    paddingHorizontal: getSize.w(24),
    borderBottomColor: orangeLight.colors.divider,
    borderBottomWidth: getSize.h(1),
    paddingVertical: getSize.h(15),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  hangoutCountWrap: {
    borderTopColor: orangeLight.colors.divider,
    borderTopWidth: getSize.h(1),
    borderBottomColor: orangeLight.colors.divider,
    borderBottomWidth: getSize.h(1),
  },
  separator: {
    height: getSize.h(20),
  },
  headerWrap: {zIndex: 2, elevation: 3},
  filterContainer: {
    paddingHorizontal: getSize.w(24),
  },
  filterItem: {
    marginRight: getSize.w(10),
  },
  actionItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  actionFirst: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: getSize.w(16),
    backgroundColor: orangeLight.colors.primary,
    marginRight: getSize.w(8),
    height: getSize.h(38),
    borderRadius: getSize.h(38 / 2),
  },
  actionDivider: {
    width: getSize.w(1.5),
    backgroundColor: orangeLight.colors.divider,
    height: getSize.h(44),
  },
  actionText: {
    fontSize: getSize.f(16),
    fontFamily: orangeLight.fonts.sfPro.medium,
    color: orangeLight.colors.tagTxt,
    marginLeft: getSize.w(4),
  },
  primary: {
    color: orangeLight.colors.primary,
  },
  secondary: {
    color: orangeLight.colors.secondary,
  },
  closeWrap: {
    zIndex: 21,
    top: -10,
    right: -10,
    position: 'absolute',
    backgroundColor: orangeLight.colors.secondary,
    width: getSize.w(24),
    height: getSize.w(24),
    borderRadius: getSize.w(24 / 2),
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default NewsFeedScreen;
