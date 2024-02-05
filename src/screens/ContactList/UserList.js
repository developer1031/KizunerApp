import React, {useState, useEffect} from 'react';
import {
  FlatList,
  StyleSheet,
  View,
  RefreshControl,
  Dimensions,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {
  Placeholder,
  PlaceholderLine,
  PlaceholderMedia,
  Fade,
} from 'rn-placeholder';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {getFriendList, getFollowerList, getFollowingList} from 'actions';
import {EmptyState, Touchable, Avatar, Text} from 'components';
import useTheme from 'theme';
import {getSize} from 'utils/responsive';

const {width, height} = Dimensions.get('window');

const UserList = ({route, navigation}) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const {userId, tab} = route.params;
  const insets = useSafeAreaInsets();
  const [page, setPage] = useState(1);
  const userInfo = useSelector((state) => state.auth.userInfo);
  const search = useSelector((state) => state.contact.search[userId]);

  let type = 'friend';

  if (tab === 'friends') {
    type = 'friend';
  } else if (tab === 'followings') {
    type = 'following';
  } else if (tab === 'followers') {
    type = 'follower';
  }

  const contact = useSelector((state) => state.contact[type]);

  const data = contact?.[userId || 'me'];

  const list = data?.list;
  const loading = data?.loading;
  const lastPage = data?.lastPage;
  const error = data?.error;

  const styles = StyleSheet.create({
    scrollWrap: {
      zIndex: -100,
      backgroundColor: theme.colors.background,
      flex: 1,
      flexGrow: 1,
      height: height - (insets.top + getSize.h(97 + 50)),
    },
    scrollCon: {
      paddingBottom: getSize.h(70) + insets.bottom,
    },
    itemWrapper: {
      paddingHorizontal: getSize.w(24),
      alignItems: 'flex-start',
    },
    itemContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      borderBottomWidth: getSize.h(1),
      borderBottomColor: theme.colors.divider,
      height: getSize.h(68),
    },
    itemLabel: {
      fontSize: getSize.f(17),
      fontFamily: theme.fonts.sfPro.medium,
      color: theme.colors.tagTxt,
      marginLeft: getSize.w(10),
      width: width - getSize.w(48 + 10 + 40),
    },
    avatarPlace: {
      height: getSize.h(40),
      width: getSize.h(40),
      borderRadius: getSize.h(40 / 2),
    },
    labelPlace: {
      marginLeft: getSize.w(10),
      width: width - getSize.w(48 + 10 + 40),
      paddingTop: getSize.h(10),
    },
  });

  const handleGetList = (p = page) => {
    if (type === 'friend') {
      dispatch(getFriendList({page: p, userId, query: search}));
    } else if (type === 'following') {
      dispatch(getFollowingList({page: p, userId, query: search}));
    } else if (type === 'follower') {
      dispatch(getFollowerList({page: p, userId, query: search}));
    }
  };

  const handleLoadMore = () => {
    if (page < lastPage) {
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

  useEffect(() => {
    handleGetList();
  }, [search]);

  function renderItem({item}) {
    return (
      <Touchable
        onPress={() =>
          userInfo?.id !== item?.user?.id &&
          navigation.push('UserProfile', {userId: item?.user?.id})
        }
        style={styles.itemWrapper}>
        <View style={styles.itemContainer}>
          <Avatar size="header" source={{uri: item?.user?.avatar}} />
          <Text numberOfLines={1} style={styles.itemLabel}>
            {item?.user?.name}
          </Text>
        </View>
      </Touchable>
    );
  }

  return (
    <FlatList
      style={styles.scrollWrap}
      contentContainerStyle={styles.scrollCon}
      showsVerticalScrollIndicator={false}
      data={list}
      keyExtractor={(i) => i.id}
      renderItem={renderItem}
      ListEmptyComponent={
        !loading ? (
          <EmptyState label={typeof error === 'string' && error} />
        ) : (
          <Placeholder Animation={Fade}>
            <View style={styles.itemWrapper}>
              <View style={styles.itemContainer}>
                <PlaceholderMedia style={styles.avatarPlace} />
                <View style={styles.labelPlace}>
                  <PlaceholderLine width={50} height={15} />
                </View>
              </View>
            </View>
            <View style={styles.itemWrapper}>
              <View style={styles.itemContainer}>
                <PlaceholderMedia style={styles.avatarPlace} />
                <View style={styles.labelPlace}>
                  <PlaceholderLine width={50} height={15} />
                </View>
              </View>
            </View>
            <View style={styles.itemWrapper}>
              <View style={styles.itemContainer}>
                <PlaceholderMedia style={styles.avatarPlace} />
                <View style={styles.labelPlace}>
                  <PlaceholderLine width={50} height={15} />
                </View>
              </View>
            </View>
          </Placeholder>
        )
      }
      onEndReached={handleLoadMore}
      refreshControl={
        <RefreshControl
          refreshing={loading}
          colors={theme.colors.gradient}
          tintColor={theme.colors.primary}
          onRefresh={handleRefresh}
        />
      }
    />
  );
};

export default UserList;
