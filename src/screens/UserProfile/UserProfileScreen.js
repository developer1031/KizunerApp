import React, {useEffect, useState, memo} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {
  StyleSheet,
  View,
  FlatList,
  Dimensions,
  RefreshControl,
  Image,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';
import {
  Placeholder,
  PlaceholderMedia,
  PlaceholderLine,
  Fade,
} from 'rn-placeholder';
import Feather from 'react-native-vector-icons/Feather';

import {
  Wrapper,
  Header,
  Paper,
  Avatar,
  Text,
  Rating,
  IconButton,
  Button,
  ExpandableText,
  SNSLink,
  SpecialtyList,
  UserRelation,
  ImageViewer,
  EmptyState,
  HeaderSearch,
  Loading,
} from 'components';
import {
  FeedItem,
  HangoutPlaceholder,
  FeedItemStatus,
  FeedItemHangout,
  FeedItemHelp,
} from 'components/FeedItem';
import useTheme from 'theme';
import {getSize} from 'utils/responsive';
import {GENDERS, FRIENDSHIP} from 'utils/constants';
import {
  showModalize,
  hideModalize,
  getDetailUser,
  getUserFeed,
  sendFriendRequest,
  removeFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  unfriend,
  blockUser,
  showAlert,
  follow,
  unfollow,
  createChatRoom,
} from 'actions';

const width = Dimensions.get('window').width;
import orangeLight from '../../theme/orangeLight';
import {ScrollView} from 'react-native';

const areEqualFeedItem = (prevProps, nextProps) => {
  return prevProps?.data?.id === nextProps?.data?.id;
};

// const MemoFeedItemStatus = memo(FeedItemStatus, areEqualFeedItem);
// const MemoFeedItemHangout = memo(FeedItemHangout, areEqualFeedItem);
// const MemoFeedItemHelp = memo(FeedItemHelp, areEqualFeedItem);

const UserProfileScreen = ({navigation, route}) => {
  const {userId, initialValue} = route.params;
  const theme = useTheme();
  const userProfile = useSelector((state) => state.userProfile[userId]);
  const feed = useSelector((state) => state.feed.userFeed[userId]);
  const {requesting, beingFollow} = useSelector((state) => state.contact);
  const dispatch = useDispatch();
  const [showCoverView, setShowCoverView] = useState(false);
  const [page, setPage] = useState(1);
  const insets = useSafeAreaInsets();

  const HEADER_HEIGHT = 68 + insets.top;
  const COVER_HEIGHT = 200 + 68 + insets.top;

  const handleGetHangouts = (p = page) =>
    dispatch(getUserFeed({page: p, userId}));

  const handleLoadMore = () => {
    if (page < feed?.lastPage) {
      handleGetHangouts(page + 1);
      setPage(page + 1);
    }
  };

  const handleGetDetail = (callback) =>
    dispatch(getDetailUser(userId, callback));

  useEffect(() => {
    handleGetDetail({
      success: () => handleGetHangouts(1),
    });
  }, []);

  const styles = StyleSheet.create({
    userWrap: {
      marginTop:
        getSize.h(COVER_HEIGHT - insets.top) -
        getSize.h(HEADER_HEIGHT - insets.top + 55),
      paddingHorizontal: getSize.w(24),
      alignItems: 'center',
      flexDirection: 'row',
      zIndex: 0,
      marginBottom: getSize.h(10),
      flex: 1,
    },
    placeUserWrap: {
      marginTop: getSize.h(COVER_HEIGHT - 25),
    },
    placeContent: {
      marginHorizontal: getSize.w(24),
      marginTop: getSize.h(30),
    },
    detailError: {
      paddingTop: getSize.h(HEADER_HEIGHT),
      height: getSize.h(200 + HEADER_HEIGHT),
      width,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

  const data = userProfile?.data || initialValue;

  const socialLinks = Object.keys(data?.social || {})
    .filter((key) => data?.social[key]?.length > 1)
    .map((key) => ({
      service: key,
      link: data?.social?.[key],
    }));

  const handleRefresh = () => {
    handleGetDetail();
    setPage(1);
    handleGetHangouts(1);
  };

  const showFriendResponse = () => {
    dispatch(
      showModalize([
        {
          label: 'Confirm',
          onPress: () => {
            dispatch(hideModalize());
            dispatch(acceptFriendRequest(data?.friendship?.id, userId));
          },
          icon: (
            <MaterialCommunityIcons
              size={getSize.f(20)}
              color={theme.colors.primary}
              name="account-check"
            />
          ),
        },
        {
          label: 'Delete Request',
          onPress: () => {
            dispatch(hideModalize());
            dispatch(rejectFriendRequest(data?.friendship?.id, userId));
          },
          icon: (
            <MaterialCommunityIcons
              size={getSize.f(20)}
              color={theme.colors.primary}
              name="close"
            />
          ),
        },
      ]),
    );
  };

  function renderFriendOption() {
    switch (data?.friendship?.status) {
      case FRIENDSHIP.GUEST:
        return {
          label: 'Add friend',
          onPress: () => {
            dispatch(hideModalize());
            dispatch(sendFriendRequest(data));
          },
          icon: (
            <MaterialCommunityIcons
              size={getSize.f(20)}
              color={theme.colors.primary}
              name="account-plus"
            />
          ),
        };
      case FRIENDSHIP.FRIEND:
        return {
          label: 'Friends',
          onPress: () => {
            dispatch(hideModalize());
            showUnfriendOptions();
          },
          icon: (
            <MaterialCommunityIcons
              size={getSize.f(20)}
              color={theme.colors.primary}
              name="account-check"
            />
          ),
        };
      case FRIENDSHIP.REQUESTED:
        return {
          label: 'Cancel Request',
          onPress: () => {
            dispatch(hideModalize());
            dispatch(removeFriendRequest(data?.friendship?.id, userId));
          },
          icon: (
            <MaterialCommunityIcons
              size={getSize.f(20)}
              color={theme.colors.primary}
              name="account-arrow-right"
            />
          ),
        };
      case FRIENDSHIP.PENDING:
        return {
          label: 'Respond',
          onPress: () => {
            dispatch(hideModalize());
            showFriendResponse();
          },
          icon: (
            <MaterialCommunityIcons
              size={getSize.f(20)}
              color={theme.colors.primary}
              name="account-check"
            />
          ),
        };
      default:
        return null;
    }
  }

  const showBlockOptions = () => {
    dispatch(
      showModalize([
        data?.friendship?.status === FRIENDSHIP.FRIEND && {
          label: `Unfriend ${data?.name}?`,
          onPress: () => {
            dispatch(hideModalize());
            dispatch(unfriend(data?.friendship?.id, userId));
          },
          icon: (
            <MaterialCommunityIcons
              size={getSize.f(20)}
              color={theme.colors.primary}
              name="account-remove"
            />
          ),
        },
        {
          label: `Block ${data?.name}`,
          onPress: () => {
            dispatch(hideModalize());
            dispatch(
              blockUser(userId, {
                success: () => {
                  dispatch(
                    showAlert({
                      title: 'Success',
                      type: 'success',
                      body: `You blocked ${data?.name}!`,
                    }),
                  );
                  navigation.goBack();
                },
              }),
            );
          },
          icon: (
            <MaterialCommunityIcons
              size={getSize.f(20)}
              color={theme.colors.primary}
              name="block-helper"
            />
          ),
        },
      ]),
    );
  };

  const showOptions = () => {
    dispatch(
      showModalize([
        // renderFriendOption(),
        {
          label: data?.follow ? 'Unfollow' : 'Follow',
          disabled: beingFollow.includes(userId),
          onPress: () => {
            dispatch(hideModalize());
            if (data?.follow) {
              dispatch(unfollow(data?.follow, userId, data?.name));
            } else {
              dispatch(follow(userId, data?.name));
            }
          },
          icon: beingFollow.includes(userId) ? (
            <Loading dark />
          ) : (
            <MaterialCommunityIcons
              size={getSize.f(20)}
              color={theme.colors.primary}
              name={data?.follow ? 'bell-off' : 'bell-ring'}
            />
          ),
        },
        {
          label: 'Block',
          onPress: () => {
            dispatch(hideModalize());
            setTimeout(() => showBlockOptions(), 500);
          },
          icon: (
            <MaterialCommunityIcons
              size={getSize.f(20)}
              color={theme.colors.primary}
              name="block-helper"
            />
          ),
        },
        {
          label: 'Report This User',
          icon: (
            <MaterialIcons
              size={getSize.f(20)}
              color={theme.colors.primary}
              name="report-problem"
            />
          ),
          onPress: () => {
            dispatch(hideModalize());
            navigation.push('ReportContent', {
              id: data?.id,
              type: 'user',
            });
          },
        },
      ]),
    );
  };

  const showUnfriendOptions = () => {
    dispatch(
      showModalize([
        {
          label: 'Unfollow',
          disabled: beingFollow.includes(userId),
          hide: !data?.follow,
          onPress: () => {
            dispatch(hideModalize());
            dispatch(unfollow(data?.follow, userId, data?.name));
          },
          icon: beingFollow.includes(userId) ? (
            <Loading dark />
          ) : (
            <MaterialCommunityIcons
              size={getSize.f(20)}
              color={theme.colors.primary}
              name={'bell-off'}
            />
          ),
        },
        {
          label: 'Unfriend',
          onPress: () => {
            dispatch(hideModalize());
            dispatch(unfriend(data?.friendship?.id, userId));
          },
          icon: (
            <MaterialCommunityIcons
              size={getSize.f(20)}
              color={theme.colors.primary}
              name="account-remove"
            />
          ),
        },
      ]),
    );
  };

  function renderItem({item}) {
    if (item?.type === 'status') {
      return <FeedItemStatus data={item?.relation?.data} type={item?.type} />;
    }
    if (item?.type === 'hangout') {
      return <FeedItemHangout data={item?.relation?.data} type={item?.type} />;
    }
    if (item?.type === 'help') {
      return <FeedItemHelp data={item?.relation?.data} type={item?.type} />;
    }
    return null;
  }

  function renderFriendshipButton() {
    switch (data?.friendship?.status) {
      case FRIENDSHIP.GUEST:
        return (
          <Button
            title="Add Friend"
            style={styles.actionButton}
            onPress={() => dispatch(sendFriendRequest(data))}
            loading={requesting.includes(userId)}
            leftIcon={
              <MaterialCommunityIcons
                name="account-plus"
                color={theme.colors.textContrast}
                size={getSize.f(20)}
              />
            }
          />
        );
      case FRIENDSHIP.FRIEND:
        return (
          <Button
            title="Friends"
            style={styles.actionButton}
            onPress={showUnfriendOptions}
            loading={requesting.includes(userId)}
            leftIcon={
              <MaterialCommunityIcons
                name="account-check"
                color={theme.colors.textContrast}
                size={getSize.f(20)}
              />
            }
          />
        );
      case FRIENDSHIP.REQUESTED:
        return (
          <Button
            title="Cancel Request"
            variant="ghost"
            style={styles.actionButton}
            onPress={() =>
              dispatch(removeFriendRequest(data?.friendship?.id, userId))
            }
            loading={requesting.includes(userId)}
            leftIcon={
              <MaterialCommunityIcons
                name="account-arrow-right"
                color={theme.colors.tagTxt}
                size={getSize.f(20)}
              />
            }
          />
        );
      case FRIENDSHIP.PENDING:
        return (
          <Button
            title="Respond"
            style={styles.actionButton}
            loading={requesting.includes(userId)}
            onPress={showFriendResponse}
            leftIcon={
              <MaterialCommunityIcons
                name="account-check"
                color={theme.colors.textContrast}
                size={getSize.f(20)}
              />
            }
          />
        );
      default:
        return null;
    }
  }
  function handleSendMessage() {
    userId &&
      dispatch(
        createChatRoom({members: [userId]}, (result) => {
          if (result?.data) {
            navigation.navigate('ChatRoom', {
              data: result.data,
            });
          }
        }),
      );
  }

  const gender = GENDERS.find((i) => i.value === data?.gender)?.label;
  const birthday =
    data?.birth_date && moment(data?.birth_date).format('MMM DD, YYYY');

  return (
    <Wrapper style={stylesMain.wrapper}>
      <HeaderSearch placeholder={data?.name} />
      <FlatList
        ListHeaderComponent={() => (
          <Paper style={stylesMain.infoWrap}>
            {data ? (
              <>
                <Header
                  image={
                    data?.media?.cover?.path && {
                      uri: data?.media?.cover?.path,
                    }
                  }
                  height={COVER_HEIGHT}
                  style={stylesMain.cover}
                  onPress={() =>
                    Boolean(data?.media?.cover?.path) && setShowCoverView(true)
                  }
                  wrapperStyle={{paddingTop: getSize.h(68)}}
                />
                <View style={styles.userWrap}>
                  <Avatar
                    size="large"
                    style={stylesMain.avatar}
                    data={data?.media?.avatar}
                    zoomable
                  />
                  <View style={stylesMain.userMeta}>
                    <Text numberOfLines={1} style={stylesMain.userName}>
                      {data?.name?.trim()}
                    </Text>
                    <Rating
                      wrapperStyle={stylesMain.ratingWrap}
                      value={data?.rating?.rating || 0}
                      reviewCount={data?.rating?.count || 0}
                      onPress={() =>
                        navigation.push('ReviewList', {user: data})
                      }
                    />
                    {!!data?.resident?.short_address && (
                      <View style={stylesMain.locationWrap}>
                        <SimpleLineIcons
                          name="location-pin"
                          color={theme.colors.tagTxt}
                          size={getSize.f(17)}
                        />
                        <Text max style={stylesMain.locationTxt}>
                          {data?.resident?.short_address.length < 24
                            ? `${data?.resident?.short_address}`
                            : `${data?.resident?.short_address.substring(
                                0,
                                24,
                              )}...`}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
                <UserRelation userId={userId} relation={data?.relation} />

                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={stylesMain.actionButtonWrap}>
                    {/* {renderFriendshipButton()} */}

                    <Button
                      title={data?.follow ? 'Unfollow' : 'Follow'}
                      style={styles.actionButton}
                      onPress={() => {
                        if (data?.follow) {
                          dispatch(unfollow(data?.follow, userId, data?.name));
                        } else {
                          dispatch(follow(userId, data?.name));
                        }
                      }}
                      loading={beingFollow.includes(userId)}
                      leftIcon={
                        <MaterialCommunityIcons
                          name={data?.follow ? 'bell-off' : 'bell-ring'}
                          color={theme.colors.textContrast}
                          size={getSize.f(20)}
                        />
                      }
                    />
                    <Button
                      title="Message"
                      style={[styles.actionButton, {marginHorizontal: 10}]}
                      variant="ghost"
                      onPress={handleSendMessage}
                      leftIcon={
                        <Feather
                          name="edit"
                          color={theme.colors.tagTxt}
                          size={getSize.f(20)}
                        />
                      }
                    />
                    <IconButton
                      onPress={showOptions}
                      icon={
                        <MaterialCommunityIcons
                          name="settings"
                          color={theme.colors.textContrast}
                          size={getSize.f(24)}
                        />
                      }
                    />
                  </View>
                </ScrollView>

                <View style={stylesMain.detailWrap}>
                  <View style={stylesMain.detailHeader}>
                    <View style={stylesMain.infoTitleWrap}>
                      <Text style={stylesMain.infoTitle}>Information</Text>
                    </View>
                  </View>
                  <Text style={stylesMain.infoLabel}>About</Text>
                  <ExpandableText style={stylesMain.infoDetailText}>
                    {data?.about}
                  </ExpandableText>
                  <View style={stylesMain.genBirthWrap}>
                    <View style={stylesMain.genBirthCon}>
                      <Text style={stylesMain.infoLabel}>Gender</Text>
                      {!!gender && (
                        <Text variant="caption" style={stylesMain.infoText}>
                          {gender}
                        </Text>
                      )}
                    </View>
                    <View style={stylesMain.genBirthCon}>
                      <Text style={stylesMain.infoLabel}>Birthday</Text>
                      {!!birthday && (
                        <Text variant="caption" style={stylesMain.infoText}>
                          {birthday}
                        </Text>
                      )}
                    </View>
                  </View>
                  <Text style={stylesMain.infoLabel}>SNS Links</Text>
                  {socialLinks?.length > 0 && (
                    <View style={stylesMain.snsLinks}>
                      {socialLinks.map((item) => (
                        <SNSLink
                          wrapperStyle={stylesMain.snsLink}
                          key={item.service}
                          {...item}
                        />
                      ))}
                    </View>
                  )}
                  <Text style={stylesMain.infoLabel}>Specialties</Text>
                </View>
                <SpecialtyList
                  data={data?.specialities?.data?.filter((i) => !i.suggest)}
                />
              </>
            ) : !userProfile?.error ? (
              <Placeholder Animation={Fade}>
                <PlaceholderMedia
                  style={[
                    stylesMain.cover,
                    {
                      height: getSize.h(COVER_HEIGHT),
                      width,
                    },
                  ]}
                />
                <View style={[styles.userWrap, styles.placeUserWrap]}>
                  <PlaceholderMedia style={stylesMain.placeAvatar} />
                  <View style={[stylesMain.userMeta, stylesMain.placeUserMeta]}>
                    <PlaceholderLine width={50} />
                    <PlaceholderLine width={65} />
                  </View>
                </View>
                <View style={stylesMain.placeRelation}>
                  <PlaceholderLine width={15} height={15} />
                  <PlaceholderLine width={15} height={15} />
                  <PlaceholderLine width={15} height={15} />
                  <PlaceholderLine width={15} height={15} />
                </View>
                <View style={stylesMain.actionButtonWrap}>
                  <PlaceholderMedia style={stylesMain.placeLargeBtn} />
                  <PlaceholderMedia style={stylesMain.placeIconBtn} />
                </View>
                <View style={styles.placeContent}>
                  <PlaceholderLine width={30} height={15} />
                  <PlaceholderLine
                    width={20}
                    style={{marginTop: getSize.h(30)}}
                  />
                  <PlaceholderLine width={80} />
                  <PlaceholderLine width={65} />
                </View>
              </Placeholder>
            ) : (
              <View style={styles.detailError}>
                <EmptyState
                  label={userProfile?.error?.message || userProfile?.error}
                />
              </View>
            )}
          </Paper>
        )}
        data={feed?.list}
        keyExtractor={(item) => item.id.toString()}
        style={stylesMain.scrollWrap}
        contentContainerStyle={stylesMain.scrollContainer}
        showsVerticalScrollIndicator={false}
        renderItem={renderItem}
        ListFooterComponent={
          (feed?.loading || userProfile?.loading) && <HangoutPlaceholder />
        }
        initialNumToRender={10}
        onEndReachedThreshold={0.5}
        onEndReached={handleLoadMore}
        ListEmptyComponent={
          !feed?.loading &&
          !userProfile?.loading && (
            <EmptyState label={feed?.error?.message || feed?.error} />
          )
        }
        // contentInset={{
        //   top: Platform.OS === 'ios' ? insets.top + getSize.h(68) : 0,
        // }}
        refreshControl={
          <RefreshControl
            refreshing={feed?.loading}
            colors={theme.colors.gradient}
            tintColor={theme.colors.primary}
            onRefresh={handleRefresh}
            progressViewOffset={insets.top + getSize.h(68)}
          />
        }
      />
      <ImageViewer
        open={showCoverView}
        onClose={() => setShowCoverView(false)}
        image={data?.media?.cover?.path && {uri: data?.media?.cover?.path}}
      />
    </Wrapper>
  );
};

const stylesMain = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  infoText: {
    fontSize: getSize.f(15),
    marginTop: getSize.h(10),
  },
  cover: {
    zIndex: -1,
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
  },
  scrollWrap: {flex: 1},
  scrollContainer: {
    paddingBottom: getSize.h(20),
  },
  separator: {
    height: getSize.h(20),
  },
  userMeta: {
    marginLeft: getSize.w(16),
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  userName: {
    fontSize: getSize.f(18),
    fontFamily: orangeLight.fonts.sfPro.semiBold,
    width: width - getSize.w(48 + 120 + 10),
  },
  ratingWrap: {
    marginTop: getSize.h(4),
  },
  locationTxt: {
    marginLeft: getSize.w(5),
  },
  infoWrap: {
    justifyContent: 'flex-end',
    paddingBottom: getSize.h(25),
    marginBottom: getSize.h(20),
  },
  avatar: {
    top: -getSize.h(20),
  },
  actionButtonWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: getSize.h(30),
    marginHorizontal: getSize.w(24),
  },
  actionButton: {
    width: width - getSize.w(24 * 2) - getSize.w(48 + 10),
  },
  locationWrap: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: getSize.h(5),
    alignItems: 'center',
  },
  editAvatarBtn: {
    position: 'absolute',
    bottom: 22,
    right: 0,
    zIndex: 10,
    elevation: 10,
  },
  detailWrap: {
    marginTop: getSize.h(30),
    marginHorizontal: getSize.w(24),
  },
  detailHeader: {
    flexDirection: 'row',
    borderBottomColor: orangeLight.colors.divider,
    borderBottomWidth: getSize.h(1),
    justifyContent: 'space-between',
  },
  infoTitle: {
    fontSize: getSize.f('18'),
    color: orangeLight.colors.primary,
    fontFamily: orangeLight.fonts.sfPro.semiBold,
    marginBottom: getSize.h(10),
  },
  infoTitleWrap: {
    borderBottomWidth: getSize.h(2),
    borderBottomColor: orangeLight.colors.primary,
  },
  editWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editText: {
    color: orangeLight.colors.primary,
    marginLeft: getSize.w(6),
  },
  infoLabel: {
    fontSize: getSize.f(18),
    marginTop: getSize.h(21),
  },
  infoDetailText: {
    color: orangeLight.colors.tagTxt,
    marginTop: getSize.h(10),
    fontSize: getSize.f(15),
  },
  genBirthWrap: {
    flexDirection: 'row',
  },
  genBirthCon: {
    flex: 1,
  },
  snsLinks: {
    flexDirection: 'row',
    marginTop: getSize.h(10),
  },
  snsLink: {
    marginRight: getSize.w(10),
  },
  placeRelation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: getSize.h(30),
    marginHorizontal: getSize.w(30),
  },
  placeAvatar: {
    width: getSize.h(130),
    height: getSize.h(130),
    borderRadius: getSize.h(130 / 2),
    borderWidth: getSize.h(5),
    borderColor: orangeLight.colors.paper,
    ...orangeLight.shadow.small.ios,
    ...orangeLight.shadow.small.android,
    overflow: 'visible',
    backgroundColor: 'white',
  },
  placeLargeBtn: {
    height: getSize.h(48),
    borderRadius: getSize.h(48 / 2),
    flexGrow: 1,
    marginRight: getSize.w(20),
    marginBottom: getSize.h(10),
  },
  placeIconBtn: {
    width: getSize.h(48),
    height: getSize.h(48),
    borderRadius: getSize.h(48 / 2),
    marginBottom: getSize.h(10),
  },
  placeUserMeta: {
    flexGrow: 1,
    marginLeft: getSize.w(20),
    marginTop: getSize.h(20),
  },
});

export default UserProfileScreen;
