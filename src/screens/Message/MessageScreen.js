import React, {useEffect, useRef, useState, memo, useMemo} from 'react';
import {
  Animated,
  Platform,
  RefreshControl,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {useDispatch, useSelector} from 'react-redux';
import {useIsFocused, useScrollToTop} from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import {debounce} from 'lodash';

import useTheme from 'theme';
import {
  EmptyState,
  Header,
  SearchBar,
  Text,
  Touchable,
  Wrapper,
} from 'components';
import MessageItem, {PlaceholderItem} from 'components/MessageItem';
import {getSize} from 'utils/responsive';
import {listChatRoom} from 'actions';
import {useDebouncedSearch} from 'utils/debounceSearch';
import {View} from 'react-native';
const HEADER_HEIGHT = 89;
import orangeLight from '../../theme/orangeLight';
import ChatUnseenBadge from 'components/ChatUnseenBadge';

const width = Dimensions.get('window').width;

const isEqualChatItem = (prevProps, nextProps) => {
  return (
    prevProps?.id === nextProps?.id &&
    prevProps?.last_message?.data === nextProps?.last_message?.data
  );
};

const MemoMessageItem = memo(MessageItem, isEqualChatItem);

const MessageScreen = ({navigation, route}) => {
  const theme = useTheme();
  const [scrollAnim] = useState(new Animated.Value(0));

  const {messageList, messageLastPage, messageLoading, reset, typeChat} =
    useSelector((state) => state.chat);
  const userInfo = useSelector((state) => state.auth.userInfo);
  const dispatch = useDispatch();
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const listRef = useRef(null);
  const [allowLoadMore, setAllowLoadMore] = useState(false);
  const [activeChat, setActiveChat] = useState(1);
  useEffect(() => {
    if (reset) {
      setActiveChat(typeChat);
      setPage(1);
      setQuery('');
    }
  }, [reset]);
  useScrollToTop(listRef);

  const {setInputText} = useDebouncedSearch((value) => {
    handleLoadListChat(1, value, activeChat);
  }, 300);

  const handleLoadListChat = (p = page, q = query, t = activeChat, callback) =>
    dispatch(listChatRoom({page: p, query: q, type: t}, callback));

  const isFocused = useIsFocused();
  useEffect(() => {
    if (!isFocused || query.length) {
      return;
    }

    const interval = setInterval(handleLoadListChat, 10000);

    return () => {
      clearInterval(interval);
    };
  }, [activeChat, isFocused, query]);

  const handleLoadMore = () => {
    if (!allowLoadMore) {
      return;
    }
    if (page < messageLastPage) {
      handleLoadListChat(page + 1);
      setPage(page + 1);
    }
  };

  const handleRefresh = () => {
    setPage(1);
    handleLoadListChat(1, query, activeChat, {
      success: () =>
        listRef?.current?.getNode().scrollToOffset({offset: -TOP_INSET}),
    });
  };

  // useEffect(() => {
  //   handleLoadListChat(1, '', activeChat, {
  //     success: () => {
  //       listRef?.current?.getNode().scrollToOffset({offset: -TOP_INSET})
  //       setAllowLoadMore(true)
  //     },
  //   })
  // }, [])

  function renderMessageItem({item, index}) {
    if (
      // item.type === 'personal' &&
      !item.last_message?.data
      //&& item.users?.find(item => item.id !== userInfo?.id).is_fake === 1
    ) {
      return null;
    }
    return <MessageItem data={item} />;
  }

  const TOP_INSET =
    Platform.OS === 'ios'
      ? getStatusBarHeight() + getSize.h(HEADER_HEIGHT + 24)
      : 0;

  const headerOpacity = scrollAnim.interpolate({
    inputRange: [-TOP_INSET, getSize.h(60)],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const headerTranslate = scrollAnim.interpolate({
    inputRange: [-TOP_INSET, getSize.h(60)],
    outputRange: [0, -getSize.h(21)],
    extrapolate: 'clamp',
  });

  const searchTranslate = scrollAnim.interpolate({
    inputRange: [-TOP_INSET, getSize.h(60)],
    outputRange: [0, -getSize.h(HEADER_HEIGHT - 48 / 2 - 10)],
    extrapolate: 'clamp',
  });

  function onSetActive(index) {
    if (index === activeChat) return;
    setActiveChat(index);
    //layoutAnimated();
    setPage(1);
    handleLoadListChat(1, query, index, {
      success: () =>
        listRef?.current?.getNode().scrollToOffset({offset: -TOP_INSET}),
    });
  }

  const headerListMessage = useMemo(() => {
    return (
      <View style={styles.tabWrap}>
        <Touchable
          onPress={() => onSetActive(1)}
          style={[styles.tabItem, activeChat === 1 && styles.tabItemActive]}>
          <Text
            style={[
              styles.tabLabel,
              activeChat === 1 && styles.tabLabelActive,
            ]}>
            Users
          </Text>
          <ChatUnseenBadge type="single" />
        </Touchable>

        <Touchable
          onPress={() => onSetActive(2)}
          style={[styles.tabItem, activeChat === 2 && styles.tabItemActive]}>
          <Text
            style={[
              styles.tabLabel,
              activeChat === 2 && styles.tabLabelActive,
            ]}>
            Groups
          </Text>

          <ChatUnseenBadge type="group" />
        </Touchable>
        {/* <Touchable
          onPress={() => onSetActive(3)}
          style={[styles.tabItem, activeChat === 3 && styles.tabItemActive]}>
          <Text
            style={[
              styles.tabLabel,
              activeChat === 3 && styles.tabLabelActive,
            ]}>
            Nearby
          </Text>
        </Touchable> */}
      </View>
    );
  }, [activeChat]);

  return (
    <Wrapper style={styles.wrapper}>
      <Header
        addSBHeight
        wrapperStyle={styles.headerWrap}
        animatedStyle={{opacity: headerOpacity}}
        bgAnimatedStyle={{transform: [{translateY: headerTranslate}]}}
        height={HEADER_HEIGHT}
      />
      <Animated.View
        style={[
          styles.actionWrap,
          {transform: [{translateY: searchTranslate}]},
        ]}>
        <SearchBar
          autoFocus={false}
          placeholder="Search User, group"
          wrapperStyle={styles.searchBar}
          value={query}
          onChangeText={(value) => {
            setQuery(value);
            handleLoadListChat(1, value, activeChat);
            //setQuery(value);
            //setInputText(value);
          }}
          onClear={
            Boolean(query)
              ? () => {
                  setQuery('');
                  handleLoadListChat(1, '', activeChat);
                }
              : null
          }
        />
      </Animated.View>

      <Touchable
        scalable
        onPress={() => {
          navigation.navigate('AddChatMember');
        }}
        style={styles.floatAction}>
        <Feather
          name="edit-3"
          color={theme.colors.textContrast}
          size={getSize.f(22)}
        />
      </Touchable>

      <Animated.FlatList
        ListHeaderComponent={headerListMessage}
        ref={listRef}
        data={messageList}
        renderItem={renderMessageItem}
        keyExtractor={(i) => i.id}
        showsVerticalScrollIndicator={false}
        style={styles.scrollWrap}
        contentContainerStyle={styles.scrollContainer}
        contentInset={{top: TOP_INSET}}
        ListEmptyComponent={
          !messageLoading ? (
            <EmptyState
              label="No conversation"
              wrapperStyle={styles.emptyWrap}
            />
          ) : (
            <>
              <PlaceholderItem />
              <PlaceholderItem />
              <PlaceholderItem />
            </>
          )
        }
        // ListFooterComponent={
        //   messageLoading && (
        //     <>
        //       <PlaceholderItem />
        //       <PlaceholderItem />
        //       <PlaceholderItem />
        //     </>
        //   )
        // }
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollAnim}}}],
          {useNativeDriver: false},
        )}
        // refreshControl={
        //   <RefreshControl
        //     refreshing={messageLoading}
        //     colors={theme.colors.gradient}
        //     tintColor={theme.colors.primary}
        //     onRefresh={handleRefresh}
        //     progressViewOffset={
        //       getStatusBarHeight() + getSize.h(HEADER_HEIGHT + 24)
        //     }
        //   />
        // }
        onEndReachedThreshold={0.5}
        onEndReached={handleLoadMore}
      />
    </Wrapper>
  );
};

const styles = StyleSheet.create({
  wrapper: {flex: 1},
  scrollWrap: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
    backgroundColor: orangeLight.colors.paper,
  },
  scrollContainer: {
    paddingBottom: getSize.h(20),
    paddingTop:
      Platform.OS === 'android'
        ? getStatusBarHeight() + getSize.h(HEADER_HEIGHT + 48 / 2)
        : 0,
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
  statusFilter: {
    justifyContent: 'flex-end',
    paddingBottom: getSize.h(20),
    marginBottom: getSize.h(20),
    paddingTop: getSize.h(90),
  },
  filterContainer: {
    paddingHorizontal: getSize.w(24),
  },
  filterItem: {
    marginRight: getSize.w(10),
  },
  actionWrap: {
    position: 'absolute',
    left: getSize.w(24),
    right: getSize.w(24),
    top: getStatusBarHeight() + getSize.h(HEADER_HEIGHT - 48 / 2),
    zIndex: 3,
    elevation: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  actionDivider: {
    width: getSize.w(1.5),
    backgroundColor: orangeLight.colors.divider,
    height: getSize.h(44),
  },
  actionText: {
    fontSize: getSize.f(17),
    fontFamily: orangeLight.fonts.sfPro.medium,
    color: orangeLight.colors.tagTxt,
    marginLeft: getSize.w(10),
  },
  primary: {
    color: orangeLight.colors.primary,
  },
  newChat: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  newChatTxt: {
    fontSize: getSize.f(17),
    color: orangeLight.colors.textContrast,
    marginRight: getSize.w(5),
  },
  searchBar: {flex: 1},
  emptyWrap: {
    marginVertical: getSize.h(50),
  },
  floatAction: {
    position: 'absolute',
    zIndex: 1000,
    bottom: getSize.w(28),
    right: getSize.w(28),
    width: getSize.w(50),
    height: getSize.w(50),
    backgroundColor: orangeLight.colors.primary,
    borderRadius: getSize.w(25),
    justifyContent: 'center',
    alignItems: 'center',
  },
  contextChangeChat: {
    height: getSize.h(45),
    flex: 1,
    paddingHorizontal: getSize.w(24),
    marginVertical: getSize.h(16),
  },
  contextChild: {
    flex: 1,
    backgroundColor: orangeLight.colors.grayLight,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: getSize.w(22),
  },
  itemChange: {
    flex: 1,
    borderRadius: getSize.w(22),
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textItem: {
    fontSize: getSize.f(14),
    color: orangeLight.colors.textContrast,
    fontFamily: orangeLight.fonts.sfPro.bold,
  },
  itemActive: {
    backgroundColor: 'rgb(255,95,109)',
  },

  tabItem: {
    height: getSize.h(38),
    borderRadius: getSize.h(38 / 2),
    backgroundColor: orangeLight.colors.tagBg,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: width / 3 - getSize.w(24 + 6),
    marginRight: getSize.w(10),
  },
  tabItemActive: {
    backgroundColor: orangeLight.colors.secondary,
  },
  tabLabel: {
    fontFamily: orangeLight.fonts.sfPro.regular,
    color: orangeLight.colors.text,
  },
  tabLabelActive: {
    fontFamily: orangeLight.fonts.sfPro.regular,
    color: orangeLight.colors.textContrast,
  },
  tabWrap: {
    flexDirection: 'row',
    paddingVertical: getSize.h(14),
    paddingHorizontal: getSize.w(24),
    alignItems: 'center',
    // justifyContent: 'space-between',
    backgroundColor: orangeLight.colors.paper,
    //...orangeLight.shadow.large.ios,
    //...orangeLight.shadow.large.android,
  },
});

export default MessageScreen;
