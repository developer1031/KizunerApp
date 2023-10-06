import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  FlatList,
  View,
  RefreshControl,
  Platform,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {useNavigation} from '@react-navigation/native';
import moment from 'moment';
import {useSelector, useDispatch} from 'react-redux';

import useTheme from 'theme';
import {getSize} from 'utils/responsive';
import {
  Wrapper,
  Touchable,
  Text,
  HeaderBg,
  Avatar,
  EmptyState,
} from 'components';
import {
  acceptFriendRequest,
  rejectFriendRequest,
  getFriendRequestList,
  getNotiCount,
} from 'actions';
import {checkIsAnyUnreadNotification} from 'utils/notificationService';

export const FriendRequestItem = ({data}) => {
  const theme = useTheme();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {requesting} = useSelector((state) => state.contact);
  const {userInfo} = useSelector((state) => state.auth);

  const styles = StyleSheet.create({
    wrapper: {
      paddingHorizontal: getSize.h(24),
      borderBottomColor: theme.colors.divider,
      borderBottomWidth: getSize.h(1),
      height: getSize.h(100),
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    container: {
      flexGrow: 1,
      justifyContent: 'space-between',
      marginLeft: getSize.w(16),
    },
    containerTop: {
      justifyContent: 'space-between',
      flexDirection: 'row',
      alignItems: 'center',
    },
    name: {
      fontSize: getSize.f(16),
      fontFamily: theme.fonts.sfPro.semiBold,
      color: theme.colors.tagTxt,
      flexGrow: 1,
      flex: 1,
    },
    date: {
      fontSize: getSize.f(12),
      color: theme.colors.text2,
    },
    containerBot: {
      flexDirection: 'row',
      marginTop: getSize.h(10),
    },
    actionBtn: {
      paddingHorizontal: getSize.w(24),
      height: getSize.w(30),
      borderRadius: getSize.w(30 / 2),
      justifyContent: 'center',
      alignItems: 'center',
    },
    confirmBtn: {
      backgroundColor: theme.colors.secondary,
      marginRight: getSize.w(11),
    },
    deleteBtn: {
      backgroundColor: theme.colors.tagBg,
    },
    confirmText: {
      color: theme.colors.textContrast,
    },
    deleteText: {
      color: theme.colors.tagTxt,
    },
    disabled: {
      opacity: 0.5,
    },
  });

  const handleConfirm = () => {
    dispatch(acceptFriendRequest(data.id, data.user.id));
    setTimeout(() => {
      dispatch(getNotiCount());
    }, 2000);
  };

  const handleDelete = () => {
    dispatch(rejectFriendRequest(data.id, data.user.id));
    setTimeout(() => {
      dispatch(getNotiCount());
    }, 2000);
  };

  async function reduceBadgeCount() {
    if (Platform.OS === 'ios') {
      checkIsAnyUnreadNotification(dispatch, userInfo?.id);
      // const iosBadge = await firebase.notifications().getBadge();
      // firebase.notifications().setBadge(iosBadge - 1 > 0 ? iosBadge : 0);
    }
  }

  const disabled = requesting.includes(data.user.id);
  return (
    <Touchable
      disabled={userInfo?.id === data.user.id}
      onPress={() => {
        navigation.push('UserProfile', {userId: data.user.id});
        reduceBadgeCount();
      }}
      style={styles.wrapper}>
      <Avatar size="medium" source={{uri: data.user.avatar || ''}} />
      <View style={styles.container}>
        <View style={styles.containerTop}>
          <Text numberOfLines={1} style={styles.name}>
            {data.user.name}
          </Text>
          <Text style={styles.date}>{moment(data.created_at).fromNow()}</Text>
        </View>
        <View style={[styles.containerBot, disabled && styles.disabled]}>
          <Touchable
            disabled={disabled}
            onPress={() => {
              handleConfirm();
              reduceBadgeCount();
            }}
            style={[styles.actionBtn, styles.confirmBtn]}>
            <Text style={styles.confirmText}>Confirm</Text>
          </Touchable>
          <Touchable
            disabled={disabled}
            onPress={() => {
              handleDelete();
              reduceBadgeCount();
            }}
            style={[styles.actionBtn, styles.deleteBtn]}>
            <Text style={styles.deleteText}>Delete</Text>
          </Touchable>
        </View>
      </View>
    </Touchable>
  );
};

const FriendRequestsScreen = ({navigation}) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const {requestList, requestLoading, requestLastPage, requestError} =
    useSelector((state) => state.contact);
  const [page, setPage] = useState(1);

  const handleGetList = (p = page) => {
    dispatch(getFriendRequestList({page: p}));
  };

  const handleLoadMore = () => {
    if (page < requestLastPage) {
      handleGetList(page + 1);
      setPage(page + 1);
    }
  };

  const handleRefresh = () => {
    setPage(1);
    handleGetList(1);
  };

  useEffect(() => {
    handleGetList(1);
  }, []);

  const HEADER_HEIGHT = getStatusBarHeight() + 68;
  const styles = StyleSheet.create({
    wrapper: {flex: 1},
    scrollWrap: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      left: 0,
      top: getSize.h(HEADER_HEIGHT),
    },
    backBtn: {
      position: 'absolute',
      top: getStatusBarHeight() + getSize.h(20),
      left: getSize.w(24),
      zIndex: 1,
    },
    headerTitle: {
      top: getStatusBarHeight() + getSize.h(26),
      textAlign: 'center',
    },
    emptyState: {
      marginTop: getSize.h(100),
    },
  });

  function renderItem({item}) {
    return <FriendRequestItem data={item} />;
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
        Friend Requests
      </Text>
      <FlatList
        data={requestList}
        style={styles.scrollWrap}
        showsVerticalScrollIndicator={false}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl
            refreshing={requestLoading}
            colors={theme.colors.gradient}
            tintColor={theme.colors.primary}
            onRefresh={handleRefresh}
          />
        }
        ListEmptyComponent={
          !requestLoading && <EmptyState wrapperStyle={styles.emptyState} />
        }
        onEndReached={handleLoadMore}
      />
    </Wrapper>
  );
};

export default FriendRequestsScreen;
