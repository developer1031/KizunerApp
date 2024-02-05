import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  FlatList,
  View,
  RefreshControl,
  Platform,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';

import useTheme from 'theme';
import {getSize} from 'utils/responsive';
import {
  Wrapper,
  Touchable,
  Text,
  HeaderBg,
  EmptyState,
  NotificationItem,
} from 'components';
import {FriendRequestItem} from 'screens/FriendRequests';
import {
  getFriendRequestList,
  getNotiList,
  showModalize,
  hideModalize,
  readNoti,
  deleteNoti,
  getNotiCount,
} from 'actions';

const NotificationScreen = ({navigation}) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();

  const {requestList, requestLastPage, requestLoading} = useSelector(
    (state) => state.contact,
  );
  const {list, listLoading, listLastPage, count} = useSelector(
    (state) => state.notification,
  );
  const [page, setPage] = useState(1);

  const handleGetList = (p = page) => {
    dispatch(getNotiList({page: p}));
  };

  const handleLoadMore = () => {
    if (page < listLastPage) {
      handleGetList(page + 1);
      setPage(page + 1);
    }
  };

  const handleRefresh = () => {
    setPage(1);
    handleGetList(1);
    setTimeout(() => {
      dispatch(getNotiCount());
    }, 1500);
  };

  useEffect(() => {
    dispatch(getFriendRequestList({page: 1}));
    handleGetList(1);
    dispatch(getNotiCount());
  }, []);

  const showOptions = () =>
    dispatch(
      showModalize([
        {
          label: 'Mark all as read',
          icon: (
            <MaterialCommunityIcons
              size={getSize.f(22)}
              color={theme.colors.primary}
              name="check-all"
            />
          ),
          onPress: () => {
            dispatch(hideModalize());
            dispatch(
              readNoti('', {
                success: async () => {
                  // if (Platform.OS === 'ios') {
                  //   const iosBadge = await firebase.notifications().getBadge();
                  //   firebase
                  //     .notifications()
                  //     .setBadge(iosBadge - count > 0 ? iosBadge - count : 0);
                  // }
                  handleRefresh();
                },
              }),
            );
          },
        },
        {
          label: 'Remove all',
          icon: (
            <MaterialCommunityIcons
              size={getSize.f(20)}
              color={theme.colors.primary}
              name="trash-can"
            />
          ),
          onPress: () => {
            dispatch(hideModalize());
            dispatch(
              deleteNoti('', {
                success: () => handleRefresh(),
              }),
            );
          },
        },
      ]),
    );

  const HEADER_HEIGHT = insets.top + 68;
  const styles = StyleSheet.create({
    wrapper: {flex: 1},
    scrollWrap: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      left: 0,
      top: getSize.h(HEADER_HEIGHT),
      backgroundColor: theme.colors.paper,
    },
    backBtn: {
      position: 'absolute',
      top: insets.top + getSize.h(20),
      left: getSize.w(24),
      zIndex: 1,
    },
    moreBtn: {
      position: 'absolute',
      top: insets.top + getSize.h(25),
      right: getSize.w(24),
      zIndex: 1,
    },
    headerTitle: {
      top: insets.top + getSize.h(26),
      textAlign: 'center',
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: getSize.h(57),
      borderBottomColor: theme.colors.divider,
      borderBottomWidth: getSize.h(1),
      paddingHorizontal: getSize.w(24),
    },
    sectionLabel: {
      fontSize: getSize.f(15),
      textTransform: 'uppercase',
      fontFamily: theme.fonts.sfPro.medium,
    },
    seeAllBtn: {
      color: theme.colors.primary,
      fontSize: getSize.f(15),
    },
    emptyState: {
      marginTop: getSize.h(100),
    },
  });

  function renderRequestItem({item}) {
    return <FriendRequestItem data={item} />;
  }

  function renderNotiItem({item}) {
    return <NotificationItem data={item} />;
  }

  return (
    <Wrapper style={styles.wrapper}>
      <HeaderBg noBorder height={HEADER_HEIGHT} />
      <Touchable onPress={navigation.goBack} style={styles.backBtn}>
        <MaterialCommunityIcons
          name="chevron-left"
          size={getSize.f(34)}
          color={theme.colors.textContrast}
        />
      </Touchable>
      <Text variant="header" style={styles.headerTitle}>
        Notification
      </Text>
      <Touchable style={styles.moreBtn} onPress={showOptions}>
        <MaterialCommunityIcons
          name="dots-vertical"
          size={getSize.f(24)}
          color={theme.colors.textContrast}
        />
      </Touchable>
      <FlatList
        data={list}
        showsVerticalScrollIndicator={false}
        style={styles.scrollWrap}
        refreshControl={
          <RefreshControl
            refreshing={requestLoading || listLoading}
            colors={theme.colors.gradient}
            tintColor={theme.colors.primary}
            onRefresh={handleRefresh}
          />
        }
        ListHeaderComponent={
          <>
            {requestList.length > 0 && (
              <FlatList
                data={requestList}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionLabel}>Friend requests</Text>
                    {requestLastPage > 1 && (
                      <Touchable
                        onPress={() => navigation.navigate('FriendRequests')}>
                        <Text style={styles.seeAllBtn}>See All</Text>
                      </Touchable>
                    )}
                  </View>
                }
                renderItem={renderRequestItem}
                keyExtractor={(item) => item?.id?.toString()}
              />
            )}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionLabel}>Previous</Text>
            </View>
          </>
        }
        renderItem={renderNotiItem}
        keyExtractor={(item) => item?.id?.toString()}
        onEndReachedThreshold={0.5}
        onEndReached={handleLoadMore}
        ListEmptyComponent={() =>
          !listLoading && <EmptyState wrapperStyle={styles.emptyState} />
        }
      />
    </Wrapper>
  );
};

export default NotificationScreen;
