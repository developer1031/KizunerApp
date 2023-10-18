import React, {useRef, useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
  Dimensions,
  TextInput,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  RefreshControl,
  FlatList,
  Alert,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import LinearGradient from 'react-native-linear-gradient';
import MaskedView from '@react-native-community/masked-view';
import {
  Placeholder,
  PlaceholderLine,
  PlaceholderMedia,
  Fade,
} from 'rn-placeholder';
import {useDispatch, useSelector} from 'react-redux';

import useTheme from 'theme';
import {getSize} from 'utils/responsive';
import {Wrapper, Touchable, EmptyState, CommentItem, Text} from 'components';
import {
  HangoutUser,
  HangoutBody,
  HangoutAction,
  HangoutCount,
} from 'components/FeedItem';
import {
  getDetailStatus,
  toggleLikeStatus,
  showModalize,
  hideModalize,
  deleteStatus,
  getCommentList,
  postComment,
  editComment,
  newCommentFromSocket,
} from 'actions';
import {echo} from 'utils/socketService';
import {shareMultipleMediaFile, shareDownloadImage} from 'utils/share';
import orangeLight from '../../theme/orangeLight';

const width = Dimensions.get('window').width;

const StatusDetailScreen = ({navigation, route}) => {
  const {commentFocused, statusId, initialValue} = route.params;
  const commentRef = useRef(null);
  const scrollView = useRef(null);

  const dispatch = useDispatch();
  const status = useSelector((state) => state.feedDetail?.status[statusId]);
  const comment = useSelector((state) => state.feedDetail?.comment[statusId]);
  const userInfo = useSelector((state) => state.auth.userInfo);

  const [commentValue, setCommentValue] = useState('');
  const [editing, setEditing] = useState(null);
  const [commentPage, setCommentPage] = useState(1);

  const theme = useTheme();

  function handleNewComment(event) {
    dispatch(newCommentFromSocket(event.data));
  }

  useEffect(() => {
    echo
      .private(`user.${userInfo?.id}`)
      .listen(`.comment.${statusId}`, handleNewComment);

    return () => {
      echo
        .private(`user.${userInfo?.id}`)
        .stopListening(`.comment.${statusId}`);
    };
  }, [statusId]);

  const handleGetDetail = (callback) => {
    if (!statusId) {
      return;
    }
    dispatch(getDetailStatus(statusId, callback));
  };

  useEffect(() => {
    handleGetDetail({
      success: () => {
        loadCommentList();
      },
    });
    const keyboardListener = Keyboard.addListener(
      'keyboardDidShow',
      handleKeyboardShow,
    );
    return () => {
      keyboardListener.remove();
    };
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      StatusBar.setBarStyle('dark-content');
    });

    return () => {
      unsubscribe();
    };
  }, [navigation]);

  const data = status?.data || initialValue;

  const loaded = !status?.loading && status?.data;

  useEffect(() => {
    if (commentFocused && data) {
      commentRef?.current?.focus();
    }
  }, [commentFocused, data?.id]);

  function loadCommentList(p = commentPage) {
    dispatch(getCommentList({id: statusId, type: 'status', page: p}));
  }

  function loadMoreComment(p = commentPage) {
    if (commentPage < comment?.lastPage) {
      loadCommentList(commentPage + 1);
      setCommentPage(commentPage + 1);
    }
  }

  const handleKeyboardShow = () => {
    setTimeout(
      () => scrollView?.current?.scrollToEnd({animated: true}),
      Platform.OS === 'ios' ? 300 : 500,
    );
  };

  const showOptions = () =>
    dispatch(
      showModalize([
        // {
        //   label: 'Hide Hangout from News Status',
        //   icon: (
        //     <MaterialCommunityIcons
        //       size={getSize.f(20)}
        //       color={theme.colors.primary}
        //       name="close-circle"
        //     />
        //   ),
        //   onPress: () => {},
        // },
        {
          label: 'Edit Status',
          icon: (
            <MaterialIcons
              size={getSize.f(20)}
              color={theme.colors.primary}
              name="edit"
            />
          ),
          onPress: () => {
            dispatch(hideModalize());
            navigation.navigate('UpdateStatus', {status: data});
          },
          hide: data?.user?.data?.id !== userInfo?.id,
        },
        {
          label: 'Delete Status',
          icon: (
            <MaterialCommunityIcons
              size={getSize.f(20)}
              color={theme.colors.primary}
              name="delete"
            />
          ),
          onPress: () => {
            Alert.alert(
              'Delete Status',
              'Are you sure you want to delete this Status?',
              [
                {
                  text: 'Yes',
                  onPress: () =>
                    dispatch(
                      deleteStatus(data?.id, () => {
                        dispatch(hideModalize());
                        navigation.goBack();
                      }),
                    ),
                },
                {
                  text: 'No',
                  onPress: () => dispatch(hideModalize()),
                },
              ],
            );
          },
          hide: data?.user?.data?.id !== userInfo?.id,
        },
        {
          label: 'Report This Hangout',
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
              type: 'status',
            });
          },
          hide: data?.user?.data?.id === userInfo?.id,
        },
      ]),
    );

  const gradientProps = {
    colors: theme.colors.gradient,
    start: {x: 0, y: 0},
    end: {x: 1, y: 0},
  };

  if (!statusId) {
    return null;
  }

  function handlePostComment() {
    if (commentValue) {
      if (editing) {
        dispatch(
          editComment(
            {id: editing.id, body: commentValue, hangoutId: statusId},
            () => {
              setCommentValue('');
              setEditing(null);
              Keyboard.dismiss();
            },
          ),
        );
      } else {
        dispatch(
          postComment(
            {id: statusId, type: 'status', body: commentValue},
            () => {
              setCommentValue('');
              Keyboard.dismiss();
              setTimeout(
                () => scrollView?.current?.scrollToEnd({animated: true}),
                300,
              );
            },
          ),
        );
      }
    }
  }

  function handleEditComment(currentComment) {
    setEditing(currentComment);
    setCommentValue(currentComment?.body);
    commentRef?.current?.focus();
  }

  function renderCommentItem({item}) {
    return (
      <CommentItem
        data={item}
        onEdit={handleEditComment}
        hangoutId={statusId}
      />
    );
  }

  const onPressLike = () =>
    dispatch(
      toggleLikeStatus({
        statusId: data.id,
        userId: data?.user?.data?.id,
      }),
    );

  async function sharePostStatus() {
    const urlImage = data?.media?.data?.path || data?.media?.data?.thumb;
    const urlFile = [
      data?.dymanic_link || data?.media?.data?.path || 'https://kizuner.com/',
    ];
    const title = data?.title;
    const address = data?.location?.data?.address
      ? ' - ' + data?.location?.data?.address
      : '';

    const selectedShareOption = [
      {
        label: 'Share post',
        icon: (
          <MaterialIcons
            size={getSize.f(20)}
            color={theme.colors.primary}
            name="share"
          />
        ),
        onPress: () => {
          sharePost();
          dispatch(hideModalize());
        },
      },
    ];

    dispatch(showModalize(selectedShareOption));
    return;

    async function shareImage() {
      await shareDownloadImage(
        'Kizuner',
        title + address + ' ' + urlFile,
        Object.assign(data, {type: 'status'}),
        urlImage,
      );
    }

    async function sharePost() {
      await shareMultipleMediaFile(
        'Kizuner',
        title + address + ' ' + data?.description,
        urlFile,
        Object.assign(data, {type: 'status'}),
        !data?.liked && onPressLike,
      );
    }
  }

  return (
    <Wrapper style={styles.wrapper}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.headerWrapper}>
        <View style={styles.headerLeft}>
          <Touchable style={styles.backBtn} onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons
              name="chevron-left"
              color={theme.colors.primary}
              size={getSize.f(34)}
            />
          </Touchable>
          {data && <HangoutUser data={data} />}
        </View>
        {data?.user?.data?.id === userInfo?.id && (
          <Touchable onPress={showOptions}>
            <MaterialCommunityIcons
              name="dots-vertical"
              size={getSize.f(24)}
              color={theme.colors.text}
            />
          </Touchable>
        )}
      </View>
      <>
        <FlatList
          data={comment?.list}
          keyExtractor={(i) => i.id}
          refreshControl={
            <RefreshControl
              refreshing={status?.loading}
              colors={theme.colors.gradient}
              tintColor={theme.colors.primary}
              onRefresh={handleGetDetail}
            />
          }
          style={styles.scrollWrap}
          contentContainerStyle={styles.scrollCon}
          showsVerticalScrollIndicator={false}
          ref={scrollView}
          renderItem={renderCommentItem}
          ListEmptyComponent={
            loaded && (
              <EmptyState
                label={!comment?.loading && 'Be the first person to comment!'}
              />
            )
          }
          ListHeaderComponent={
            <>
              {loaded && status?.error && (
                <EmptyState label={status?.error?.message || status?.error} />
              )}
              {data ? (
                <>
                  <HangoutBody
                    isMinCapacity={data?.isMinCapacity}
                    description={data?.status}
                    // thumbnail={data?.media?.data?.path}
                    thumbnail={data?.media?.data}
                    id={data?.id}
                    media={data?.media?.data}
                    type="status"
                  />
                  <View style={styles.hangoutActionsWrap}>
                    <HangoutAction
                      onPressLike={onPressLike}
                      onPressComment={() => {
                        commentRef?.current?.focus();
                      }}
                      liked={data?.liked}
                      showHangout={false}
                      showMessage={false}
                      onPressShare={sharePostStatus}
                      like={data?.like_count}
                    />
                  </View>
                  <View style={styles.hangoutCountWrap}>
                    <HangoutCount
                      comment={data?.commentCount}
                      like={data?.like_count}
                      hideGuest
                      onPressLike={() =>
                        navigation.push('UserLiked', {id: data?.id})
                      }
                    />
                  </View>
                </>
              ) : (
                <View style={styles.placeWrapper}>
                  <Placeholder Animation={Fade}>
                    <PlaceholderLine width={60} style={styles.placeTitle} />
                    <PlaceholderLine width={90} />
                    <PlaceholderLine width={20} />
                    <PlaceholderMedia style={styles.placeCover} />
                    <View style={styles.placeMetaWrap}>
                      <PlaceholderLine width={70} />
                      <PlaceholderLine width={50} />
                    </View>
                  </Placeholder>
                </View>
              )}
              {commentPage < comment?.lastPage && data && (
                <Touchable
                  style={comment?.loading && styles.disabled}
                  disabled={Boolean(comment?.loading)}
                  onPress={loadMoreComment}>
                  <Text style={styles.loadPreviousComment}>
                    Load previous comments...
                  </Text>
                </Touchable>
              )}
            </>
          }
        />
        <View style={styles.commentComposer}>
          <View style={styles.commentInputWrap}>
            <TextInput
              ref={commentRef}
              allowFontScaling={false}
              style={styles.commentInput}
              placeholder={editing?.body || 'Write a comment...'}
              placeholderTextColor={theme.colors.grayLight}
              selectionColor={theme.colors.primary}
              disabled={!loaded}
              multiline={false}
              value={commentValue}
              onChangeText={(value) => setCommentValue(value)}
            />
          </View>
          <Touchable
            onPress={handlePostComment}
            disabled={!loaded || comment?.posting || !commentValue}
            style={[
              styles.commentSend,
              (!loaded || comment?.posting || !commentValue) && styles.disabled,
            ]}>
            <MaskedView
              maskElement={
                <MaterialCommunityIcons name="send" size={getSize.f(30)} />
              }>
              <LinearGradient style={styles.maskOverlay} {...gradientProps} />
            </MaskedView>
          </Touchable>
        </View>
        {Platform.OS === 'ios' && <KeyboardAvoidingView behavior="padding" />}
      </>
    </Wrapper>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  headerWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: getSize.w(14),
    paddingRight: getSize.w(24),
    paddingTop: getStatusBarHeight() + getSize.h(20),
    paddingBottom: getSize.h(20),
    backgroundColor: orangeLight.colors.paper,
    height: getStatusBarHeight() + getSize.h(70),
    zIndex: 1,
    ...orangeLight.shadow.large.ios,
    ...orangeLight.shadow.large.android,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtn: {
    marginRight: getSize.w(15),
  },
  scrollWrap: {
    flex: 1,
    backgroundColor: orangeLight.colors.paper,
  },
  scrollCon: {
    paddingBottom: getSize.h(20),
  },
  commentComposer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: getSize.w(24),
    paddingVertical: getSize.h(10),
    paddingBottom: getSize.h(10),
    backgroundColor: orangeLight.colors.paper,
    ...orangeLight.shadow.large.ios,
    ...orangeLight.shadow.large.android,
  },
  commentInputWrap: {
    height: getSize.h(48),
    borderRadius: getSize.h(48 / 2),
    backgroundColor: orangeLight.colors.background,
    paddingHorizontal: getSize.w(24),
    justifyContent: 'center',
    width: width - getSize.w(48 + 40),
  },
  commentInput: {
    fontFamily: orangeLight.fonts.sfPro.regular,
    fontSize: getSize.f(15),
    color: orangeLight.colors.text,
  },
  commentSend: {
    width: getSize.w(30),
    marginLeft: getSize.w(10),
  },
  maskOverlay: {
    width: getSize.w(30),
    height: getSize.w(30),
  },
  flex1: {flex: 1},
  hangoutActionsWrap: {
    borderTopColor: orangeLight.colors.divider,
    borderTopWidth: getSize.h(1),
    borderBottomColor: orangeLight.colors.divider,
    borderBottomWidth: getSize.h(1),
    marginTop: getSize.h(20),
  },
  hangoutCountWrap: {
    borderBottomColor: orangeLight.colors.divider,
    borderBottomWidth: getSize.h(1),
  },
  placeWrapper: {
    paddingHorizontal: getSize.w(24),
    paddingVertical: getSize.w(20),
  },
  placeCover: {
    marginTop: getSize.h(20),
    height: getSize.h(183),
    width: width - getSize.w(48),
    borderRadius: getSize.h(10),
  },
  placeTitle: {
    height: getSize.h(15),
    marginBottom: getSize.h(20),
  },
  placeMetaWrap: {
    marginTop: getSize.h(25),
    marginBottom: getSize.h(10),
    marginLeft: getSize.w(35),
  },
  disabled: {
    opacity: 0.3,
  },
  loadPreviousComment: {
    marginHorizontal: getSize.w(24),
    marginTop: getSize.h(20),
    fontFamily: orangeLight.fonts.sfPro.medium,
  },
});

export default StatusDetailScreen;
