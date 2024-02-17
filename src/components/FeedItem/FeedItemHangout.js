import React, {useRef, memo} from 'react';
import {StyleSheet, View} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useSelector} from 'react-redux';
import uuid from 'uuid/v4';
import moment from 'moment';
import {useDispatch} from 'react-redux';

import useTheme from 'theme';
import {getSize} from 'utils/responsive';
import {
  toggleLikeHangout,
  showModalize,
  createOffer,
  hideModalize,
  deleteHangout,
  createChatRoom,
  sendMessage,
} from 'actions';
import {Touchable, Paper} from 'components';
import NavigationService from 'navigation/service';
import {shareDownloadImage, shareMultipleMediaFile} from 'utils/share';

import HangoutAction from './HangoutAction';
import HangoutBody from './HangoutBody';
import HangoutCount from './HangoutCount';
import HangoutUser from './HangoutUser';
import {EnumHangoutStatus} from 'utils/constants';
import {isExpriedTime} from 'utils/datetime';
import {Alert} from 'react-native';
import ModalChooseCardPayment from 'components/ModalChooseCardPayment';
import {getPaymentString} from 'utils/mixed';
import ModalChooseCryptoPayment from 'components/ModalChooseCryptoPayment';
import {Linking} from 'react-native';

import Clipboard from '@react-native-clipboard/clipboard';

const FeedItemHangout = ({type, data, isChangeStatus, enableShare = true}) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const {beingCreateOffer} = useSelector((state) => state.feed);
  const userInfo = useSelector((state) => state.auth.userInfo);
  const {beingCreateRoom, beingSendMessage} = useSelector(
    (state) => state.chat,
  );

  const isOwn = data?.user?.data?.id === userInfo?.id;
  const refModalChooseCardPayment = useRef(null);
  const refModalChooseCyptoAddressPayment = useRef(null);

  const dataSelectHangout = isChangeStatus
    ? [
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
            NavigationService.navigate('SelectFriend', {
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
                            hangout: data.id,
                            user: {
                              id: userInfo?.id,
                              name: userInfo?.name,
                              avatar: userInfo.avatar,
                            },
                          },
                          {
                            success: () => {
                              NavigationService.goBack();
                              NavigationService.navigate('ChatRoom', {
                                data: result,
                              });
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
            NavigationService.navigate('EditHangout', {hangout: data});
          },
          hide: !isOwn || isExpriedTime(data.end),
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
                      deleteHangout(data.id, () => dispatch(hideModalize())),
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
            NavigationService.push('ReportContent', {
              id: data?.id,
              type: 'hangout',
            });
          },
          hide: isOwn,
        },
      ]
    : [
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
            NavigationService.navigate('SelectFriend', {
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
                            hangout: data.id,
                            user: {
                              id: userInfo?.id,
                              name: userInfo?.name,
                              avatar: userInfo.avatar,
                            },
                          },
                          {
                            success: () => {
                              NavigationService.goBack();
                              NavigationService.navigate('ChatRoom', {
                                data: result,
                              });
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
            NavigationService.navigate('EditHangout', {hangout: data});
          },
          hide: !isOwn || isExpriedTime(data.end),
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
                      deleteHangout(data.id, () => dispatch(hideModalize())),
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
            NavigationService.push('ReportContent', {
              id: data?.id,
              type: 'hangout',
            });
          },
          hide: isOwn,
        },
      ];

  const styles = StyleSheet.create({
    wrapper: {
      marginBottom: getSize.h(20),
    },
    hangoutHead: {
      paddingHorizontal: getSize.w(24),
      borderBottomColor: theme.colors.divider,
      borderBottomWidth: getSize.h(1),
      paddingVertical: getSize.h(15),
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    hangoutCountWrap: {
      borderTopColor: theme.colors.divider,
      borderTopWidth: getSize.h(
        data?.skills?.data?.length > 0 || !data?.capacity ? 1 : 0,
      ),
      borderBottomColor: theme.colors.divider,
      borderBottomWidth: getSize.h(1),
      marginTop: getSize.h(
        data?.skills?.data?.length > 0 ? 20 : !data?.capacity ? 10 : 0,
      ),
    },
    statusCountWrap: {
      borderBottomColor: theme.colors.divider,
      borderBottomWidth: getSize.h(1),
      marginTop: 0,
    },
  });

  if (!data) {
    return null;
  }

  function handlePressBody() {
    NavigationService.push('HangoutDetail', {
      hangoutId: data?.id,
    });
    return;
  }

  function handlePressComment() {
    NavigationService.push('HangoutDetail', {
      commentFocused: true,
      hangoutId: data.id,
    });
  }

  const handleCreateHangoutOffer = () => {
    dispatch(
      createOffer({
        hangoutId: data.id,
        userId: data?.user?.data?.id,
      }),
    );
  };

  const isPrivate = Boolean(data?.room_id);

  const onPressLike = () => {
    dispatch(
      toggleLikeHangout({
        hangoutId: data.id,
        userId: data?.user?.data?.id,
      }),
    );
  };

  const sharePostStatus = async () => {
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

    async function sharePost() {
      await shareMultipleMediaFile(
        'Kizuner',
        title + address + ' ' + data?.description,
        urlFile,
        Object.assign(data, {type: 'hangout'}),
        // !data?.liked && onPressLike,
      );
    }
  };

  const showHangoutOptions = () => dispatch(showModalize(dataSelectHangout));
  const setMess = () => {
    dispatch(
      createChatRoom({members: [data?.user?.data?.id]}, (result) => {
        if (result?.data) {
          dispatch(
            sendMessage(
              {
                room_id: result.data?.id,
                tmpId: uuid(),
                hangout: data.id,
                user: {
                  id: userInfo?.id,
                  name: userInfo?.name,
                  avatar: userInfo.avatar,
                },
              },
              {
                success: () => {
                  NavigationService.push('ChatRoom', {
                    data: result,
                  });
                },
              },
            ),
          );
        }
      }),
    );
  };
  const ModalCard = () => {
    return (
      <ModalChooseCardPayment
        ref={refModalChooseCardPayment}
        onConfirm={(id) => {
          dispatch(
            createOffer({
              hangoutId: data.id,
              userId: data?.user?.data?.id,
              payment_method: 'credit',
              card_id: id,
            }),
          );
        }}
      />
    );
  };
  const ModalCrypto = () => {
    return (
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
    );
  };
  return (
    <>
      {ModalCard()}
      {ModalCrypto()}
      <Paper noBorder style={styles.wrapper}>
        <View style={styles.hangoutHead}>
          <HangoutUser data={data} />
          <Touchable onPress={showHangoutOptions}>
            <MaterialCommunityIcons
              name="dots-vertical"
              size={getSize.f(24)}
              color={theme.colors.text}
            />
          </Touchable>
        </View>
        <HangoutBody
          isMinCapacity={data?.isMinCapacity}
          title={data.title}
          description={data.description}
          thumbnail={data?.media?.data}
          amount={
            !!data.is_range_price
              ? `${data.min_amount} - ${data.max_amount}`
              : data.amount
          }
          currencyMethod={getPaymentString(data.payment_method)}
          date={data.date}
          location={data.location}
          start={data.start}
          end={data.end}
          capacity={data?.capacity}
          specialties={data.skills?.data}
          categories={data.categories?.data}
          schedule={data.schedule}
          id={data.id}
          show_hangout={data.show_hangout}
          onPress={handlePressBody}
          disableGuest={data?.user?.data?.id !== userInfo?.id}
          availableStatus={data.available_status}
          media={data?.media?.data}
          type={type}
        />
        <InfoReaction
          style={styles.hangoutCountWrap}
          type={type}
          hangout={data.offers_count}
          comment={data.comment_count}
          like={data.like_count}
          showHangout={!data.schedule && data.show_hangout}
          hideGuest={data.schedule}
          disableGuest={data?.user?.data?.id !== userInfo?.id}
          setLike={() => NavigationService.push('UserLiked', {id: data?.id})}
          setHangout={() =>
            NavigationService.navigate('GuestList', {
              hangoutId: data.id,
              capacity: data?.capacity,
              start: data.start,
              end: data.end,
            })
          }
        />
        <FooterReaction
          type={type}
          showHangout={
            !data.schedule && data.show_hangout && !data.is_range_price
          }
          data={data}
          showMessage={(data.type === 2 || !!data.is_range_price) && !isOwn}
          messageLoading={beingCreateRoom || beingSendMessage.length > 0}
          onPressShare={enableShare && !isPrivate && sharePostStatus}
          countLike={data.like_count}
          offered={data.offered}
          liked={data.liked}
          setMess={setMess}
          onPressComment={handlePressComment}
          onPressLike={onPressLike}
          hangoutLoading={beingCreateOffer?.includes(data.id)}
          hangoutOnPress={() =>
            data.offered
              ? NavigationService.navigate('CastManagement')
              : handleCreateHangoutOffer()
          }
        />
      </Paper>
    </>
  );
};
const InfoReaction = memo((props) => {
  return (
    <View style={props.styles}>
      <HangoutCount
        type={props.type}
        hangout={props.hangout}
        comment={props.comment}
        like={props.like}
        showHangout={props.showHangout}
        hideGuest={props.hideGuest}
        disableGuest={props.disableGuest ? true : false}
        onPressLike={props.setLike}
        onPressHangout={props.setHangout}
      />
    </View>
  );
});
const FooterReaction = memo((props) => {
  return (
    <HangoutAction
      type={props.type}
      showHangout={props.showHangout}
      data={props.data}
      showMessage={props.showMessage}
      messageLoading={props.messageLoading}
      onPressShare={props.onPressShare}
      like={props.countLike}
      handlePressMessage={props.setMess}
      offered={props.offered}
      liked={props.liked}
      onPressComment={props.onPressComment}
      onPressLike={props.onPressLike}
      hangoutLoading={props.hangoutLoading}
      hangoutOnPress={props.hangoutOnPress}
    />
  );
});
export default FeedItemHangout;
