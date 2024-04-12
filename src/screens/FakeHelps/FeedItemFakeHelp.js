import React, {useCallback, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useSelector} from 'react-redux';
import uuid from 'uuid/v4';

import {useDispatch} from 'react-redux';

import useTheme from 'theme';
import {getSize} from 'utils/responsive';
import {
  toggleLikeHelp,
  showModalize,
  createOffer,
  hideModalize,
  createChatRoom,
  sendMessage,
  deleteHelp,
  changeHelpStatus,
  createOfferHelp,
} from 'actions';
import {Touchable, Paper} from 'components';
import NavigationService from 'navigation/service';
import {shareMultipleMediaFile, shareDownloadImage} from 'utils/share';

import {EnumHangoutStatus} from 'utils/constants';
import {HangoutBody, HangoutCount, HangoutUser} from 'components/FeedItem';
import HangoutFakeAction from './HangoutFakeAction';

const FeedItemFakeHelp = ({type, data, isChangeStatus}) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const {beingCreateOfferHelp} = useSelector((state) => state.feed);
  const userInfo = useSelector((state) => state.auth.userInfo);
  const {beingCreateRoom, beingSendMessage} = useSelector(
    (state) => state.chat,
  );
  const hangoutStatus =
    data?.available_status &&
    data?.available_status == EnumHangoutStatus.NO_TIME;

  const [offered, setOffered] = useState(data?.offered);
  const [offersCount, setOfferCount] = useState(data?.offers_count);

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
                  createChatRoom(
                    {members: selected, isSingle: true},
                    (result) => {
                      if (result?.data) {
                        result?.data.map((room) => {
                          dispatch(
                            sendMessage(
                              {
                                room_id: room.id,
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
                                  // NavigationService.goBack();
                                  // NavigationService.navigate('ChatRoom', {
                                  //   data: result,
                                  // });
                                },
                              },
                            ),
                          );
                        });
                        setTimeout(() => {
                          NavigationService.goBack();
                        }, 1000);
                      }
                    },
                  ),
                );
              },
            });
          },
          hide: true,
        },
        {
          label: hangoutStatus ? 'Set Online' : 'Set Time Free',
          icon: (
            <MaterialCommunityIcons
              size={getSize.f(22)}
              color={theme.colors.primary}
              name={hangoutStatus ? 'transfer-up' : 'transfer-down'}
            />
          ),
          onPress: () => {
            dispatch(
              changeHelpStatus(
                data.id,
                data.available_status === EnumHangoutStatus.NO_TIME
                  ? EnumHangoutStatus.ONLINE
                  : EnumHangoutStatus.NO_TIME,
                () => dispatch(hideModalize()),
              ),
            );
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
          hide: true,
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
          onPress: () =>
            dispatch(deleteHelp(data.id, () => dispatch(hideModalize()))),
          hide: true,
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
          hide: true,
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
                  createChatRoom(
                    {members: selected, isSingle: true},
                    (result) => {
                      if (result?.data) {
                        result?.data.map((room) => {
                          dispatch(
                            sendMessage(
                              {
                                room_id: room.id,
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
                                  // NavigationService.goBack();
                                  // NavigationService.navigate('ChatRoom', {
                                  //   data: result,
                                  // });
                                },
                              },
                            ),
                          );
                        });
                        setTimeout(() => {
                          NavigationService.goBack();
                        }, 1000);
                      }
                    },
                  ),
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
          hide: true,
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
          onPress: () =>
            dispatch(deleteHelp(data.id, () => dispatch(hideModalize()))),
          hide: true,
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
    // NavigationService.push('HelpDetail', {
    //   helpId: data?.id,
    // });
    return;
  }

  function handlePressComment() {
    NavigationService.push('HelpDetail', {
      commentFocused: true,
      helpId: data.id,
    });
  }

  const isOwn = data?.user?.data?.id === userInfo?.id;
  const isPrivate = Boolean(data?.room_id);

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
        title + address + ' ' + data.description + ' ' + urlFile,
        Object.assign(data, {type: type}),
        urlImage,
      );
    }

    async function sharePost() {
      await shareMultipleMediaFile(
        'Kizuner',
        title + address + ' ' + data.description,
        urlFile,
        Object.assign(data, {type: type}),
      );
    }
  }

  const showHelpOptions = () => dispatch(showModalize(dataSelectHelp));
  function handleHelpFake() {
    offered
      ? NavigationService.navigate('CastHelpManagement')
      : dispatch(
          createOfferHelp({
            helpId: data.id,
            userId: data?.user?.data?.id,
            type: type,
          }),
        );
    setOffered(true);
    setOfferCount(offersCount + 1);
  }

  function handleHangoutFake() {
    offered
      ? NavigationService.navigate('CastManagement')
      : dispatch(
          createOffer({
            hangoutId: data.id,
            userId: data?.user?.data?.id,
            type: type,
          }),
        );
    setOffered(true);
    setOfferCount(offersCount + 1);
  }

  const amount = data?.kizuna ? data?.kizuna : data?.amount ? data?.amount : 0;

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
        amount={amount}
        date={data.date}
        location={data.location}
        start={data.start}
        end={data.end}
        capacity={data?.capacity}
        specialties={data.skills?.data}
        schedule={data.schedule}
        id={data.id}
        show_hangout={data.show_hangout}
        show_help={data.show_help}
        onPress={handlePressBody}
        disableGuest={data?.user?.data?.id !== userInfo?.id}
        availableStatus={data.available_status}
        media={data?.media?.data}
        type={type}
        categories={data.categories?.data}
        //availableStatus={'online'}
      />
      <View style={styles.hangoutCountWrap}>
        <HangoutCount
          hangout={offersCount}
          help={offersCount}
          comment={data.comment_count}
          like={data.like_count}
          showHelp={data.show_help}
          //hideGuest={data.schedule}
          disableGuest={data?.user?.data?.id !== userInfo?.id}
          onPressLike={() =>
            NavigationService.push('UserLiked', {id: data?.id})
          }
          onPressHelp={() =>
            NavigationService.navigate('GuestHelpList', {
              helpId: data.id,
              capacity: data?.capacity,
              start: data.start,
              end: data.end,
            })
          }
        />
      </View>
      <HangoutFakeAction
        showHangout={data.show_hangout}
        showHelp={data.show_help}
        showMessage={data.type === 2 && !isOwn}
        messageLoading={beingCreateRoom || beingSendMessage.length > 0}
        onPressShare={() => sharePostStatus()}
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
        }}
        offered={offered}
        liked={data.liked}
        onPressComment={handlePressComment}
        onPressLike={() =>
          dispatch(
            toggleLikeHelp({
              helpId: data.id,
              userId: data?.user?.data?.id,
            }),
          )
        }
        hangoutLoading={beingCreateOfferHelp?.includes(data.id)}
        helpOnPress={() => {
          offered
            ? NavigationService.navigate('CastHelpManagement')
            : handleHelpFake();
        }}
        hangoutOnPress={() => {
          offered
            ? NavigationService.navigate('CastManagement')
            : handleHangoutFake();
        }}
      />
    </Paper>
  );
};

export default FeedItemFakeHelp;
