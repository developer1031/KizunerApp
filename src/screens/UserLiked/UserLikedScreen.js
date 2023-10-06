import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  FlatList,
  RefreshControl,
  View,
  Dimensions,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {useSelector, useDispatch} from 'react-redux';
import {useSafeArea} from 'react-native-safe-area-context';

import useTheme from 'theme';
import {getSize} from 'utils/responsive';
import {
  Wrapper,
  Touchable,
  Text,
  HeaderBg,
  EmptyState,
  Avatar,
} from 'components';
import {
  getUserLikeList,
  showModalize,
  hideModalize,
  sendFriendRequest,
} from 'actions';

const width = Dimensions.get('window').width;

const UserLikedScreen = ({navigation, route}) => {
  const {id} = route.params;
  const theme = useTheme();
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const userLike = useSelector((state) => state.feedDetail.like?.[id]);
  const userInfo = useSelector((state) => state.auth.userInfo);
  const insets = useSafeArea();

  const styles = StyleSheet.create({
    wrapper: {flex: 1},
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
    scrollWrap: {
      marginTop: getSize.h(58),
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollCon: {
      paddingBottom: getSize.h(20) + insets.bottom,
      flexGrow: 1,
    },
    itemWrapper: {
      paddingHorizontal: getSize.w(24),
      alignItems: 'flex-start',
      width,
    },
    itemContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottomWidth: getSize.h(1),
      borderBottomColor: theme.colors.divider,
      height: getSize.h(68),
      width: width - getSize.w(48),
    },
    itemUser: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      height: getSize.h(68),
    },
    itemLabel: {
      fontSize: getSize.f(17),
      fontFamily: theme.fonts.sfPro.medium,
      color: theme.colors.tagTxt,
      marginLeft: getSize.w(10),
    },
  });

  const handleGetList = (p = page) => {
    dispatch(getUserLikeList({page: p, id}));
  };

  const handleLoadMore = () => {
    if (page < userLike?.lastPage) {
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

  const showFriendOptions = (data) => {
    dispatch(
      showModalize([
        {
          label: 'Add friend',
          onPress: () => {
            dispatch(hideModalize());
            dispatch(sendFriendRequest(data, () => handleGetList()));
          },
          icon: (
            <MaterialCommunityIcons
              size={getSize.f(20)}
              color={theme.colors.primary}
              name="account-plus"
            />
          ),
        },
      ]),
    );
  };

  function renderItem({item}) {
    return (
      <Touchable
        disabled={userInfo?.id === item?.id}
        onPress={() => navigation.push('UserProfile', {userId: item?.id})}
        style={styles.itemWrapper}>
        <View style={styles.itemContainer}>
          <View style={styles.itemUser}>
            <Avatar size="header" source={{uri: item?.avatar}} />
            <Text style={styles.itemLabel}>{item?.name}</Text>
          </View>
          {!item?.is_friend && (
            <Touchable onPress={() => showFriendOptions(item)}>
              <MaterialCommunityIcons
                name="account-plus"
                color={theme.colors.primary}
                size={getSize.h(26)}
              />
            </Touchable>
          )}
        </View>
      </Touchable>
    );
  }

  return (
    <Wrapper style={styles.wrapper}>
      <HeaderBg noBorder height={68} addSBHeight />
      <Touchable onPress={navigation.goBack} style={styles.backBtn}>
        <MaterialCommunityIcons
          name="chevron-left"
          size={getSize.f(34)}
          color={theme.colors.textContrast}
        />
      </Touchable>
      <Text variant="header" style={styles.headerTitle}>
        People who liked
      </Text>
      <FlatList
        style={styles.scrollWrap}
        contentContainerStyle={styles.scrollCon}
        showsVerticalScrollIndicator={false}
        data={userLike?.list}
        ListHeaderComponent={
          userLike?.error && (
            <EmptyState label={userLike?.error?.message || userLike?.error} />
          )
        }
        keyExtractor={(i) => i.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={
          !userLike?.loading && !userLike?.error && <EmptyState />
        }
        onEndReached={handleLoadMore}
        refreshControl={
          <RefreshControl
            refreshing={userLike?.loading}
            colors={theme.colors.gradient}
            tintColor={theme.colors.primary}
            onRefresh={handleRefresh}
          />
        }
      />
    </Wrapper>
  );
};

export default UserLikedScreen;
