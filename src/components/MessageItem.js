import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Dimensions, Platform} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';

import {
  Placeholder,
  PlaceholderMedia,
  PlaceholderLine,
  Fade,
} from 'rn-placeholder';
import moment from 'moment';

import useTheme from 'theme';
import {getSize} from 'utils/responsive';
import {Touchable, Text, Avatar} from 'components';
import {shortFormat} from 'utils/datetime';
import {
  joinChatRoom,
  reloadDraftMessageByRoomId,
  seenChatRoom,
  addMemberToRoom,
  joinChatRoomById,
} from 'actions';
import {checkIsAnyUnreadNotification} from 'utils/notificationService';
import AsyncStorage from '@react-native-community/async-storage';
import orangeLight from '../theme/orangeLight';

const width = Dimensions.get('window').width;

const MessageItem = ({data}) => {
  const theme = useTheme();
  const userInfo = useSelector((state) => state.auth.userInfo);
  const {reloadDraftMessageByChatRoom, roomDetail} = useSelector(
    (state) => state.chat,
  );
  const dispatch = useDispatch();
  const [draftMessage, setDraftMessage] = useState('');
  useEffect(() => {
    if (
      reloadDraftMessageByChatRoom &&
      reloadDraftMessageByChatRoom.roomId == data?.id
    ) {
      setDraftMessage(reloadDraftMessageByChatRoom.draftMessage);
      dispatch(reloadDraftMessageByRoomId(null));
    }
  }, [reloadDraftMessageByChatRoom]);

  useEffect(() => {
    getDraftMessage();
  }, []);

  const getDraftMessage = async () => {
    const draft = await AsyncStorage.getItem(data?.id);
    if (draft !== null) {
      setDraftMessage(draft);
    }
    return;
  };

  if (!data) {
    return null;
  }

  const partners = data.users?.filter((i) => i.id !== userInfo?.id);

  function renderAvatar() {
    if (data.type === 'personal') {
      return (
        <Avatar source={{uri: partners?.[0]?.avatar || ''}} size="message" />
      );
    } else {
      return <Avatar size="message" group />;
    }
  }

  function renderName() {
    if (data.type === 'location' || data.type === 'public_group') {
      return data.name;
    }
    if (data.type === 'personal' || partners.length === 1) {
      return partners?.[0]?.name;
    }
    if (data.name) {
      return data.name;
    }
    if (!partners.length) {
      return 'Empty Group';
    }
    return partners.reduce(
      (cur, pre, idx) => cur + (idx === 0 ? pre.name : `, ${pre.name}`),
      '',
    );
  }

  function renderLastMessage() {
    if (draftMessage !== '') {
      return `[draft] ${draftMessage}`;
    }
    if (!data.last_message?.data) {
      return "Let's start the conversation!";
    }
    if (data.last_message.data.text) {
      return data.last_message.data.text;
    }
    if (data.last_message.data.image) {
      return '[Image]';
    }
    if (data.last_message.data.video) {
      return '[Video]';
    }
    if (data.last_message.data.hangout) {
      return '[Hangout]';
    }
    if (data.last_message.data.help) {
      return '[Help]';
    }
    if (data.last_message.data.related_user) {
      return 'I am busy now, I would like to introduce another one person who can help you...';
    }
  }

  const lastSeen = data?.users?.find(
    (item) => item.id === userInfo?.id,
  )?.seen_at;
  const unseen = moment(lastSeen).isBefore(moment(data?.updated_at));

  const renderUnseen = () => {
    //data.type === 'location' ||
    if (data.type === 'public_group') return null;
    if (unseen) {
      return <View style={styles.unseen} />;
    }
  };

  return (
    <Touchable
      onPress={async () => {
        // console.warn('data ne')
        // console.warn(data)
        if (data?.type === 'location' || data?.type === 'public_group') {
          dispatch(
            addMemberToRoom(
              {
                roomId: data?.id,
                members: [userInfo?.id],
              },
              {
                success: () => {
                  dispatch(joinChatRoomById(data?.id));
                  dispatch(
                    seenChatRoom({roomId: data?.id, userId: userInfo?.id}),
                  );
                },
              },
            ),
          );
          return;
        } else {
          dispatch(joinChatRoom(Object.assign(data, {draftMessage})));
          if (unseen) {
            dispatch(seenChatRoom({roomId: data?.id, userId: userInfo?.id}));
            checkIsAnyUnreadNotification(dispatch, userInfo?.id);
          }
        }
      }}
      style={styles.wrapper}>
      {renderUnseen()}
      <View style={styles.container}>
        {renderAvatar()}
        {data.type === 'location' || data.type === 'public_group' ? (
          <View style={styles.infoWrap}>
            <View style={[styles.infoMeta]}>
              <Text
                style={[styles.infoName, unseen && styles.nameUnseen]}
                numberOfLines={1}>
                {renderName()}
              </Text>
              {/* <Text style={styles.infoTime}>{shortFormat(lastSeen)}</Text> */}
              <Text style={styles.infoTime}>
                {moment(lastSeen).format('lll')}
              </Text>
            </View>
            {data.users && data.users?.length !== 0 ? (
              <Text style={[styles.infoDescription]} numberOfLines={2}>
                {data.users?.length}{' '}
                {data.users?.length == 1 ? 'user' : 'users'}
              </Text>
            ) : null}
          </View>
        ) : (
          <View style={styles.infoWrap}>
            <View style={styles.infoMeta}>
              <Text
                style={[styles.infoName, unseen && styles.nameUnseen]}
                numberOfLines={1}>
                {renderName()}
              </Text>
              {/* <Text style={styles.infoTime}>{shortFormat(lastSeen)}</Text> */}
              <Text style={styles.infoTime}>
                {/* {moment(lastSeen).format('lll')} */}
                {moment(data.last_message.data.created_at).format('lll')}
              </Text>
            </View>
            <Text
              style={[styles.infoDescription, unseen && styles.infoUnseen]}
              numberOfLines={2}>
              {renderLastMessage()}
            </Text>
          </View>
        )}
      </View>
    </Touchable>
  );
};

export const PlaceholderItem = () => {
  const theme = useTheme();

  const styles = StyleSheet.create({
    wrapper: {
      paddingHorizontal: getSize.w(24),
      height: getSize.h(100),
    },
    container: {
      height: getSize.h(100),
      borderBottomColor: theme.colors.divider,
      borderBottomWidth: getSize.h(1),
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    infoWrap: {
      width: width - getSize.w(48 + 58 + 10),
    },
    infoMeta: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: getSize.h(5),
    },
    avatarPlace: {
      width: getSize.h(58),
      height: getSize.h(58),
      borderRadius: getSize.h(58 / 2),
    },
    namePlace: {
      marginTop: getSize.h(5),
    },
  });

  return (
    <Placeholder Animation={Fade}>
      <View style={styles.wrapper}>
        <View style={styles.container}>
          <PlaceholderMedia style={styles.avatarPlace} />
          <View style={styles.infoWrap}>
            <View style={styles.infoMeta}>
              <PlaceholderLine
                width={Math.floor(Math.random() * 30) + 15}
                height={15}
                style={styles.namePlace}
              />
              <PlaceholderLine width={15} />
            </View>
            <PlaceholderLine width={Math.floor(Math.random() * 60) + 30} />
          </View>
        </View>
      </View>
    </Placeholder>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: getSize.w(24),
    height: getSize.h(100),
  },
  container: {
    height: getSize.h(100),
    borderBottomColor: orangeLight.colors.divider,
    borderBottomWidth: getSize.h(1),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoWrap: {
    width: width - getSize.w(48 + 58 + 10),
  },
  infoMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: getSize.h(5),
  },
  infoName: {
    fontFamily: orangeLight.fonts.sfPro.medium,
    fontSize: getSize.f(17),
    marginRight: getSize.w(10),
    flex: 1,
    flexGrow: 1,
  },
  infoTime: {
    fontSize: getSize.f(12),
    color: orangeLight.colors.text2,
  },
  infoDescription: {
    fontSize: getSize.f(15),
    color: orangeLight.colors.text2,
  },
  unseen: {
    width: getSize.h(8),
    height: getSize.h(8),
    borderRadius: getSize.h(8 / 2),
    backgroundColor: orangeLight.colors.primary,
    position: 'absolute',
    top: getSize.h(100 / 2 - 8 / 2),
    left: getSize.w(24 / 2 - 8 / 2),
  },
  nameUnseen: {
    fontFamily: orangeLight.fonts.sfPro.semiBold,
  },
  infoUnseen: {
    color: orangeLight.colors.tagTxt,
    fontFamily: orangeLight.fonts.sfPro.medium,
  },
});

export default MessageItem;
