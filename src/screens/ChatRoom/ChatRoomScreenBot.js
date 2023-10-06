import React, {useState, useEffect} from 'react';
import {StyleSheet, View, StatusBar, Dimensions, Keyboard} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {useSelector, useDispatch} from 'react-redux';
import uuid from 'uuid/v4';
import useTheme from 'theme';
import {getSize} from 'utils/responsive';
import {Wrapper, Touchable, GiftestChat, EmojiPicker} from 'components';

import {HangoutUser} from 'components/FeedItem';
import {
  leaveChatRoom,
  getRoomMessages,
  sendMessage,
  seenChatRoom,
} from 'actions';
import {checkIsAnyUnreadNotification} from 'utils/notificationService';
import useAppState from 'utils/appState';
import useKeyboardHeight from 'utils/keyboardHeight';

const width = Dimensions.get('window').width;

const ChatRoomScreenBot = ({navigation, route}) => {
  const theme = useTheme();
  const appState = useAppState();
  const userInfo = useSelector((state) => state.auth.userInfo);
  const {
    roomDetail,
    roomMessages,
    beingSendMessage,
    roomMessagesLoading,
    roomMessagesLastPage,
  } = useSelector((state) => state.chat);
  const dispatch = useDispatch();
  const {draftMessage} = route.params;
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const keyboardHeight = useKeyboardHeight();
  const [page, setPage] = useState(1);
  const MESSAGES = roomMessages.map((item) => ({
    _id: item.id,
    text: item.text,
    help: item.help,
    createdAt: item.created_at,
    user: {
      _id: item.user.id,
      name: item.user.name,
      avatar: item.user.avatar || '',
    },
  }));

  useEffect(() => {
    if (keyboardHeight > 0) {
      setShowEmojiPicker(false);
    }
  }, [keyboardHeight]);

  function handleGetMessages(p = page) {
    dispatch(getRoomMessages({page: p, id: roomDetail?.id}));
  }

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

  useEffect(() => {
    dispatch(seenChatRoom({roomId: roomDetail?.id, userId: userInfo?.id}));
  }, []);

  function handleSendMessage(newMessages) {
    const message = newMessages?.[0];
    const tmpId = uuid();
    if (message) {
      dispatch(
        sendMessage({
          tmpId,
          room_id: roomDetail.id,
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

  const partners = roomDetail?.users?.filter((i) => i.id !== userInfo?.id);
  console.log('partners', roomDetail);
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
      backgroundColor: theme.colors.paper,
      height: getStatusBarHeight() + getSize.h(70),
      zIndex: 1,
      ...theme.shadow.large.ios,
      ...theme.shadow.large.android,
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
      backgroundColor: theme.colors.paper,
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
      backgroundColor: theme.colors.background,
      borderRadius: getSize.h(10),
      paddingVertical: getSize.h(10),
      paddingHorizontal: getSize.h(14),
    },
    commentName: {
      fontFamily: theme.fonts.sfPro.medium,
    },
    commentText: {
      lineHeight: getSize.f(22),
      color: theme.colors.tagTxt,
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
      backgroundColor: theme.colors.paper,
      ...theme.shadow.large.ios,
      ...theme.shadow.large.android,
    },
    commentInputWrap: {
      height: getSize.h(48),
      borderRadius: getSize.h(48 / 2),
      backgroundColor: theme.colors.background,
      paddingHorizontal: getSize.w(24),
      justifyContent: 'center',
      width: width - getSize.w(48 + 40),
    },
    commentInput: {
      fontFamily: theme.fonts.sfPro.regular,
      fontSize: getSize.f(15),
      color: theme.colors.text,
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
      borderTopColor: theme.colors.divider,
      borderTopWidth: getSize.h(1),
      borderBottomColor: theme.colors.divider,
      borderBottomWidth: getSize.h(1),
      marginTop: getSize.h(20),
    },
    hangoutCountWrap: {
      borderBottomColor: theme.colors.divider,
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
      backgroundColor: theme.colors.paper,
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
      fontFamily: theme.fonts.sfPro.medium,
      textAlignVertical: 'center',
    },
    menuWrap: {
      flex: 1,
      flexGrow: 1,
    },
  });

  useEffect(() => {
    //getDraftMessage();
  }, []);

  const onAddEmoji = (value) => {
    setMessage(message + value);
  };

  useEffect(() => {}, []);

  function showEmoji() {
    Keyboard.dismiss();
    setShowEmojiPicker(true);
    return;
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
          <HangoutUser isFake={true} user={partners?.[0]} />
        </View>
        {/* {roomDetail && (
          <Touchable
            onPress={() =>
              roomDetail?.type === 'personal'
                ? showPersonalOptions()
                : showGroupOptions()
            }>
            <MaterialCommunityIcons
              name="dots-vertical"
              size={getSize.f(24)}
              color={theme.colors.text}
            />
          </Touchable>
        )} */}
      </View>
      <View style={styles.chatWrap}>
        <GiftestChat
          setShowEmojiPicker={setShowEmojiPicker}
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
          onSelectEmoji={() => showEmoji()}
        />
      </View>
      <EmojiPicker open={showEmojiPicker} onSelect={onAddEmoji} />
    </Wrapper>
  );
};

export default ChatRoomScreenBot;
