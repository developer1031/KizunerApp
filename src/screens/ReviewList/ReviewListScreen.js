import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  FlatList,
  RefreshControl,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSelector, useDispatch} from 'react-redux';
import moment from 'moment';
import {
  Placeholder,
  PlaceholderMedia,
  PlaceholderLine,
  Fade,
} from 'rn-placeholder';

import useTheme from 'theme';
import {getSize} from 'utils/responsive';
import {
  Wrapper,
  Paper,
  HeaderBg,
  Text,
  Touchable,
  Avatar,
  Rating,
  EmptyState,
} from 'components';
import {getUserRating} from 'actions';

const width = Dimensions.get('window').width;

const ReviewListScreen = ({navigation, route}) => {
  const theme = useTheme();
  const HEADER_HEIGHT = 120;
  const {user} = route.params;
  const [page, setPage] = useState(1);
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.auth.userInfo);
  const thisUser = user || userInfo;
  const rating = useSelector((state) => state.rating?.data?.[thisUser?.id]);
  const insets = useSafeAreaInsets();

  function handleLoadList(p = page) {
    dispatch(getUserRating({id: thisUser?.id, page: p}));
  }

  function handleRefresh() {
    setPage(1);
    handleLoadList(1);
  }

  function handleLoadMore() {
    if (page < rating?.lastPage) {
      handleLoadList(page + 1);
      setPage(page + 1);
    }
  }

  useEffect(() => {
    handleLoadList();
  }, []);

  const styles = StyleSheet.create({
    wrapper: {flex: 1},
    scrollWrap: {marginTop: -getSize.h(60), flex: 1},
    scrollCon: {
      paddingHorizontal: getSize.w(24),
      paddingTop: getSize.h(80),
      paddingBottom: getSize.h(20),
    },
    headerInfo: {
      paddingVertical: getSize.h(22),
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: insets.top + getSize.h(30),
      marginHorizontal: getSize.w(24),
      paddingHorizontal: getSize.w(24),
      zIndex: 10,
    },
    backBtn: {
      position: 'absolute',
      top: insets.top + getSize.h(20),
      left: getSize.w(24),
      zIndex: 10,
    },
    sendBtn: {
      position: 'absolute',
      top: insets.top + getSize.h(26),
      right: getSize.w(24),
      zIndex: 10,
    },
    headerTitle: {
      top: insets.top + getSize.h(26),
      textAlign: 'center',
    },
    headerInfoItem: {
      flex: 1,
      paddingHorizontal: getSize.w(24),
      alignItems: 'flex-end',
    },
    balanceKizuna: {
      color: theme.colors.primary,
      fontSize: getSize.f(15),
    },
    incomeKizuna: {
      color: theme.colors.secondary,
      fontSize: getSize.f(15),
    },
    kizunaNumber: {
      fontSize: getSize.f(32),
      fontFamily: theme.fonts.sfPro.bold,
      letterSpacing: 0,
    },
    headerInfoLabel: {
      fontSize: getSize.f(15),
    },
    headerLogo: {
      width: getSize.w(43),
      height: getSize.w(43),
      resizeMode: 'contain',
      marginLeft: getSize.w(24),
    },
    sendBtnTxt: {
      fontSize: getSize.f(17),
      fontFamily: theme.fonts.sfPro.medium,
      color: theme.colors.textContrast,
    },
    formWrap: {
      marginHorizontal: getSize.w(24),
      marginVertical: getSize.h(20),
      paddingHorizontal: getSize.w(24),
      paddingVertical: getSize.h(45),
    },
    userMeta: {
      marginLeft: getSize.w(16),
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
    },
    userName: {
      fontSize: getSize.f(18),
      fontFamily: theme.fonts.sfPro.semiBold,
      width: width - getSize.w(48 + 48 + 68 + 10),
    },
    ratingWrap: {
      marginTop: getSize.h(4),
    },
    reviewCount: {
      fontSize: getSize.f(15),
      color: theme.colors.tagTxt,
      marginTop: getSize.h(3),
    },
    itemWrapper: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    listDivider: {
      height: getSize.h(1),
      backgroundColor: theme.colors.divider,
      marginVertical: getSize.h(20),
    },
    itemContainer: {
      flexGrow: 1,
      flex: 1,
      marginLeft: getSize.w(10),
      alignItems: 'flex-start',
    },
    itemName: {
      fontSize: getSize.f(17),
      fontFamily: theme.fonts.sfPro.medium,
      color: theme.colors.tagTxt,
      marginBottom: getSize.h(5),
      flexGrow: 1,
      flex: 1,
    },
    avatar: {},
    itemMeta: {
      marginLeft: getSize.w(10),
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
    },
    itemTopWrap: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    itemDate: {
      fontSize: getSize.f(12),
      color: theme.colors.grayLight,
      lineHeight: getSize.h(20),
    },
    listContainer: {
      paddingHorizontal: getSize.w(24),
      paddingVertical: getSize.h(30),
    },
    itemContent: {
      marginTop: getSize.h(5),
    },
    avatarPlace: {
      width: getSize.h(40),
      height: getSize.h(40),
      borderRadius: getSize.h(40 / 2),
    },
  });

  function renderReviewItem({item}) {
    return (
      <View style={styles.itemWrapper}>
        <Avatar
          size="header"
          source={{uri: item.user.avatar}}
          onPress={() =>
            userInfo?.id !== item.user.id &&
            navigation.push('UserProfile', {userId: item.user.id})
          }
        />
        <View style={styles.itemContainer}>
          <View style={styles.itemTopWrap}>
            <Text
              onPress={() =>
                userInfo?.id !== item.user.id &&
                navigation.push('UserProfile', {userId: item.user.id})
              }
              style={styles.itemName}>
              {item.user.name}
            </Text>
            <Text style={styles.itemDate}>
              {moment.utc(item.created_at).fromNow()}
            </Text>
          </View>
          <Rating small hideReviewCount value={item.rate} />
          <Text style={styles.itemContent}>{item.comment}</Text>
        </View>
      </View>
    );
  }

  function renderPlaceholder() {
    return (
      <Placeholder Animation={Fade}>
        <View style={styles.itemWrapper}>
          <PlaceholderMedia style={styles.avatarPlace} />
          <View style={styles.itemContainer}>
            <View style={styles.itemTopWrap}>
              <PlaceholderLine width={30} />
            </View>
            <PlaceholderLine width={60} />
          </View>
        </View>
      </Placeholder>
    );
  }

  return (
    <Wrapper style={styles.wrapper}>
      <HeaderBg height={HEADER_HEIGHT} addSBHeight />
      <Touchable onPress={navigation.goBack} style={styles.backBtn}>
        <MaterialCommunityIcons
          name="chevron-left"
          size={getSize.f(34)}
          color={theme.colors.textContrast}
        />
      </Touchable>
      <Text variant="header" style={styles.headerTitle}>
        Reviews
      </Text>
      <Paper style={styles.headerInfo}>
        <Avatar data={thisUser?.media?.avatar} />
        <View style={styles.userMeta}>
          <Text numberOfLines={1} style={styles.userName}>
            {thisUser?.name}
          </Text>
          <Rating
            wrapperStyle={styles.ratingWrap}
            value={rating?.detail?.avg || thisUser?.rating?.rating || 0}
            hideReviewCount
          />
          <Text style={styles.reviewCount}>
            ({rating?.detail?.count} reviews)
          </Text>
        </View>
      </Paper>
      <FlatList
        data={rating?.list}
        renderItem={renderReviewItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          rating?.loading ? (
            <>
              {renderPlaceholder()}
              <View style={styles.listDivider} />
              {renderPlaceholder()}
              <View style={styles.listDivider} />
              {renderPlaceholder()}
            </>
          ) : (
            <EmptyState />
          )
        }
        ItemSeparatorComponent={() => <View style={styles.listDivider} />}
        initialNumToRender={10}
        onEndReachedThreshold={0.5}
        onEndReached={handleLoadMore}
        refreshControl={
          <RefreshControl
            colors={theme.colors.gradient}
            tintColor={theme.colors.primary}
            refreshing={rating?.loading}
            onRefresh={handleRefresh}
          />
        }
      />
    </Wrapper>
  );
};

export default ReviewListScreen;
