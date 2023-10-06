import React, {useCallback} from 'react';
import {StyleSheet, View} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useSelector} from 'react-redux';
import uuid from 'uuid/v4';

import {useDispatch} from 'react-redux';

import useTheme from 'theme';
import {getSize} from 'utils/responsive';
import {
  toggleLikeHangout,
  toggleLikeStatus,
  toggleLikeHelp,
  showModalize,
  createOffer,
  hideModalize,
  deleteHangout,
  deleteStatus,
  createChatRoom,
  sendMessage,
  reportContent,
  changeHangoutStatus,
  deleteHelp,
  changeHelpStatus,
} from 'actions';
import {Touchable, Paper} from 'components';
import NavigationService from 'navigation/service';
import {shareMultipleMediaFile, shareTitleWithUrl} from 'utils/share';

import HangoutAction from './HangoutAction';
import HangoutBody from './HangoutBody';
import HangoutCount from './HangoutCount';
import HangoutUser from './HangoutUser';
import {EnumHangoutStatus} from 'utils/constants';
import {Alert} from 'react-native';
import {getPaymentString} from 'utils/mixed';

const FeedItem = ({type, data, isChangeStatus}) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const {beingCreateOffer} = useSelector((state) => state.feed);
  const userInfo = useSelector((state) => state.auth.userInfo);
  const {beingCreateRoom, beingSendMessage} = useSelector(
    (state) => state.chat,
  );

  const hangoutStatus =
    data.available_status && data.available_status == EnumHangoutStatus.NO_TIME;
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
        // {
        //   label: hangoutStatus ? 'Set Online' : 'Set No time',
        //   icon: (
        //     <MaterialCommunityIcons
        //       size={getSize.f(22)}
        //       color={theme.colors.primary}
        //       name={hangoutStatus ? 'transfer-up' : 'transfer-down'}
        //     />
        //   ),
        //   onPress: () => {
        //     dispatch(
        //       changeHangoutStatus(
        //         data.id,
        //         data.available_status === EnumHangoutStatus.NO_TIME
        //           ? EnumHangoutStatus.ONLINE
        //           : EnumHangoutStatus.NO_TIME,
        //         () => dispatch(hideModalize()),
        //       ),
        //     );
        //   },
        //   hide: isPrivate,
        // },
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
            NavigationService.navigate('EditHangout', {hangout: data});
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
                  text: 'No',
                  onPress: () => dispatch(hideModalize()),
                },
                {
                  text: 'Yes',
                  onPress: () =>
                    dispatch(
                      deleteHangout(data.id, () => dispatch(hideModalize())),
                    ),
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
            NavigationService.navigate('EditHangout', {hangout: data});
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
                  onPress: () => dispatch(deleteHangout(data.id)),
                },
                {
                  text: 'No',
                },
              ],
            );
            dispatch(hideModalize());
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
          hide: true,
        },
        // {
        //   label: hangoutStatus ? 'Set Online' : 'Set No time',
        //   icon: (
        //     <MaterialCommunityIcons
        //       size={getSize.f(22)}
        //       color={theme.colors.primary}
        //       name={hangoutStatus ? 'transfer-up' : 'transfer-down'}
        //     />
        //   ),
        //   onPress: () => {
        //     dispatch(
        //       changeHelpStatus(
        //         data.id,
        //         data.available_status === EnumHangoutStatus.NO_TIME
        //           ? EnumHangoutStatus.ONLINE
        //           : EnumHangoutStatus.NO_TIME,
        //         () => dispatch(hideModalize()),
        //       ),
        //     );
        //   },
        //   hide: isPrivate,
        // },
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
          hide: !isOwn,
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
          hide: true,
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
          hide: !isOwn,
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
    switch (type) {
      case 'status':
        NavigationService.push('StatusDetail', {
          statusId: data?.id,
        });
        return;
      case 'hangout':
        NavigationService.push('HangoutDetail', {
          hangoutId: data?.id,
        });
        return;
      case 'help':
        NavigationService.push('HelpDetail', {
          helpId: data?.id,
        });
        return;
      default:
        return;
        break;
    }
  }

  function handlePressComment() {
    if (type === 'status') {
      NavigationService.push('StatusDetail', {
        commentFocused: true,
        statusId: data.id,
      });
    } else if (type === 'help') {
      NavigationService.push('HelpDetail', {
        commentFocused: true,
        helpId: data.id,
      });
    } else {
      NavigationService.push('HangoutDetail', {
        commentFocused: true,
        hangoutId: data.id,
      });
    }
  }

  const isOwn = data?.user?.data?.id === userInfo?.id;
  const isPrivate = Boolean(data?.room_id);

  const onPressLike =
    (type = 'status') =>
    () => {
      type === 'status' &&
        dispatch(
          toggleLikeStatus({
            statusId: data.id,
            userId: data?.user?.data?.id,
          }),
        );
      type === 'hangout' &&
        dispatch(
          toggleLikeHangout({
            hangoutId: data.id,
            userId: data?.user?.data?.id,
          }),
        );
      type === 'help' &&
        dispatch(
          toggleLikeHelp({
            helpId: data.id,
            userId: data?.user?.data?.id,
          }),
        );
    };

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
        Object.assign(data, {type: type}),
        urlImage,
      );
    }

    async function sharePost() {
      await shareMultipleMediaFile(
        'Kizuner',
        title + address + ' ' + data?.description,
        urlFile,
        Object.assign(data, {type: type}),
        !data?.liked && onPressLike(type),
      );
    }
  }

  const showHangoutOptions = () => dispatch(showModalize(dataSelectHangout));

  const showHelpOptions = () => dispatch(showModalize(dataSelectHelp));

  const showStatusOptions = () =>
    dispatch(
      showModalize([
        // {
        //   label: 'Hide Status from News Feed',
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
            NavigationService.navigate('UpdateStatus', {status: data});
          },
          hide: !isOwn,
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
                      deleteStatus(data.id, () => dispatch(hideModalize())),
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
          label: 'Report This Status',
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
              type: 'status',
            });
          },
          hide: isOwn,
        },
      ]),
    );

  if (type === 'status') {
    return (
      <Paper noBorder style={styles.wrapper}>
        <View style={styles.hangoutHead}>
          <HangoutUser data={data} />
          {isOwn && (
            <Touchable onPress={showStatusOptions}>
              <MaterialCommunityIcons
                name="dots-vertical"
                size={getSize.f(24)}
                color={theme.colors.text}
              />
            </Touchable>
          )}
        </View>
        <HangoutBody
          isMinCapacity={data?.isMinCapacity}
          description={data?.status}
          // thumbnail={data?.media?.data?.path}
          thumbnail={data?.media?.data}
          id={data?.id}
          onPress={handlePressBody}
          media={data?.media?.data}
        />
        <View style={styles.statusCountWrap}>
          <HangoutCount
            comment={data.commentCount}
            like={data.like_count}
            hideGuest
            onPressLike={() =>
              NavigationService.push('UserLiked', {id: data?.id})
            }
            onPressComment={handlePressComment}
          />
        </View>
        <HangoutAction
          showHangout={false}
          showMessage={false}
          liked={data.liked}
          like={data.like_count}
          onPressShare={!isPrivate && sharePostStatus}
          onPressComment={handlePressComment}
          onPressLike={onPressLike('status')}
        />
      </Paper>
    );
  }

  if (type === 'hangout') {
    return (
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
          // thumbnail={data?.media?.data?.path}
          thumbnail={data?.media?.data}
          amount={data.amount || 0}
          currencyMethod={getPaymentString(data.payment_method)}
          date={data.date}
          location={data.location}
          start={data.start}
          end={data.end}
          capacity={data?.capacity}
          specialties={data.skills?.data}
          schedule={data.schedule}
          id={data.id}
          show_hangout={data.show_hangout}
          onPress={handlePressBody}
          disableGuest={data?.user?.data?.id !== userInfo?.id}
          availableStatus={data.available_status}
        />
        <View style={styles.hangoutCountWrap}>
          <HangoutCount
            hangout={data.offers_count}
            comment={data.comment_count}
            like={data.like_count}
            showHangout={data.show_hangout}
            hideGuest={data.schedule}
            disableGuest={data?.user?.data?.id !== userInfo?.id}
            onPressLike={() =>
              NavigationService.push('UserLiked', {id: data?.id})
            }
            onPressHangout={() =>
              NavigationService.navigate('GuestList', {
                hangoutId: data.id,
                capacity: data?.capacity,
                start: data.start,
              })
            }
          />
        </View>
        <HangoutAction
          showHangout={!data.schedule && data.show_hangout}
          showMessage={data.type === 2 && !isOwn}
          messageLoading={beingCreateRoom || beingSendMessage.length > 0}
          onPressShare={!isPrivate && sharePostStatus}
          like={data.like_count}
          handlePressMessage={() => {
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
          }}
          offered={data.offered}
          liked={data.liked}
          onPressComment={handlePressComment}
          onPressLike={onPressLike('hangout')}
          hangoutLoading={beingCreateOffer?.includes(data.id)}
          hangoutOnPress={() =>
            data.offered
              ? NavigationService.navigate('CastManagement')
              : dispatch(
                  createOffer({
                    hangoutId: data.id,
                    userId: data?.user?.data?.id,
                  }),
                )
          }
        />
      </Paper>
    );
  }

  return (
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
        // thumbnail={data?.media?.data?.path}
        thumbnail={data?.media?.data}
        amount={data.amount || 0}
        currencyMethod={getPaymentString(data.payment_method)}
        date={data.date}
        location={data.location}
        start={data.start}
        end={data.end}
        capacity={data?.capacity}
        specialties={data.skills?.data}
        schedule={data.schedule}
        id={data.id}
        show_hangout={data.show_hangout}
        onPress={handlePressBody}
        disableGuest={data?.user?.data?.id !== userInfo?.id}
        availableStatus={data.available_status}
        //availableStatus={'online'}
      />
      <View style={styles.hangoutCountWrap}>
        <HangoutCount
          hangout={data.offers_count}
          comment={data.comment_count}
          like={data.like_count}
          showHangout={data.show_hangout}
          hideGuest={data.schedule}
          disableGuest={data?.user?.data?.id !== userInfo?.id}
          onPressLike={() =>
            NavigationService.push('UserLiked', {id: data?.id})
          }
          onPressHangout={() =>
            NavigationService.navigate('GuestList', {
              helpId: data.id,
              capacity: data?.capacity,
              start: data.start,
            })
          }
        />
      </View>
      <HangoutAction
        showHangout={!data.schedule && data.show_hangout}
        showMessage={data.type === 2 && !isOwn}
        messageLoading={beingCreateRoom || beingSendMessage.length > 0}
        onPressShare={!isPrivate && sharePostStatus}
        like={data.like_count}
        handlePressMessage={() => {
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
        }}
        offered={data.offered}
        liked={data.liked}
        onPressComment={handlePressComment}
        onPressLike={onPressLike('help')}
        hangoutLoading={beingCreateOffer?.includes(data.id)}
        hangoutOnPress={() =>
          data.offered
            ? NavigationService.navigate('CastManagement')
            : dispatch(
                createOffer({helpId: data.id, userId: data?.user?.data?.id}),
              )
        }
      />
    </Paper>
  );
};

export default FeedItem;
