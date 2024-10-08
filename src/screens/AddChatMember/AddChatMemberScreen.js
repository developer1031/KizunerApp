import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  ScrollView,
  Dimensions,
  RefreshControl,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useSelector, useDispatch} from 'react-redux';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {
  Wrapper,
  HeaderBg,
  Text,
  Touchable,
  SearchBar,
  Avatar,
  Button,
  EmptyState,
} from 'components';
import useTheme from 'theme';
import {getSize} from 'utils/responsive';
import {
  getFriendList,
  getFollowingList,
  getFollowerList,
  createChatRoom,
  addMemberToRoom,
  showAlert,
} from 'actions';
import debounce from 'utils/debounce';
import lodash from 'lodash';

const width = Dimensions.get('window').width;

const AddChatMemberScreen = ({navigation}) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const STATUS_BAR = insets.top;
  const HEADER_HEIGHT = 68;

  const dispatch = useDispatch();
  const following = useSelector((state) => state.contact.following?.me);
  const follower = useSelector((state) => state.contact.follower?.me);

  const {beingCreateRoom, roomDetail, beingAddMember} = useSelector(
    (state) => state.chat,
  );
  const [showSearch, setShowSearch] = useState(false);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(1);

  function handleDone() {
    if (roomDetail) {
      dispatch(
        addMemberToRoom(
          {
            roomId: roomDetail.id,
            members: selected,
          },
          {
            success: () => {
              navigation.goBack();
              dispatch(
                showAlert({
                  title: 'Success',
                  type: 'success',
                  body: 'New members added!',
                }),
              );
            },
          },
        ),
      );
    } else {
      dispatch(createChatRoom({members: selected}));
    }
  }

  function handleLoadList(p, query = search) {
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
    setSearch(value);
    debounce(handleLoadList(1, value), 300);
  }

  useEffect(() => {
    handleLoadList(1);
  }, []);

  const styles = StyleSheet.create({
    wrapper: {flex: 1},
    headerBg: {zIndex: 1},
    headerTitle: {
      top: STATUS_BAR + getSize.h(26),
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
      marginTop: STATUS_BAR + getSize.h(HEADER_HEIGHT),
    },
    scrollCon: {
      paddingBottom: getSize.h(40 + 48) + insets.bottom,
      paddingTop: getSize.h(10),
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
    bottomWrap: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      paddingTop: getSize.h(20),
      paddingBottom: getSize.h(20) + insets.bottom,
      paddingHorizontal: getSize.w(24),
      backgroundColor: theme.colors.paper,
      zIndex: 10,
      ...theme.shadow.large.ios,
      ...theme.shadow.large.android,
    },
  });

  const lang = {
    title: 'Add Members',
    cancel: 'Cancel',
    people: 'People',
    done: 'Done',
  };

  const followingList = following?.list?.map((item) => item.user) || [];
  const followerList = follower?.list?.map((item) => item.user) || [];
  const DATA = lodash.uniqBy([...followingList, ...followerList], (e) => e.id);

  function renderListHeader() {
    return (
      <View style={styles.headerWrap}>
        {selected.length > 0 && (
          <ScrollView
            horizontal
            style={styles.selectedWrap}
            contentContainerStyle={styles.selectedCon}
            showsHorizontalScrollIndicator={false}>
            {selected.map((id) => {
              const user = DATA.find((i) => i.id === id);
              if (!user) {
                return null;
              }
              return (
                <View style={styles.selectedItem} key={id}>
                  <Avatar
                    size="medium"
                    source={{uri: user.avatar}}
                    style={styles.selectedAvatar}
                    renderExtra={() =>
                      !roomDetail && (
                        <Touchable
                          scalable
                          style={styles.unselectBtn}
                          onPress={() =>
                            setSelected(selected.filter((i) => i !== id))
                          }>
                          <MaterialCommunityIcons
                            name="close"
                            color={theme.colors.textContrast}
                            size={getSize.f(16)}
                          />
                        </Touchable>
                      )
                    }
                  />
                  <Text numberOfLines={1} color={theme.colors.tagTxt}>
                    {user.name}
                  </Text>
                </View>
              );
            })}
          </ScrollView>
        )}
        <Text style={styles.peopleTitle}>{lang.people}</Text>
      </View>
    );
  }

  function renderFriendItem({item}) {
    const isSelected = selected.find((i) => i === item.id);
    if (roomDetail?.users && roomDetail?.users?.find((i) => i.id === item.id)) {
      return null;
    }
    return (
      <Touchable
        scalable
        onPress={() =>
          isSelected
            ? setSelected(selected.filter((i) => i !== item.id))
            : setSelected([...selected, item.id])
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
            style={[styles.checkIcon, isSelected && styles.checkIconActive]}>
            {isSelected && (
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

  return (
    <Wrapper style={styles.wrapper}>
      <HeaderBg
        height={HEADER_HEIGHT}
        style={styles.headerBg}
        addSBHeight
        noBorder
      />
      {showSearch ? (
        <View style={styles.searchContainer}>
          <SearchBar
            wrapperStyle={styles.searchWrap}
            placeholder="Search user"
            value={search}
            onChangeText={handleSearch}
            autoFocus
            onClear={() => handleSearch('')}
          />
          <Touchable onPress={() => setShowSearch(false)}>
            <Text style={styles.headerBtn}>{lang.cancel}</Text>
          </Touchable>
        </View>
      ) : (
        <>
          <Text variant="header" style={styles.headerTitle}>
            {lang.title}
          </Text>
          <View style={styles.headerActions}>
            <Touchable onPress={navigation.goBack}>
              <Text style={styles.headerBtn}>{lang.cancel}</Text>
            </Touchable>
            <Touchable onPress={() => setShowSearch(true)}>
              <SimpleLineIcons
                name="magnifier"
                color={theme.colors.textContrast}
                size={getSize.f(22)}
              />
            </Touchable>
          </View>
        </>
      )}
      <FlatList
        style={styles.scrollWrap}
        contentContainerStyle={styles.scrollCon}
        ListHeaderComponent={renderListHeader}
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
      <View style={styles.bottomWrap}>
        <Button
          loading={roomDetail ? beingAddMember : beingCreateRoom}
          onPress={handleDone}
          fullWidth
          title={roomDetail ? 'Add Members' : lang.done}
          disabled={!selected.length}
        />
      </View>
    </Wrapper>
  );
};

export default AddChatMemberScreen;
