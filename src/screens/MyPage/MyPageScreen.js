import React, {useEffect, useState, useRef, memo} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {
  StyleSheet,
  View,
  FlatList,
  Dimensions,
  RefreshControl,
  StatusBar,
  Platform,
  ScrollView,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import moment from 'moment';
import FormData from 'form-data';
import {useIsFocused, useScrollToTop} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {data as languagesDataJson} from 'assets/data';

import FastImage from 'react-native-fast-image';
import uuid from 'uuid/v4';

import {
  Wrapper,
  Header,
  Paper,
  Avatar,
  Text,
  Rating,
  Touchable,
  IconButton,
  Button,
  ExpandableText,
  SNSLink,
  SpecialtyList,
  UserRelation,
  ImageViewer,
  EmptyState,
  UserAddress,
  Text as MText,
} from 'components';
import {
  HangoutPlaceholder,
  FeedItem,
  FeedItemStatus,
  FeedItemHangout,
  FeedItemHelp,
} from 'components/FeedItem';
import useTheme from 'theme';
import {getSize} from 'utils/responsive';
import {takePhoto, selectPhoto} from 'utils/photo';
import {GENDERS} from 'utils/constants';
import {
  showModalize,
  hideModalize,
  updateUserAvatar,
  updateUserCover,
  getUserInfo,
  getSelfFeed,
  showAlert,
} from 'actions';
import {getWalletStripeStatus} from 'actions';

const width = Dimensions.get('window').width;

const areEqualFeedItem = (prevProps, nextProps) => {
  return prevProps?.data?.id === nextProps?.data?.id;
};

const MemoFeedItemStatus = memo(FeedItemStatus, areEqualFeedItem);
//const MemoFeedItemHangout = memo(FeedItemHangout, areEqualFeedItem);
//const MemoFeedItemHelp = memo(FeedItemHelp, areEqualFeedItem);

const MyPageScreen = ({navigation}) => {
  const theme = useTheme();
  const userInfo = useSelector((state) => state.auth.userInfo);
  const loading = useSelector((state) => state.auth.beingGetInfo);
  const avatarLoading = useSelector((state) => state.auth.beingUpdateAvatar);
  const coverLoading = useSelector((state) => state.auth.beingUpdateCover);
  const {
    selfFeed,
    selfFeedLoading,
    selfFeedLastPage: lastPage,
  } = useSelector((state) => state.feed);
  const dispatch = useDispatch();
  const [showCoverView, setShowCoverView] = useState(false);
  const [page, setPage] = useState(1);
  const listRef = useRef(null);
  const isFocused = useIsFocused();
  const insets = useSafeAreaInsets();

  useScrollToTop(listRef);

  const HEADER_HEIGHT = 150 + insets.top;

  const handleGetHangouts = (p = page) => dispatch(getSelfFeed({page: p}));

  const handleLoadMore = () => {
    if (page < lastPage) {
      handleGetHangouts(page + 1);
      setPage(page + 1);
    }
  };

  // useEffect(() => {
  //   dispatch(
  //     showAlert({
  //       title: 'Success',
  //       type: 'success',
  //       body: 'Reset password successfully, please login again!',
  //     }),
  //   );
  // }, []);

  useEffect(() => {
    handleGetHangouts(page);
    dispatch(getWalletStripeStatus());
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', (e) => {
      StatusBar.setBarStyle('light-content');
      Platform.OS === 'android' && StatusBar.setBackgroundColor('transparent');
    });
    return () => {
      unsubscribe();
    };
  }, [navigation]);

  function handleUpdateAvatar(payload) {
    const formData = new FormData();
    formData.append('file', payload);
    formData.append('type', 'user.avatar');
    dispatch(hideModalize());
    dispatch(updateUserAvatar(formData));
  }

  function handleUpdateCover(payload) {
    const formData = new FormData();
    formData.append('file', payload);
    formData.append('type', 'user.cover');
    dispatch(hideModalize());
    dispatch(updateUserCover(formData));
  }

  const styles = StyleSheet.create({
    wrapper: {
      flex: 1,
    },
    header: {
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
    userWrap: {
      marginTop: getSize.h(HEADER_HEIGHT - insets.top) - getSize.h(55),
      paddingHorizontal: getSize.w(24),
      alignItems: 'center',
      flexDirection: 'row',
      zIndex: 0,
      marginBottom: getSize.h(10),
    },
    userMeta: {
      marginLeft: getSize.w(16),
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      flex: 1,
    },
    userName: {
      fontSize: getSize.f(18),
      fontFamily: theme.fonts.sfPro.semiBold,
      width: width - getSize.w(48 + 120 + 10),
    },
    ratingWrap: {
      marginTop: getSize.h(4),
    },
    infoWrap: {
      justifyContent: 'flex-end',
      paddingBottom: getSize.h(40),
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
      paddingHorizontal: getSize.w(18),
    },
    actionButton: {
      width: width / 2 - getSize.w(24) - getSize.w(19 / 2),
      marginHorizontal: getSize.w(2),
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
      borderBottomColor: theme.colors.divider,
      borderBottomWidth: getSize.h(1),
      justifyContent: 'space-between',
    },
    infoTitle: {
      fontSize: getSize.f(18),
      color: theme.colors.primary,
      fontFamily: theme.fonts.sfPro.semiBold,
      marginBottom: getSize.h(10),
    },
    infoText: {
      fontSize: getSize.f(15),
      marginTop: getSize.h(10),
    },
    infoTitleWrap: {
      borderBottomWidth: getSize.h(2),
      borderBottomColor: theme.colors.primary,
    },
    editWrap: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    editText: {
      color: theme.colors.primary,
      marginLeft: getSize.w(6),
    },
    infoLabel: {
      fontSize: getSize.f(18),
      marginTop: getSize.h(21),
    },
    infoDetailText: {
      color: theme.colors.tagTxt,
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
    countryFlag: {
      width: getSize.w(24),
      height: getSize.h(20),
      borderRadius: getSize.h(2),
      resizeMode: 'contain',
      marginRight: getSize.w(10),
      marginTop: getSize.h(12),
    },
    countryWrap: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    countryValue: {
      paddingVertical: getSize.h(Platform.OS === 'ios' ? 10 : 8),
      fontSize: getSize.f(16),
      letterSpacing: 1,
      color: theme.colors.text,
    },
    languageWrap: {
      flexDirection: 'row',
      alignItems: 'center',
      flexWrap: 'wrap',
    },
    languageLetter: {
      paddingVertical: getSize.w(4),
    },
  });

  const handleCoverPick = () => {
    dispatch(
      showModalize([
        {
          label: 'Take photo',
          icon: (
            <MaterialCommunityIcons
              size={getSize.f(20)}
              color={theme.colors.primary}
              name="camera"
            />
          ),
          onPress: () => takePhoto(handleUpdateCover),
        },
        {
          label: 'Choose from library',
          icon: (
            <MaterialCommunityIcons
              size={getSize.f(20)}
              color={theme.colors.primary}
              name="image-multiple"
            />
          ),
          onPress: () =>
            selectPhoto(handleUpdateCover, {
              width: 1500,
              height: 1000,
            }),
        },
        // {
        //   label: 'Remove',
        //   icon: (
        //     <MaterialCommunityIcons
        //       size={getSize.f(22)}
        //       color={theme.colors.primary}
        //       name="trash-can"
        //     />
        //   ),
        //   onPress: () =>
        //     dispatch(
        //       showAlert({
        //         type: 'info',
        //         title: 'Not ready yet,',
        //         body: 'This feature is in development!',
        //       }),
        //     ),
        // },
      ]),
    );
  };

  const handleAvatarPick = () => {
    dispatch(
      showModalize([
        {
          label: 'Take photo',
          icon: (
            <MaterialCommunityIcons
              size={getSize.f(20)}
              color={theme.colors.primary}
              name="camera"
            />
          ),
          onPress: () => takePhoto(handleUpdateAvatar),
        },
        {
          label: 'Choose from library',
          icon: (
            <MaterialCommunityIcons
              size={getSize.f(20)}
              color={theme.colors.primary}
              name="image-multiple"
            />
          ),
          onPress: () => selectPhoto(handleUpdateAvatar),
        },
        // {
        //   label: 'Remove',
        //   icon: (
        //     <MaterialCommunityIcons
        //       size={getSize.f(22)}
        //       color={theme.colors.primary}
        //       name="trash-can"
        //     />
        //   ),
        //   onPress: () =>
        //     dispatch(
        //       showAlert({
        //         type: 'info',
        //         title: 'Not ready yet,',
        //         body: 'This feature is in development!',
        //       }),
        //     ),
        // },
      ]),
    );
  };

  const socialLinks = Object.keys(userInfo?.social || {})
    .filter((key) => userInfo?.social[key]?.length > 1)
    .map((key) => ({
      service: key,
      link: userInfo?.social[key],
    }));

  const handleRefresh = () => {
    dispatch(getUserInfo());
    setPage(1);
    handleGetHangouts(1);
  };

  function renderItem({item}) {
    if (item?.type === 'status') {
      return (
        <FeedItemStatus
          isChangeStatus={true}
          data={item?.relation?.data}
          type={item?.type}
          enableShare={true}
        />
        // <MemoFeedItemStatus data={item?.relation?.data} type={item?.type} />
      );
    }
    if (item?.type === 'hangout') {
      return (
        <FeedItemHangout
          isChangeStatus={true}
          data={item?.relation?.data}
          type={item?.type}
          enableShare={true}
        />
      );
    }
    if (item?.type === 'help') {
      return (
        <FeedItemHelp
          isChangeStatus={true}
          data={item?.relation?.data}
          type={item?.type}
          enableShare={true}
        />
      );
    }
    return null;
  }

  return (
    <Wrapper style={styles.wrapper}>
      <FlatList
        ref={listRef}
        ListHeaderComponent={
          <Paper style={styles.infoWrap}>
            <Header
              image={
                userInfo?.media?.cover?.path && {
                  uri: userInfo?.media?.cover?.path,
                }
              }
              height={HEADER_HEIGHT}
              style={styles.header}
              onPress={() =>
                Boolean(userInfo?.media?.cover?.path) && setShowCoverView(true)
              }
              rightComponent={
                <IconButton
                  variant="ghost"
                  size={35}
                  loading={coverLoading}
                  onPress={handleCoverPick}
                  icon={
                    <MaterialCommunityIcons
                      name="camera"
                      size={getSize.f(23)}
                      color={theme.colors.tagTxt}
                    />
                  }
                />
              }
            />
            <View style={styles.userWrap}>
              <View>
                <Avatar
                  size="large"
                  style={styles.avatar}
                  data={userInfo?.media?.avatar}
                  zoomable
                />
                <IconButton
                  variant="ghost"
                  size={35}
                  wrapperStyle={styles.editAvatarBtn}
                  loading={avatarLoading}
                  onPress={handleAvatarPick}
                  icon={
                    <MaterialCommunityIcons
                      name="camera"
                      size={getSize.f(23)}
                      color={theme.colors.tagTxt}
                    />
                  }
                />
              </View>
              <View style={styles.userMeta}>
                <Text numberOfLines={1} style={styles.userName}>
                  {userInfo?.name?.trim()}
                </Text>
                <Rating
                  wrapperStyle={styles.ratingWrap}
                  value={userInfo?.rating?.rating || 0}
                  reviewCount={userInfo?.rating?.count || 0}
                  onPress={() =>
                    navigation.push('ReviewList', {user: userInfo})
                  }
                />
                <UserAddress />
              </View>
            </View>
            <UserRelation relation={userInfo?.relation} />

            <ScrollView
              showsHorizontalScrollIndicator={false}
              horizontal={true}
              contentContainerStyle={styles.actionButtonWrap}>
              <Button
                title="Status"
                style={styles.actionButton}
                variant="ghost"
                onPress={() => navigation.navigate('CreateStatus')}
                leftIcon={
                  <Feather
                    name="edit"
                    color={theme.colors.tagTxt}
                    size={getSize.f(20)}
                  />
                }
              />
              <Button
                title="Hangout"
                style={styles.actionButton}
                onPress={() => navigation.navigate('CreateHangout')}
                leftIcon={
                  <Feather
                    name="edit"
                    color={theme.colors.textContrast}
                    size={getSize.f(20)}
                  />
                }
              />
              <Button
                title="Help"
                gradient={theme.colors.gradientSecond}
                style={styles.actionButton}
                onPress={() => navigation.navigate('CreateHelp')}
                leftIcon={
                  <Feather
                    name="edit"
                    color={theme.colors.textContrast}
                    size={getSize.f(20)}
                  />
                }
              />
            </ScrollView>
            <View style={styles.detailWrap}>
              <View style={styles.detailHeader}>
                <View style={styles.infoTitleWrap}>
                  <Text style={styles.infoTitle}>Information</Text>
                </View>
                <Touchable
                  onPress={() => navigation.navigate('EditProfile')}
                  style={styles.editWrap}>
                  <MaterialIcons
                    name="settings"
                    color={theme.colors.primary}
                    size={getSize.f(22)}
                  />
                  <Text style={styles.editText}>Edit</Text>
                </Touchable>
              </View>
              <Text style={styles.infoLabel}>About</Text>
              <ExpandableText style={styles.infoDetailText}>
                {userInfo?.about}
              </ExpandableText>
              <View style={styles.genBirthWrap}>
                <View style={styles.genBirthCon}>
                  <Text style={styles.infoLabel}>Gender</Text>
                  {GENDERS.find((i) => i.value === userInfo?.gender)?.label && (
                    <Text variant="caption" style={styles.infoText}>
                      {GENDERS.find((i) => i.value === userInfo?.gender)?.label}
                    </Text>
                  )}
                </View>
                <View style={styles.genBirthCon}>
                  <Text style={styles.infoLabel}>Birthday</Text>
                  {userInfo?.birth_date && (
                    <Text variant="caption" style={styles.infoText}>
                      {moment(userInfo?.birth_date).format('MMM DD, YYYY')}
                    </Text>
                  )}
                </View>
              </View>
              <View style={styles.genBirthCon}>
                <Text style={styles.infoLabel}>Language</Text>
                {userInfo?.language && (
                  <View style={styles.languageWrap}>
                    {/* {userInfo?.language.map((item, index) => {
                      return (
                        <FastImage
                          key={languagesData[item].flag}
                          style={styles.countryFlag}
                          source={{uri: languagesData[item].flag}}
                        />
                      );
                    })} */}
                    {userInfo?.language.map((item, index) => {
                      return (
                        <View
                          key={languagesDataJson[item]?.name}
                          style={styles.languageLetter}>
                          <Text>
                            {languagesDataJson[item]?.name}
                            {index != userInfo?.language?.length - 1 && ' - '}
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                )}
              </View>
              <Text style={styles.infoLabel}>SNS Links</Text>
              {socialLinks?.length > 0 && (
                <View style={styles.snsLinks}>
                  {socialLinks.map((item) => (
                    <SNSLink
                      wrapperStyle={styles.snsLink}
                      key={item.service}
                      {...item}
                    />
                  ))}
                </View>
              )}
              <Text style={styles.infoLabel}>Specialties</Text>
            </View>
            <SpecialtyList
              data={userInfo?.specialities?.data?.filter(
                (item) => !item.suggest,
              )}
            />
          </Paper>
        }
        data={selfFeed}
        keyExtractor={(item) => item?.id?.toString()}
        style={styles.scrollWrap}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        renderItem={renderItem}
        ListFooterComponent={selfFeedLoading && <HangoutPlaceholder />}
        initialNumToRender={10}
        onEndReachedThreshold={0.5}
        onEndReached={handleLoadMore}
        ListEmptyComponent={!selfFeedLoading && <EmptyState />}
        onScroll={(e) => {
          if (e.nativeEvent.contentOffset.y > HEADER_HEIGHT) {
            StatusBar.setBarStyle('dark-content');
            Platform.OS === 'android' &&
              StatusBar.setBackgroundColor(theme.colors.paper);
          } else {
            StatusBar.setBarStyle('light-content');
            Platform.OS === 'android' &&
              StatusBar.setBackgroundColor('transparent');
          }
        }}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            colors={theme.colors.gradient}
            tintColor={theme.colors.primary}
            onRefresh={handleRefresh}
          />
        }
      />
      <ImageViewer
        open={showCoverView}
        onClose={() => setShowCoverView(false)}
        image={{uri: userInfo?.media?.cover?.path}}
      />
    </Wrapper>
  );
};

export default MyPageScreen;
