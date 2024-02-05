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
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import MaskedView from '@react-native-community/masked-view';
import {
  Placeholder,
  PlaceholderLine,
  PlaceholderMedia,
  Fade,
} from 'rn-placeholder';
import {useDispatch, useSelector} from 'react-redux';
import uuid from 'uuid/v4';

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
  createOffer,
  getDetailHangout,
  toggleLikeHangout,
  showModalize,
  hideModalize,
  deleteHangout,
  getCommentList,
  postComment,
  editComment,
  createChatRoom,
  sendMessage,
  newCommentFromSocket,
} from 'actions';
import {echo} from 'utils/socketService';
import {shareMultipleMediaFile, shareDownloadImage} from 'utils/share';

import orangeLight from '../../theme/orangeLight';
import {Alert} from 'react-native';
import {Modal} from 'react-native';
import InputChooseCardPayment from '../../components/InputChooseCardPayment';
import Button from '../../components/Button';
import ModalChooseCardPayment from '../../components/ModalChooseCardPayment';
import {getPaymentString} from 'utils/mixed';
import ModalChooseCryptoPayment from 'components/ModalChooseCryptoPayment';
import {Linking} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import {Icons} from 'utils/icon';

const width = Dimensions.get('window').width;

const HangoutDetail = ({navigation, route}) => {
  const {commentFocused, hangoutId, initialValue} = route.params;

  const commentRef = useRef(null);
  const scrollView = useRef(null);

  const dispatch = useDispatch();

  const hangout = useSelector((state) => state.feedDetail.hangout[hangoutId]);
  const comment = useSelector((state) => state.feedDetail.comment[hangoutId]);
  const {beingCreateRoom, beingSendMessage} = useSelector(
    (state) => state.chat,
  );
  const {beingCreateOffer} = useSelector((state) => state.feed);
  const userInfo = useSelector((state) => state.auth.userInfo);

  const [commentValue, setCommentValue] = useState('');
  const [editing, setEditing] = useState(null);
  const [commentPage, setCommentPage] = useState(1);
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const refModalChooseCardPayment = useRef(null);
  const refModalChooseCyptoAddressPayment = useRef(null);

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
      paddingTop: insets.top + getSize.h(20),
      paddingBottom: getSize.h(20),
      backgroundColor: orangeLight.colors.paper,
      height: insets.top + getSize.h(70),
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
      paddingVertical: 0,
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
    emptyPostImg: {
      width: getSize.h(100),
      height: getSize.h(100),
    },
    emptyPostWrap: {
      marginTop: getSize.h(100),
    },
  });

  function handleNewComment(event) {
    dispatch(newCommentFromSocket(event.data));
  }

  useEffect(() => {
    echo
      .private(`user.${userInfo?.id}`)
      .listen(`.comment.${hangoutId}`, handleNewComment);

    return () => {
      echo
        .private(`user.${userInfo?.id}`)
        .stopListening(`.comment.${hangoutId}`);
    };
  }, [hangoutId]);

  const handleGetDetail = (callback) => {
    if (!hangoutId) {
      return;
    }
    dispatch(getDetailHangout(hangoutId, callback));
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

  const data = hangout?.data || initialValue;

  const loaded = !hangout?.loading && data && !Array.isArray(data);

  useEffect(() => {
    if (commentFocused && data) {
      commentRef?.current?.focus();
    }
  }, [commentFocused, data?.id]);

  function loadCommentList(p = commentPage) {
    dispatch(getCommentList({id: hangoutId, type: 'hangout', page: p}));
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

  const isOwn = data?.user?.data?.id === userInfo?.id;
  const isPrivate = Boolean(data?.room_id);

  const showOptions = () =>
    dispatch(
      showModalize([
        {
          label: 'Send Hangout to user',
          icon: (
            <MaterialCommunityIcons
              size={getSize.f(22)}
              color={theme.colors.primary}
              name="arrow-right-bold"
            />
          ),
          onPress: () => {
            dispatch(hideModalize());
            navigation.navigate('SelectFriend', {
              sendLabel: 'Send',
              onSend: (selected) => {
                dispatch(
                  createChatRoom({members: selected}, (result) => {
                    if (result?.data) {
                      dispatch(
                        sendMessage(
                          {
                            room_id: result.data?.id,
                            tmpId: uuid(),
                            hangout: hangoutId,
                            user: {
                              id: userInfo?.id,
                              name: userInfo?.name,
                              avatar: userInfo.avatar,
                            },
                          },
                          {
                            success: () => {
                              navigation.goBack();
                              navigation.navigate('ChatRoom', {data: result});
                            },
                          },
                        ),
                      );
                    }
                  }),
                );
              },
            });
          },
          hide: isPrivate,
        },
        // {
        //   label: 'Hide Hangout from News Feed',
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
          label: 'Edit Hangout',
          icon: (
            <MaterialIcons
              size={getSize.f(20)}
              color={theme.colors.primary}
              name="edit"
            />
          ),
          onPress: () => {
            dispatch(hideModalize());
            navigation.navigate('EditHangout', {hangout: hangout?.data});
          },
          hide: !isOwn,
        },
        {
          label: 'Delete Hangout',
          icon: (
            <MaterialCommunityIcons
              size={getSize.f(20)}
              color={theme.colors.primary}
              name="delete"
            />
          ),
          onPress: () => {
            Alert.alert(
              'Delete Hangout',
              'Are you sure you want to delete this Hangout?',
              [
                {
                  text: 'Yes',
                  onPress: () =>
                    dispatch(
                      deleteHangout(data.id, () => {
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
          hide: !isOwn,
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
              type: 'hangout',
            });
          },
          hide: isOwn,
        },
      ]),
    );

  const gradientProps = {
    colors: theme.colors.gradient,
    start: {x: 0, y: 0},
    end: {x: 1, y: 0},
  };

  if (!hangoutId) {
    return null;
  }

  const handleCreateHangoutOffer = () => {
    dispatch(
      createOffer({
        hangoutId: data.id,
        userId: data?.user?.data?.id,
      }),
    );

    // data.payment_method === 'credit' && refModalChooseCardPayment.current.open()
    // data.payment_method === 'crypto' &&
    //   refModalChooseCyptoAddressPayment.current.open()

    // data.payment_method === 'both' &&
    //   dispatch(
    //     showModalize([
    //       {
    //         label: 'Credit Payment',
    //         icon: (
    //           <MaterialCommunityIcons
    //             name='wallet'
    //             color={theme.colors.primary}
    //             size={getSize.f(22)}
    //           />
    //         ),
    //         onPress: () => {
    //           dispatch(hideModalize())
    //           refModalChooseCardPayment.current.open()
    //         },
    //       },
    //       {
    //         label: 'Crypto Payment',
    //         icon: (
    //           <MaterialCommunityIcons
    //             name='wallet'
    //             color={theme.colors.primary}
    //             size={getSize.f(22)}
    //           />
    //         ),
    //         onPress: () => {
    //           dispatch(hideModalize())
    //           refModalChooseCyptoAddressPayment.current.open()
    //         },
    //       },
    //       {
    //         label: 'Cancel',
    //         icon: (
    //           <MaterialCommunityIcons
    //             name='cancel'
    //             color={theme.colors.primary}
    //             size={getSize.f(22)}
    //           />
    //         ),
    //         onPress: () => {
    //           dispatch(hideModalize())
    //         },
    //       },
    //     ]),
    //   )
  };

  function handlePostComment() {
    if (commentValue) {
      if (editing) {
        dispatch(
          editComment({id: editing.id, body: commentValue, hangoutId}, () => {
            setCommentValue('');
            setEditing(null);
            Keyboard.dismiss();
          }),
        );
      } else {
        dispatch(
          postComment(
            {id: hangoutId, type: 'hangout', body: commentValue},
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
  const onPressLike = () =>
    dispatch(
      toggleLikeHangout({
        hangoutId: data?.id,
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
        Object.assign(data, {type: 'hangout'}),
        urlImage,
      );
    }

    async function sharePost() {
      await shareMultipleMediaFile(
        'Kizuner',
        title + address + ' ' + data?.description,
        urlFile,
        Object.assign(data, {type: 'hangout'}),
        !data?.liked && onPressLike,
      );
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
        hangoutId={hangoutId}
      />
    );
  }

  return (
    <>
      <ModalChooseCardPayment
        ref={refModalChooseCardPayment}
        onConfirm={(id) => {
          dispatch(
            createOffer({
              hangoutId,
              userId: data?.user?.data?.id,
              payment_method: 'credit',
              card_id: id,
            }),
          );
        }}
      />

      <ModalChooseCryptoPayment
        ref={refModalChooseCyptoAddressPayment}
        onConfirm={({currency, crypto}) => {
          dispatch(
            createOffer(
              {
                hangoutId: data.id,
                userId: data?.user?.data?.id,
                payment_method: 'crypto',
                currency,
                cryptoId: crypto.id,
              },
              (data) => {
                Alert.alert(
                  'Payment',
                  'You need to finish payment to hangout now!',
                  [
                    {
                      text: 'Pay now',
                      onPress: async () => {
                        const invoiceUrl = data.data.invoice_url;

                        const supported = await Linking.canOpenURL(invoiceUrl);
                        if (supported) {
                          await Linking.openURL(invoiceUrl);

                          return;
                        }

                        Alert.alert(
                          'Warning',
                          `We can not open link automatically, please pay manually by: ${invoiceUrl}`,
                          [
                            {
                              text: 'Copy link',
                              onPress: () => {
                                Clipboard.setString(invoiceUrl);
                              },
                            },
                            {
                              text: 'Cancel',
                            },
                          ],
                        );
                      },
                    },
                  ],
                );
              },
            ),
          );
        }}
      />

      <Wrapper style={styles.wrapper}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.headerWrapper}>
          <View style={styles.headerLeft}>
            <Touchable
              style={styles.backBtn}
              onPress={() => navigation.goBack()}>
              <MaterialCommunityIcons
                name="chevron-left"
                color={theme.colors.primary}
                size={getSize.f(34)}
              />
            </Touchable>
            {data && <HangoutUser data={data} />}
          </View>
          {data && (isOwn || !isPrivate) && (
            <Touchable onPress={showOptions}>
              <MaterialCommunityIcons
                name="dots-vertical"
                size={getSize.f(24)}
                color={theme.colors.text}
              />
            </Touchable>
          )}
        </View>
        {(hangout?.loading || hangout?.data) &&
        !Array.isArray(hangout?.data) ? (
          <>
            <FlatList
              data={comment?.list}
              keyExtractor={(i) => i.id}
              refreshControl={
                <RefreshControl
                  refreshing={hangout?.loading}
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
                    label={
                      !comment?.loading && 'Be the first person to comment!'
                    }
                  />
                )
              }
              ListHeaderComponent={
                <>
                  {loaded && hangout?.error && (
                    <EmptyState
                      label={hangout?.error?.message || hangout?.error}
                    />
                  )}
                  {data ? (
                    <>
                      <HangoutBody
                        isMinCapacity={data?.isMinCapacity}
                        title={data?.title}
                        description={data?.description}
                        // thumbnail={data?.media?.data?.path}
                        thumbnail={data?.media?.data}
                        amount={
                          !!data.is_range_price
                            ? `${data.min_amount} - ${data.max_amount}`
                            : data.amount
                        }
                        currencyMethod={getPaymentString(data.payment_method)}
                        date={data?.date}
                        location={data?.location}
                        start={data?.start}
                        end={data?.end}
                        capacity={data?.capacity}
                        specialties={data?.skills?.data}
                        categories={data.categories?.data}
                        schedule={data?.schedule}
                        id={data?.id}
                        show_hangout={data?.show_hangout}
                        disableGuest={data?.user?.data?.id !== userInfo?.id}
                        media={data?.media?.data}
                        type={'hangout'}
                      />
                      <View style={styles.hangoutActionsWrap}>
                        <HangoutAction
                          // showFakeHelps={true}
                          // onPressFakeHelps={() => {
                          //   navigation.navigate('FakeHelps', {
                          //     helps: data?.helps,
                          //   })
                          //   return
                          // }}
                          onPressShare={!isPrivate && sharePostStatus}
                          showHangout={!data?.schedule && data?.show_hangout}
                          // showFindNearFriend
                          // onPressFindNearFriend={() => {
                          //   navigation.navigate('NearFriend', {
                          //     casts: data?.casts,
                          //   })
                          // }}
                          offered={data?.offered}
                          hangoutLoading={beingCreateOffer?.includes(hangoutId)}
                          hangoutOnPress={() =>
                            data?.offered
                              ? navigation.navigate('CastManagement')
                              : handleCreateHangoutOffer()
                          }
                          showMessage={
                            data?.type === 2 &&
                            data?.user?.data?.id !== userInfo?.id
                          }
                          messageLoading={
                            beingCreateRoom || beingSendMessage.length > 0
                          }
                          handlePressMessage={() => {
                            dispatch(
                              createChatRoom(
                                {members: [data?.user?.data?.id]},
                                (result) => {
                                  if (result?.data) {
                                    dispatch(
                                      sendMessage(
                                        {
                                          room_id: result.data?.id,
                                          tmpId: uuid(),
                                          help: data?.id,
                                          user: {
                                            id: userInfo?.id,
                                            name: userInfo?.name,
                                            avatar: userInfo.avatar,
                                          },
                                        },
                                        {
                                          success: () => {
                                            navigation.goBack();
                                            navigation.navigate('ChatRoom', {
                                              data: result,
                                            });
                                          },
                                        },
                                      ),
                                    );
                                  }
                                },
                              ),
                            );
                          }}
                          onPressLike={onPressLike}
                          onPressComment={() => {
                            commentRef?.current?.focus();
                          }}
                          liked={data?.liked}
                        />
                      </View>
                      <View style={styles.hangoutCountWrap}>
                        <HangoutCount
                          hangout={data?.offers_count}
                          help={data?.offers_count}
                          comment={data?.comment_count}
                          like={data?.like_count}
                          showHangout={data?.show_hangout}
                          hideGuest={data?.schedule}
                          disableGuest={data?.user?.data?.id !== userInfo?.id}
                          onPressLike={() =>
                            navigation.push('UserLiked', {id: data?.id})
                          }
                          onPressHangout={() =>
                            navigation.navigate('GuestList', {
                              hangoutId: data?.id,
                              capacity: data?.capacity,
                              start: data?.start,
                              end: data?.end,
                            })
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
                      disabled={comment?.loading}
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
                  allowFontScaling={false}
                  ref={commentRef}
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
                  (!loaded || comment?.posting || !commentValue) &&
                    styles.disabled,
                ]}>
                <MaskedView
                  maskElement={
                    <MaterialCommunityIcons name="send" size={getSize.f(30)} />
                  }>
                  <LinearGradient
                    style={styles.maskOverlay}
                    {...gradientProps}
                  />
                </MaskedView>
              </Touchable>
            </View>
            {Platform.OS === 'ios' && (
              <KeyboardAvoidingView behavior="padding" />
            )}
          </>
        ) : (
          <FlatList
            data={[]}
            refreshControl={
              <RefreshControl
                refreshing={hangout?.loading}
                colors={theme.colors.gradient}
                tintColor={theme.colors.primary}
                onRefresh={handleGetDetail}
              />
            }
            style={styles.scrollWrap}
            contentContainerStyle={styles.scrollCon}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <EmptyState
                imageSource={Icons.emptyPostImg}
                label="This post has been deleted!"
                imageStyle={styles.emptyPostImg}
                wrapperStyle={styles.emptyPostWrap}
              />
            }
          />
        )}
      </Wrapper>
    </>
  );
};

export default HangoutDetail;
