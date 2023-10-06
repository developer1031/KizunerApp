import React, {useState} from 'react';
import {StyleSheet, View, FlatList, Dimensions} from 'react-native';
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
} from 'components';
import useTheme from 'theme';
import {getSize} from 'utils/responsive';
import {
  deleteMemberFromRoom,
  showModalize,
  hideModalize,
  showAlert,
} from 'actions';

const width = Dimensions.get('window').width;

const RoomMemberScreen = ({navigation, route}) => {
  const STATUS_BAR = getStatusBarHeight();
  const HEADER_HEIGHT = 89;
  const theme = useTheme();
  const insets = useSafeArea();
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.auth.userInfo);
  const {roomDetail} = useSelector((state) => state.chat);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState([]);
  const {type} = route.params;
  const hiddenRemove = type === 'location' || type === 'public_group';

  const showOptions = (user) =>
    dispatch(
      showModalize([
        {
          label: 'View Profile',
          icon: (
            <MaterialCommunityIcons
              size={getSize.f(22)}
              color={theme.colors.primary}
              name="account"
            />
          ),
          onPress: () => {
            dispatch(hideModalize());
            setTimeout(
              () =>
                userInfo?.id !== user.id &&
                navigation.push('UserProfile', {
                  userId: user.id,
                }),
              200,
            );
          },
        },
        // {
        //   label: 'Send Message',
        //   icon: (
        //     <MaterialCommunityIcons
        //       size={getSize.f(20)}
        //       color={theme.colors.primary}
        //       name="message-plus"
        //     />
        //   ),
        //   onPress: () => {
        //     dispatch(hideModalize());
        //     setTimeout(() => {}, 200);
        //   },
        // },
        {
          label: 'Remove From Group',
          icon: (
            <MaterialCommunityIcons
              size={getSize.f(20)}
              color={theme.colors.primary}
              name="account-remove"
            />
          ),
          onPress: () => {
            dispatch(hideModalize());
            setTimeout(() => {
              dispatch(
                deleteMemberFromRoom(
                  {roomId: roomDetail?.id, userId: user.id},
                  {
                    success: () =>
                      dispatch(
                        showAlert({
                          title: 'Success',
                          body: `You removed ${user.name} from group!`,
                          type: 'success',
                        }),
                      ),
                  },
                ),
              );
            }, 200);
          },
          hide: hiddenRemove,
        },
      ]),
    );

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
  });

  const lang = {
    title: 'Select Users',
    cancel: 'Cancel',
    people: 'People',
    done: 'Done',
  };

  function renderFriendItem({item}) {
    return (
      <Touchable
        disabled={item.id === userInfo?.id}
        onPress={() => showOptions(item)}
        style={styles.friendItemWrap}>
        <View style={styles.friendItemCon}>
          <View style={styles.friendItemMeta}>
            <Avatar source={{uri: item.avatar}} size="header" />
            <Text numberOfLines={1} style={styles.friendItemName}>
              {item.name}
            </Text>
          </View>
          {item.id !== userInfo?.id && (
            <View>
              <MaterialCommunityIcons
                name="dots-vertical"
                size={getSize.f(20)}
                color={theme.colors.tagTxt}
              />
            </View>
          )}
        </View>
      </Touchable>
    );
  }

  return (
    <Wrapper style={styles.wrapper}>
      <HeaderBg height={HEADER_HEIGHT} addSBHeight />
      <Text variant="header" style={styles.headerTitle}>
        Group Members
      </Text>
      <View style={styles.headerActions}>
        <Touchable onPress={() => navigation.goBack(null)}>
          <Text style={styles.headerBtn}>{lang.cancel}</Text>
        </Touchable>
        <Touchable onPress={() => navigation.navigate('AddChatMember')}>
          <Text style={styles.headerBtn}>Add</Text>
        </Touchable>
      </View>
      <View style={styles.actionWrap}>
        <SearchBar
          autoFocus={false}
          placeholder="Search"
          wrapperStyle={styles.searchBar}
          value={search}
          onChangeText={(value) => {
            setSearch(value);
          }}
        />
      </View>
      <FlatList
        style={styles.scrollWrap}
        contentContainerStyle={styles.scrollCon}
        data={roomDetail?.users || []}
        keyExtractor={(item) => item.id}
        renderItem={renderFriendItem}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => <EmptyState />}
      />
    </Wrapper>
  );
};

export default RoomMemberScreen;
