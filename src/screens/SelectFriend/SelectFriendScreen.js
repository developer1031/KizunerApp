import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  Dimensions,
  RefreshControl,
} from 'react-native';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {useSelector, useDispatch} from 'react-redux';
import {useSafeArea} from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {
  Wrapper,
  HeaderBg,
  Text,
  Touchable,
  SearchBar,
  Avatar,
  EmptyState,
  Loading,
} from 'components';
import useTheme from 'theme';
import {getSize} from 'utils/responsive';
import {getFriendList, getFollowerList, getFollowingList} from 'actions';
import debounce from 'utils/debounce';
import lodash from 'lodash';

const width = Dimensions.get('window').width;

const SelectFriendScreen = ({navigation, route}) => {
  const STATUS_BAR = getStatusBarHeight();
  const HEADER_HEIGHT = 89;
  const theme = useTheme();
  const insets = useSafeArea();
  const dispatch = useDispatch();
  const {beingCreateRoom, beingSendMessage} = useSelector(
    (state) => state.chat,
  );
  const following = useSelector((state) => state.contact.following?.me);
  const follower = useSelector((state) => state.contact.follower?.me);
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(1);
  const {sendLabel, onSend} = route.params;

  function handleLoadList(p, query) {
    dispatch(getFollowerList({page: p, query}));
    dispatch(getFollowingList({page: p, query}));
  }

  function handleLoadMore() {
    if (page < following?.lastPage || page < follower?.lastPage) {
      handleLoadList(page + 1);
      setPage(page + 1);
    }
  }

  const handleRefresh = () => {
    setPage(1);
    handleLoadList(1);
  };

  function handleSearch(value) {
    setPage(1);
    debounce(handleLoadList(1, value), 300);
  }

  useEffect(() => {
    handleLoadList(1);
  }, []);

  const styles = StyleSheet.create({
    wrapper: {flex: 1},
    headerBg: {zIndex: 1},
    headerTitle: {
      top: STATUS_BAR + getSize.h(25),
      textAlign: 'center',
      left: 0,
      right: 0,
      position: 'absolute',
      zIndex: 1,
    },
    headerActions: {
      position: 'absolute',
      top: STATUS_BAR + getSize.h(25),
      left: getSize.w(24),
      right: getSize.w(24),
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      zIndex: 1,
    },
    headerBtn: {
      fontSize: getSize.f(16),
      fontFamily: theme.fonts.sfPro.medium,
      color: theme.colors.textContrast,
    },
    scrollWrap: {
      flex: 1,
      zIndex: 2,
      marginTop: STATUS_BAR + getSize.h(HEADER_HEIGHT + 25),
    },
    scrollCon: {
      paddingBottom: getSize.h(40 + 48) + insets.bottom,
    },
    searchContainer: {
      position: 'absolute',
      paddingTop: STATUS_BAR + getSize.h(10),
      paddingBottom: getSize.h(10),
      paddingHorizontal: getSize.w(24),
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      zIndex: 10,
    },
    searchWrap: {
      marginRight: getSize.w(10),
      flexGrow: 1,
    },
    headerWrap: {
      paddingTop: getSize.h(15),
      paddingBottom: getSize.h(20),
    },
    selectedWrap: {
      // paddingBottom: getSize.h(20),
    },
    selectedCon: {
      paddingHorizontal: getSize.w(24),
    },
    selectedItem: {
      alignItems: 'center',
      marginRight: getSize.w(14),
      width: getSize.w(60),
      marginBottom: getSize.h(20),
    },
    unselectBtn: {
      position: 'absolute',
      backgroundColor: theme.colors.offerStatus.rejected,
      width: getSize.h(20),
      height: getSize.h(20),
      borderRadius: getSize.h(20 / 2),
      justifyContent: 'center',
      alignItems: 'center',
      right: getSize.w(0),
      top: getSize.h(0),
    },
    selectedAvatar: {
      marginBottom: getSize.h(7),
    },
    peopleTitle: {
      marginHorizontal: getSize.w(24),
      textTransform: 'uppercase',
      color: theme.colors.primary,
      fontSize: getSize.f(15),
      fontFamily: theme.fonts.sfPro.medium,
    },
    friendItemWrap: {
      height: getSize.h(68),
      paddingHorizontal: getSize.w(24),
    },
    friendItemCon: {
      borderTopWidth: 1,
      borderTopColor: theme.colors.divider,
      height: getSize.h(68),
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    friendItemMeta: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    checkIcon: {
      width: getSize.h(22),
      height: getSize.h(22),
      borderRadius: getSize.h(22 / 2),
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.colors.primary,
    },
    checkIconActive: {
      borderWidth: 0,
      backgroundColor: theme.colors.primary,
    },
    friendItemName: {
      marginLeft: getSize.w(10),
      fontFamily: theme.fonts.sfPro.medium,
      fontSize: getSize.f(17),
      color: theme.colors.tagTxt,
      width: width - getSize.w(48 + 20 + 22 + 40),
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
    searchBar: {flex: 1},
    disabled: {
      opacity: 0.3,
    },
  });

  const lang = {
    title: 'Select Users',
    cancel: 'Cancel',
    people: 'People',
    done: 'Done',
  };

  const followingList = following?.list?.map((item) => item.user) || [];
  const followerList = follower?.list?.map((item) => item.user) || [];
  const DATA = lodash.uniqBy([...followingList, ...followerList], (e) => e.id);

  function renderFriendItem({item}) {
    return (
      <Touchable
        scalable
        onPress={() =>
          setSelected(
            selected.find((i) => i === item.id)
              ? selected.filter((i) => i !== item.id)
              : [...selected, item.id],
          )
        }
        style={styles.friendItemWrap}>
        <View style={styles.friendItemCon}>
          <View style={styles.friendItemMeta}>
            <Avatar source={{uri: item.avatar}} size="header" />
            <Text numberOfLines={1} style={styles.friendItemName}>
              {item.name}
            </Text>
          </View>
          <View
            style={[
              styles.checkIcon,
              selected.includes(item.id) && styles.checkIconActive,
            ]}>
            {selected.includes(item.id) && (
              <MaterialCommunityIcons
                name="check"
                color={theme.colors.textContrast}
                size={getSize.f(16)}
              />
            )}
          </View>
        </View>
      </Touchable>
    );
  }

  function handleSend() {
    onSend && onSend(selected);
  }

  return (
    <Wrapper style={styles.wrapper}>
      <HeaderBg height={HEADER_HEIGHT} addSBHeight />
      <Text variant="header" style={styles.headerTitle}>
        {lang.title}
      </Text>
      <View style={styles.headerActions}>
        <Touchable onPress={() => navigation.goBack(null)}>
          <Text style={styles.headerBtn}>{lang.cancel}</Text>
        </Touchable>
        <Touchable disabled={selected.length === 0} onPress={handleSend}>
          <Text
            style={[
              styles.headerBtn,
              selected.length === 0 && styles.disabled,
            ]}>
            {sendLabel}
          </Text>
        </Touchable>
      </View>
      <View style={styles.actionWrap}>
        <SearchBar
          autoFocus={false}
          placeholder="Search user"
          wrapperStyle={styles.searchBar}
          onChangeText={handleSearch}
        />
      </View>
      <FlatList
        style={styles.scrollWrap}
        contentContainerStyle={styles.scrollCon}
        data={DATA}
        keyExtractor={(item) => item.id}
        renderItem={renderFriendItem}
        showsVerticalScrollIndicator={false}
        onEndReached={handleLoadMore}
        ListEmptyComponent={() => <EmptyState />}
        refreshControl={
          <RefreshControl
            refreshing={following?.loading || follower?.loading}
            colors={theme.colors.gradient}
            tintColor={theme.colors.primary}
            onRefresh={handleRefresh}
          />
        }
      />
      {(beingCreateRoom || beingSendMessage.length > 0) && (
        <Loading fullscreen />
      )}
    </Wrapper>
  );
};

export default SelectFriendScreen;
