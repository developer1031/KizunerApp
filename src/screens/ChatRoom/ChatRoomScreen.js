import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
  Dimensions,
  Keyboard,
  Platform,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useSelector, useDispatch} from 'react-redux';
import uuid from 'uuid/v4';
import AsyncStorage from '@react-native-community/async-storage';
import useTheme from 'theme';
import {getSize} from 'utils/responsive';
import {
  Wrapper,
  Touchable,
  GiftestChat,
  Avatar,
  Text,
  EmojiPicker,
} from 'components';

import {
  takePhotoVideo,
  takeVideo,
  selectPhotoVideoOnlyPhoto,
  selectPhotoVideoOnlyVideo,
} from 'utils/selectVideo';
import ImagePicker from 'react-native-image-crop-picker';
import {launchImageLibrary} from 'react-native-image-picker';

import orangeLight from '../../theme/orangeLight';

import {HangoutUser} from 'components/FeedItem';
import {
  leaveChatRoom,
  showModalize,
  hideModalize,
  getRoomMessages,
  sendMessage,
  blockUser,
  uploadMessageImage,
  deleteMemberFromRoom,
  showAlert,
  listChatRoom,
  deleteChatRoom,
  reloadDraftMessageByRoomId,
  uploadMessageVideo,
} from 'actions';
import {checkIsAnyUnreadNotification} from 'utils/notificationService';
import useAppState from 'utils/appState';
import useKeyboardHeight from 'utils/keyboardHeight';

const width = Dimensions.get('window').width;

const limitFileVideo = 50;

const ChatRoomScreen = ({navigation, route}) => {
  const theme = useTheme();
  const appState = useAppState();
  const insets = useSafeAreaInsets();

  const userInfo = useSelector((state) => state.auth.userInfo);
  const {
    roomDetail,
    roomMessages,
    beingSendMessage,
    beingDeleteMessage,
    roomMessagesLoading,
    roomMessagesLastPage,
    typeChat,
  } = useSelector((state) => state.chat);
  const dispatch = useDispatch();
  const {draftMessage} = route.params;
  const [message, setMessage] = useState(draftMessage);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const keyboardHeight = useKeyboardHeight();
  const [page, setPage] = useState(1);
  const MESSAGES = roomMessages.map((item) => ({
    _id: item.id,
    text: item.text,
    hangout: item.hangout,
    help: item.help,
    video: item.video?.original || item.original || '',
    image: item.image?.thumb || item.image || '',
    createdAt: item.created_at,
    user: {
      _id: item.user.id,
      name: item.user.name,
      avatar: item.user.avatar || '',
    },
    thumb: item.video?.thumb || item?.image?.thumb || item.thumb || '',
    relatedUser: item.related_user,
  }));

  const recorderVideoRef = useRef(null);

  const selectImageOrVideo = [
    {
      label: 'Select photo',
      icon: (
        <MaterialCommunityIcons
          size={getSize.f(20)}
          color={theme.colors.primary}
          name="camera"
        />
      ),
      onPress: () => selectPhotoVideoOnlyPhoto(handleUploadImageLib),
    },
    {
      label: 'Select video',
      icon: (
        <MaterialCommunityIcons
          size={getSize.f(20)}
          color={theme.colors.primary}
          name="camera"
        />
      ),
      onPress: () =>
        selectPhotoVideoOnlyVideo(handleResultVideo, limitFileVideo),
    },
    {
      label: 'Cancel',
      icon: (
        <MaterialCommunityIcons
          size={getSize.f(20)}
          color={theme.colors.primary}
          name="close-circle-outline"
        />
      ),
      onPress: () => {
        dispatch(hideModalize());
      },
    },
  ];

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
      flex: 1,
      flexGrow: 1,
    },
    backBtn: {
      marginRight: getSize.w(15),
    },
    scrollWrap: {
      flex: 1,
      backgroundColor: orangeLight.colors.paper,
    },
    commentWrapper: {
      marginHorizontal: getSize.w(24),
      paddingTop: getSize.h(20),
      paddingBottom: getSize.h(20),
      flexDirection: 'row',
    },
    commentContainer: {
      width: width - getSize.w(58 + 40),
      marginLeft: getSize.w(10),
    },
    commentDetail: {
      backgroundColor: orangeLight.colors.background,
      borderRadius: getSize.h(10),
      paddingVertical: getSize.h(10),
      paddingHorizontal: getSize.h(14),
    },
    commentName: {
      fontFamily: orangeLight.fonts.sfPro.medium,
    },
    commentText: {
      lineHeight: getSize.f(22),
      color: orangeLight.colors.tagTxt,
      marginTop: getSize.h(5),
    },
    commentTime: {
      marginLeft: getSize.w(14),
      marginVertical: getSize.h(5),
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
    chatWrap: {
      flex: 1,
      backgroundColor: orangeLight.colors.paper,
    },
    userWrap: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
      flexGrow: 1,
    },
    userInfo: {
      marginLeft: getSize.w(10),
      flex: 1,
      flexGrow: 1,
    },
    userName: {
      fontSize: getSize.f(16),
      fontFamily: orangeLight.fonts.sfPro.medium,
      textAlignVertical: 'center',
    },
    menuWrap: {
      flex: 1,
      flexGrow: 1,
    },
  });

  const selectListCamera = [
    {
      label: 'Take photo',
      icon: (
        <MaterialCommunityIcons
          size={getSize.f(20)}
          color={theme.colors.primary}
          name="camera"
        />
      ),
      onPress: () => takePhotoVideo(handleUploadImage),
    },
    {
      label: 'Take video',
      icon: (
        <MaterialCommunityIcons
          size={getSize.f(20)}
          color={theme.colors.primary}
          name="camera"
        />
      ),
      onPress: () => takeVideo(handleResultVideo),
    },
    {
      label: 'Cancel',
      icon: (
        <MaterialCommunityIcons
          size={getSize.f(20)}
          color={theme.colors.primary}
          name="close-circle-outline"
        />
      ),
      onPress: () => dispatch(hideModalize()),
    },
  ];

  const onStartVideoRecorder = () => {
    recorderVideoRef.current.open({maxLength: limitFileVideo || 25}, (data) => {
      const req = {
        name: 'kizuner-video-record',
        uri:
          Platform.OS === 'android'
            ? data.uri
            : data.uri.replace('file://', ''),
        fileType: 'video/mp4',
        type: 'video/mp4',
      };
      handleResultVideo(req);
    });
  };

  function handleUploadImage(payload) {
    const fileType = payload.fileType;
    const formData = new FormData();
    dispatch(hideModalize());
    if (fileType?.includes('video') || fileType?.includes('mov')) {
      formData.append('videos[]', payload);

      const tmpId = uuid();
      const tmpMessage = {
        id: tmpId,
        room_id: roomDetail.id,
        videos: payload.uri,
        created_at: new Date(),
        user: {
          id: userInfo?.id,
          name: userInfo?.name,
          avatar: userInfo?.avatar,
        },
      };

      dispatch(
        uploadMessageVideo(formData, tmpMessage, (result) => {
          if (result?.data?.[0]?.id) {
            dispatch(
              sendMessage({
                tmpId,
                room_id: roomDetail.id,
                image: result?.data?.[0]?.id,
                user: {
                  id: userInfo?.id,
                  name: userInfo?.name,
                  avatar: userInfo?.avatar,
                },
              }),
            );
          }
        }),
      );
    } else {
      formData.append('images[]', payload);

      const tmpId = uuid();
      const tmpMessage = {
        id: tmpId,
        room_id: roomDetail.id,
        image: payload.uri,
        created_at: new Date(),
        user: {
          id: userInfo?.id,
          name: userInfo?.name,
          avatar: userInfo?.avatar,
        },
      };
      dispatch(
        uploadMessageImage(formData, tmpMessage, (result) => {
          if (result?.data?.[0]?.id) {
            dispatch(
              sendMessage({
                tmpId,
                room_id: roomDetail.id,
                image: result?.data?.[0]?.id,
                user: {
                  id: userInfo?.id,
                  name: userInfo?.name,
                  avatar: userInfo?.avatar,
                },
              }),
            );
          }
        }),
      );
    }
  }

  function handleGetMessages(p = page) {
    dispatch(getRoomMessages({page: p, id: roomDetail?.id}));
  }

  useEffect(() => {
    if (keyboardHeight > 0) {
      setShowEmojiPicker(false);
    }
  }, [keyboardHeight]);
  useEffect(() => {
    checkIsAnyUnreadNotification(dispatch, userInfo?.id);
  }, [appState]);
  useEffect(() => {
    setTimeout(() => {
      setMessage(draftMessage);
    }, 1000);
    StatusBar.setBarStyle('dark-content');
    return () => {
      StatusBar.setBarStyle('light-content');
      dispatch(leaveChatRoom());
    };
  }, []);
  useEffect(() => {
    if (roomDetail) {
      handleGetMessages(1);
    }
  }, [roomDetail]);

  function handleSendMessage(newMessages) {
    const message = newMessages?.[0];
    const tmpId = uuid();
    if (message) {
      dispatch(
        sendMessage({
          tmpId,
          room_id: roomDetail?.id,
          text: message.text,
          user: {
            id: userInfo?.id,
            name: userInfo?.name,
            avatar: userInfo?.avatar,
          },
        }),
      );
    }
  }

  function showEmoji() {
    Keyboard.dismiss();
    setShowEmojiPicker(true);
    return;
  }

  function handleUploadImageLib(payload) {
    dispatch(hideModalize());
    const formData = new FormData();
    formData.append('images[]', payload);

    const tmpId = uuid();
    const tmpMessage = {
      id: tmpId,
      room_id: roomDetail.id,
      image: payload.uri,
      created_at: new Date(),
      user: {
        id: userInfo?.id,
        name: userInfo?.name,
        avatar: userInfo?.avatar,
      },
    };
    dispatch(
      uploadMessageImage(formData, tmpMessage, (result) => {
        if (result?.data?.[0]?.id) {
          dispatch(
            sendMessage({
              tmpId,
              room_id: roomDetail.id,
              image: result?.data?.[0]?.id,
              user: {
                id: userInfo?.id,
                name: userInfo?.name,
                avatar: userInfo?.avatar,
              },
            }),
          );
        }
      }),
    );
  }

  const handleResultVideo = (payload) => {
    const formData = new FormData();
    payload.fileType = 'video/mp4';
    payload.type = 'video/mp4';
    formData.append('videos[]', payload);
    dispatch(hideModalize());
    const tmpId = uuid();
    const tmpMessage = {
      id: tmpId,
      room_id: roomDetail.id,
      videos: payload.uri,
      created_at: new Date(),
      user: {
        id: userInfo?.id,
        name: userInfo?.name,
        avatar: userInfo?.avatar,
      },
    };
    dispatch(
      uploadMessageVideo(formData, tmpMessage, (result) => {
        if (result?.data?.[0]?.id) {
          dispatch(
            sendMessage({
              tmpId,
              room_id: roomDetail.id,
              image: result?.data?.[0]?.id,
              user: {
                id: userInfo?.id,
                name: userInfo?.name,
                avatar: userInfo?.avatar,
              },
            }),
          );
        }
      }),
    );
  };

  const partners = roomDetail?.users?.filter((i) => i.id !== userInfo?.id);

  const onSelectMedia = () => {
    ImagePicker.openPicker({
      mediaType: 'any',
      cropping: false,
      multiple: true,
      maxFiles: 15,
      forceJpg: true,
    }).then((data) => {
      data.forEach((media) => {
        const isVideo = media.mime.includes('video');
        if (isVideo) {
          const payload = {
            fileSize: media.size,
            fileType: media.mime,
            type: media.mime,
            name: media.filename,
            uri: media.path,
          };
          handleResultVideo(payload);
        } else {
          const payload = {
            name: media.mime,
            type: media.mime,
            uri: media.path,
          };
          handleUploadImageLib(payload);
        }
      });
    });
    // dispatch(showModalize(selectImageOrVideo))
  };

  const showPersonalOptions = () =>
    dispatch(
      showModalize([
        {
          label: 'Create Private Hangout',
          icon: (
            <Feather
              name="edit"
              color={theme.colors.primary}
              size={getSize.f(19)}
            />
          ),
          onPress: () => {
            dispatch(hideModalize());
            setTimeout(
              () =>
                navigation.navigate('CreateHangout', {
                  onlyOneTime: true,
                  room_id: roomDetail?.id,
                  callback: (result) => {
                    navigation.goBack();
                    // Send this hangout via message
                    dispatch(
                      sendMessage({
                        room_id: roomDetail?.id,
                        tmpId: uuid(),
                        hangout: result?.data?.id,
                        user: {
                          id: userInfo?.id,
                          name: userInfo?.name,
                          avatar: userInfo?.avatar,
                        },
                      }),
                    );
                  },
                }),
              300,
            );
          },
          hide:
            partners?.[0]?.is_fake === 1 &&
            (roomDetail?.type === 'location' ||
              roomDetail?.type === 'public_group'),
        },
        {
          hide:
            partners?.[0]?.is_fake === 1 &&
            (roomDetail?.type === 'location' ||
              roomDetail?.type === 'public_group'),
          label: 'Create Private Help',
          icon: (
            <Feather
              name="edit"
              color={theme.colors.primary}
              size={getSize.f(19)}
            />
          ),
          onPress: () => {
            dispatch(hideModalize());
            setTimeout(
              () =>
                navigation.navigate('CreateHelp', {
                  onlyOneTime: true,
                  room_id: roomDetail?.id,
                  callback: (result) => {
                    navigation.goBack();
                    // Send this hangout via message
                    dispatch(
                      sendMessage({
                        room_id: roomDetail?.id,
                        tmpId: uuid(),
                        help: result?.data?.id,
                        user: {
                          id: userInfo?.id,
                          name: userInfo?.name,
                          avatar: userInfo?.avatar,
                        },
                      }),
                    );
                  },
                }),
              300,
            );
          },
        },
        {
          label: 'View Profile',
          icon: (
            <MaterialCommunityIcons
              size={getSize.f(22)}
              color={theme.colors.primary}
              name="account"
            />
          ),
          onPress: () => {
            dispatch(hideModalize());
            partners?.[0]?.id !== userInfo?.id &&
              navigation.push(
                partners?.[0]?.is_fake == 1 ? 'UserProfileBot' : 'UserProfile',
                {
                  userId: partners?.[0]?.id,
                },
              );
          },
        },
        {
          label: 'Block User',
          onPress: () => {
            dispatch(hideModalize());
            setTimeout(() => {
              dispatch(
                blockUser(partners?.[0]?.id, {
                  success: () => {
                    dispatch(
                      showAlert({
                        title: 'Success',
                        type: 'success',
                        body: `You blocked ${partners?.[0]?.name}!`,
                      }),
                    );
                    navigation.goBack();
                  },
                }),
              );
            }, 300);
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

  const showGroupOptions = () =>
    dispatch(
      showModalize([
        {
          label: 'Create Private Hangout',
          icon: (
            <Feather
              name="edit"
              color={theme.colors.primary}
              size={getSize.f(19)}
            />
          ),
          onPress: () => {
            dispatch(hideModalize());
            setTimeout(
              () =>
                navigation.navigate('CreateHangout', {
                  onlyOneTime: true,
                  room_id: roomDetail?.id,
                  callback: (result) => {
                    navigation.goBack();
                    // Send this hangout via message
                    dispatch(
                      sendMessage({
                        room_id: roomDetail?.id,
                        tmpId: uuid(),
                        hangout: result?.data?.id,
                        user: {
                          id: userInfo?.id,
                          name: userInfo?.name,
                          avatar: userInfo?.avatar,
                        },
                      }),
                    );
                  },
                }),
              300,
            );
          },
          hide:
            roomDetail?.type === 'location' ||
            roomDetail?.type === 'public_group',
        },
        {
          label: 'Create Private Help',
          icon: (
            <Feather
              name="edit"
              color={theme.colors.primary}
              size={getSize.f(19)}
            />
          ),
          onPress: () => {
            dispatch(hideModalize());
            setTimeout(
              () =>
                navigation.navigate('CreateHelp', {
                  onlyOneTime: true,
                  room_id: roomDetail?.id,
                  callback: (result) => {
                    navigation.goBack();
                    // Send this hangout via message
                    dispatch(
                      sendMessage({
                        room_id: roomDetail?.id,
                        tmpId: uuid(),
                        help: result?.data?.id,
                        user: {
                          id: userInfo?.id,
                          name: userInfo?.name,
                          avatar: userInfo?.avatar,
                        },
                      }),
                    );
                  },
                }),
              300,
            );
          },
          hide:
            roomDetail?.type === 'location' ||
            roomDetail?.type === 'public_group',
        },
        {
          label: 'Change Group Name',
          icon: (
            <MaterialCommunityIcons
              size={getSize.f(22)}
              color={theme.colors.primary}
              name="square-edit-outline"
            />
          ),
          onPress: () => {
            dispatch(hideModalize());
            setTimeout(() => navigation.navigate('UpdateGroupName'), 200);
          },
          hide:
            roomDetail?.type === 'location' ||
            roomDetail?.type === 'public_group',
        },
        {
          label: 'Add Member',
          icon: (
            <MaterialCommunityIcons
              size={getSize.f(20)}
              color={theme.colors.primary}
              name="account-plus"
            />
          ),
          onPress: () => {
            dispatch(hideModalize());
            setTimeout(() => navigation.navigate('AddChatMember'), 200);
          },
          hide:
            roomDetail?.type === 'location' ||
            roomDetail?.type === 'public_group',
        },
        {
          label: 'Chat Members',
          icon: (
            <MaterialCommunityIcons
              size={getSize.f(20)}
              color={theme.colors.primary}
              name="account-group"
            />
          ),
          onPress: () => {
            dispatch(hideModalize());
            setTimeout(
              () =>
                navigation.navigate('RoomMembers', {type: roomDetail?.type}),
              200,
            );
          },
          hide:
            roomDetail?.type === 'location' ||
            roomDetail?.type === 'public_group',
        },
        {
          label: 'Leave Chat',
          icon: (
            <MaterialCommunityIcons
              size={getSize.f(20)}
              color={theme.colors.primary}
              name="logout-variant"
            />
          ),
          onPress: () => {
            dispatch(hideModalize());
            setTimeout(() => {
              dispatch(
                deleteMemberFromRoom(
                  {roomId: roomDetail?.id, userId: userInfo?.id},
                  {
                    success: () => {
                      if (
                        roomDetail?.type === 'location' ||
                        roomDetail?.type === 'public_group'
                      ) {
                        navigation.goBack();
                        return;
                      }
                      navigation.goBack();
                      dispatch(
                        listChatRoom({
                          page: 1,
                          reset: true,
                          type: typeChat,
                        }),
                      );
                      dispatch(
                        showAlert({
                          title: 'Success',
                          type: 'success',
                          body: 'You left this group!',
                        }),
                      );
                    },
                  },
                ),
              );
            }, 200);
          },
        },
        {
          hide:
            roomDetail?.type === 'location' ||
            roomDetail?.type === 'public_group',
          label: 'Delete Group',
          icon: (
            <MaterialCommunityIcons
              size={getSize.f(20)}
              color={theme.colors.primary}
              name="delete-forever"
            />
          ),
          onPress: () => {
            dispatch(hideModalize());
            setTimeout(
              () =>
                dispatch(
                  deleteChatRoom(
                    {roomId: roomDetail?.id},
                    {
                      success: () => {
                        navigation.goBack();
                        dispatch(
                          showAlert({
                            title: 'Success',
                            type: 'success',
                            body: 'You deleted this group!',
                          }),
                        );
                      },
                    },
                  ),
                ),
              200,
            );
          },
        },
      ]),
    );

  const handleGoBack = async () => {
    dispatch(hideModalize());
    await AsyncStorage.setItem(roomDetail && roomDetail.id, message);
    dispatch(
      reloadDraftMessageByRoomId({
        roomId: roomDetail && roomDetail.id,
        draftMessage: message,
      }),
    );

    navigation.goBack();
    return;
  };

  const setItemDraftEmpty = async () => {
    await AsyncStorage.setItem(roomDetail && roomDetail.id, '');
  };

  useEffect(() => {
    //getDraftMessage();
    //dispatch(getNotiCount());
  }, []);

  const getDraftMessage = async () => {
    const draft = await AsyncStorage.getItem(roomDetail && roomDetail.id);
    if (draft !== null || draft !== '') {
      setMessage(draft);
    }
    return;
  };

  const setDraftMessage = async () => {
    await AsyncStorage.setItem(roomDetail && roomDetail.id, message);
    dispatch(
      reloadDraftMessageByRoomId({
        roomId: roomDetail && roomDetail.id,
        draftMessage: message,
      }),
    );
  };

  const navigateVideoScreen = (video) => {
    navigation.push('VideoScreen', {video});
    return;
  };

  const onAddEmoji = (value) => {
    setMessage(message + value);
  };

  useEffect(() => {
    // [BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
    // return () => {
    //   setDraftMessage();
    //   BackHandler.removeEventListener(
    //     'hardwareBackPress',
    //     handleBackButtonClick,
    //   );
    // };]
  }, []);

  async function handleBackButtonClick() {
    navigation.goBack();
    return true;
  }

  const onSelectCamera = () => dispatch(showModalize(selectListCamera));

  return (
    <Wrapper style={styles.wrapper}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.headerWrapper}>
        <View style={styles.headerLeft}>
          <Touchable style={styles.backBtn} onPress={() => handleGoBack()}>
            <MaterialCommunityIcons
              name="chevron-left"
              color={theme.colors.primary}
              size={getSize.f(34)}
            />
          </Touchable>
          {roomDetail?.type === 'location' ||
          roomDetail?.type === 'public_group' ? (
            <Touchable
              onPress={() =>
                navigation.navigate('RoomMembers', {type: roomDetail?.type})
              }
              style={styles.userWrap}>
              <Avatar size="header" group />
              <View style={styles.userInfo}>
                <Text style={styles.userName} numberOfLines={1}>
                  {roomDetail?.name}
                </Text>
              </View>
            </Touchable>
          ) : roomDetail?.type === 'group' ? (
            <Touchable
              onPress={() =>
                navigation.navigate('RoomMembers', {type: roomDetail?.type})
              }
              style={styles.userWrap}>
              <Avatar size="header" group />
              <View style={styles.userInfo}>
                <Text style={styles.userName} numberOfLines={1}>
                  {roomDetail?.name ||
                    (partners?.length > 1
                      ? partners.reduce(
                          (cur, pre, idx) =>
                            cur + (idx === 0 ? pre.name : `, ${pre.name}`),
                          '',
                        )
                      : partners?.[0]?.name || 'Empty Group')}
                </Text>
              </View>
            </Touchable>
          ) : (
            <HangoutUser
              user={partners?.[0]}
              isFake={partners?.[0]?.is_fake === 1}
            />
          )}
        </View>
        {roomDetail && (
          <Touchable
            onPress={() => {
              Keyboard.dismiss();
              roomDetail?.type === 'personal'
                ? showPersonalOptions()
                : showGroupOptions();
            }}>
            <MaterialCommunityIcons
              name="dots-vertical"
              size={getSize.f(24)}
              color={theme.colors.text}
            />
          </Touchable>
        )}
      </View>

      <View style={styles.chatWrap}>
        <GiftestChat
          setShowEmojiPicker={setShowEmojiPicker}
          navigateVideoScreen={navigateVideoScreen}
          message={message}
          setMessage={setMessage}
          messages={MESSAGES}
          sending={beingSendMessage.includes(roomDetail?.id)}
          onSend={handleSendMessage}
          loading={roomMessagesLoading}
          user={{
            _id: userInfo?.id,
            name: userInfo?.name,
          }}
          isLoadingEarlier={roomMessagesLoading}
          loadEarlier={page < roomMessagesLastPage}
          onLoadEarlier={() => {
            handleGetMessages(page + 1);
            setPage(page + 1);
          }}
          onTakePhoto={onSelectCamera}
          onSelectPhoto={onSelectMedia}
          onSelectEmoji={showEmoji}
        />
      </View>

      <EmojiPicker open={showEmojiPicker} onSelect={onAddEmoji} />
    </Wrapper>
  );
};

export default ChatRoomScreen;
