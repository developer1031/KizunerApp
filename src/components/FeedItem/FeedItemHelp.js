import React, {memo, useCallback, useRef, useState} from 'react';
import {StyleSheet, View, Alert} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useSelector} from 'react-redux';
import uuid from 'uuid/v4';
import moment from 'moment';
import _ from 'lodash';
import {useDispatch} from 'react-redux';

import useTheme from 'theme';
import {getSize} from 'utils/responsive';
import {
  toggleLikeHelp,
  showModalize,
  hideModalize,
  createChatRoom,
  sendMessage,
  deleteHelp,
  changeHelpStatus,
  createOfferHelp,
  showAlert,
} from 'actions';
import {Touchable, Paper} from 'components';
import NavigationService from 'navigation/service';
import {shareMultipleMediaFile, shareDownloadImage} from 'utils/share';

import HangoutAction from './HangoutAction';
import HangoutBody from './HangoutBody';
import HangoutCount from './HangoutCount';
import HangoutUser from './HangoutUser';
import {EnumHangoutStatus} from 'utils/constants';
import {isExpriedTime} from 'utils/datetime';
import ModalChooseCryptoPayment from 'components/ModalChooseCryptoPayment';
import {getPaymentString} from 'utils/mixed';

const FeedItemHelp = ({type, data, isChangeStatus, enableShare = true}) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const {beingCreateOfferHelp} = useSelector((state) => state.feed);
  const userInfo = useSelector((state) => state.auth.userInfo);
  const [loadId, setLoadId] = useState(null);

  const {beingCreateRoom, beingSendMessage} = useSelector(
    (state) => state.chat,
  );

  const isOwn = data?.user?.data?.id === userInfo?.id;

  const refModalChooseCrypto = useRef(null);

  const dataSelectHelp = isChangeStatus
    ? [
        {
          label: 'Send Help to user',
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
                            help: data.id,
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
          label: 'Edit Help',
          icon: (
            <MaterialIcons
              size={getSize.f(20)}
              color={theme.colors.primary}
              name="edit"
            />
          ),
          onPress: () => {
            dispatch(hideModalize());
            NavigationService.navigate('EditHelp', {help: data});
          },
          hide: !isOwn || isExpriedTime(data.end),
        },
        {
          label: 'Delete Help',
          icon: (
            <MaterialCommunityIcons
              size={getSize.f(20)}
              color={theme.colors.primary}
              name="delete"
            />
          ),
          onPress: () => {
            Alert.alert(
              'Delete Help',
              'Are you sure you want to delete this Help?',
              [
                {
                  text: 'Yes',
                  onPress: () =>
                    dispatch(
                      deleteHelp(data.id, () => dispatch(hideModalize())),
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
          label: 'Report This Help',
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
              type: 'help',
            });
          },
          hide: isOwn,
        },
      ]
    : [
        {
          label: 'Send Help to user',
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
                            help: data.id,
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
          label: 'Edit Help',
          icon: (
            <MaterialIcons
              size={getSize.f(20)}
              color={theme.colors.primary}
              name="edit"
            />
          ),
          onPress: () => {
            dispatch(hideModalize());
            NavigationService.navigate('EditHelp', {help: data});
          },
          hide: !isOwn || isExpriedTime(data.end),
        },
        {
          label: 'Delete Help',
          icon: (
            <MaterialCommunityIcons
              size={getSize.f(20)}
              color={theme.colors.primary}
              name="delete"
            />
          ),
          onPress: () => {
            Alert.alert(
              'Delete Help',
              'Are you sure you want to delete this Help?',
              [
                {
                  text: 'Yes',
                  onPress: () =>
                    dispatch(
                      deleteHelp(data.id, () => dispatch(hideModalize())),
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
          label: 'Report This Help',
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
              type: 'help',
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
    NavigationService.push('HelpDetail', {
      helpId: data?.id,
    });
    return;
  }

  function handlePressComment() {
    NavigationService.push('HelpDetail', {
      commentFocused: true,
      helpId: data.id,
    });
  }

  const isPrivate = Boolean(data?.room_id);

  const onPressLike = () =>
    dispatch(
      toggleLikeHelp({
        helpId: data.id,
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
        Object.assign(data, {type: 'help'}),
        urlImage,
      );
    }

    async function sharePost() {
      await shareMultipleMediaFile(
        'Kizuner',
        title + address + ' ' + data?.description,
        urlFile,
        Object.assign(data, {type: 'help'}),
        // !data?.liked && onPressLike,
      );
    }
  }

  const showHelpOptions = () => dispatch(showModalize(dataSelectHelp));

  const _pressMessage = () => {
    dispatch(
      createChatRoom({members: [data?.user?.data?.id]}, (result) => {
        if (result?.data) {
          dispatch(
            sendMessage(
              {
                room_id: result.data?.id,
                tmpId: uuid(),
                help: data.id,
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
  const helpOnPress = () => {
    setLoadId(data.id);
    data.offered
      ? NavigationService.navigate('CastHelpManagement')
      : data.payment_method === 'credit'
      ? _setApproveHelp()
      : refModalChooseCrypto.current?.open();
  };
  const _setApproveHelp = () => {
    const debouncedFunction = _.debounce(() => {
      const _data = {
        helpId: data.id,
        userId: data?.user?.data?.id,
        type: type,
      };

      dispatch(createOfferHelp(_data));
    }, 200);

    debouncedFunction();
  };

  const _setApproveHelpCrypto = ({crypto}) => {
    const debouncedFunction = _.debounce(() => {
      const _data = {
        helpId: data.id,
        userId: data?.user?.data?.id,
        type: type,
        cryptoId: crypto.id,
      };
      dispatch(createOfferHelp(_data));
    }, 200);

    debouncedFunction();
  };

  const setLike = () => {
    NavigationService.push('UserLiked', {id: data?.id});
  };

  const setHelp = () => {
    NavigationService.navigate('GuestHelpList', {
      helpId: data.id,
      capacity: data?.capacity,
      start: data.start,
      end: data.end,
    });
  };
  const _setCancel = () => {
    setLoadId(null);
  };
  const ModalCrypto = () => {
    return (
      <ModalChooseCryptoPayment
        ref={refModalChooseCrypto}
        chooseCurrency={false}
        onConfirm={_setApproveHelpCrypto}
        onCancel={_setCancel}
      />
    );
  };

  return (
    <>
      {ModalCrypto()}
      <Paper noBorder style={styles.wrapper}>
        <View style={styles.hangoutHead}>
          <HangoutUser data={data} />
          <Touchable onPress={showHelpOptions}>
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
          show_help={data.show_help}
          onPress={handlePressBody}
          disableGuest={data?.user?.data?.id !== userInfo?.id}
          availableStatus={data.available_status}
          media={data?.media?.data}
          type={type}
        />
        <InfoReaction
          hangout={data.offers_count}
          help={data.offers_count}
          comment={data.comment_count}
          like={data.like_count}
          showHelp={!data.schedule && data.show_help}
          hideGuest={data.schedule}
          disableGuest={data?.user?.data?.id !== userInfo?.id}
          onPressLike={setLike}
          onPressHelp={setHelp}
          style={styles.hangoutCountWrap}
        />

        <FooterReaction
          invoiceUrl={
            isOwn ? data.payment_status === 'unpaid' && data.invoice_url : ''
          }
          showHelp={
            !data.schedule && data.show_help && !data.is_range_price && !isOwn
          }
          idLoadHelp={loadId == data.id}
          showMessage={(data.type === 2 || !!data.is_range_price) && !isOwn}
          messageLoading={beingCreateRoom || beingSendMessage.length > 0}
          onPressShare={enableShare && !isPrivate && sharePostStatus}
          offered={data.offered}
          like={data.like_count}
          liked={data.liked}
          hangoutLoading={beingCreateOfferHelp?.includes(data.id)}
          helpOnPress={helpOnPress}
          handlePressMessage={_pressMessage}
          onPressComment={handlePressComment}
          onPressLike={onPressLike}
        />
      </Paper>
    </>
  );
};
const InfoReaction = memo((props) => {
  return (
    <View style={props.styles}>
      <HangoutCount
        hangout={props.hangout}
        help={props.help}
        comment={props.comment}
        like={props.like}
        showHelp={props.showHelp}
        hideGuest={props.hideGuest}
        disableGuest={props.disableGuest}
        onPressLike={props.onPressLike}
        onPressHelp={props.onPressHelp}
      />
    </View>
  );
});
const FooterReaction = memo((props) => {
  return (
    <HangoutAction
      invoiceUrl={props.invoiceUrl}
      showHangout={false}
      showHelp={props.showHelp}
      idLoadHelp={props.idLoadHelp}
      showMessage={props.showMessage}
      messageLoading={props.messageLoading}
      onPressShare={props.onPressShare}
      like={props.like}
      handlePressMessage={props.handlePressMessage}
      offered={props.offered}
      liked={props.liked}
      onPressComment={props.handlePressComment}
      onPressLike={props.onPressLike}
      hangoutLoading={props.hangoutLoading}
      helpOnPress={props.helpOnPress}
    />
  );
});

export default FeedItemHelp;
