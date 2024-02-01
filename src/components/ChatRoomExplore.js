import React, {Fragment} from 'react';
import {StyleSheet, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import moment from 'moment-timezone';
import {ShadowBox} from 'react-native-neomorph-shadows';
import FastImage from 'react-native-fast-image';
import {useSelector, useDispatch} from 'react-redux';

import useTheme from 'theme';
import {getSize} from 'utils/responsive';
import {Touchable, Text} from 'components';
import {
  addMemberToRoomExplore,
  joinChatRoomByIdExplore,
  listChatRoomPublic,
  seenChatRoomExplore,
} from 'actions';
import {Icons} from 'utils/icon';

export const CARD_WIDTH = getSize.w(150);
export const CARD_HEIGHT = getSize.h(230);
const IMAGE_HEIGHT = getSize.h(122);

const ChatRoomExplore = ({data, selected, wrapperStyle, onPress}) => {
  const theme = useTheme();
  const userInfo = useSelector((state) => state.auth.userInfo);
  const dispatch = useDispatch();

  const styles = StyleSheet.create({
    shadowBox: {
      width: CARD_WIDTH,
      height: CARD_HEIGHT,
      borderRadius: getSize.h(10),
      backgroundColor: theme.colors.paper,
      ...theme.shadow.postItem,
    },
    borderGradient: {
      top: -getSize.h(2),
      width: selected ? CARD_WIDTH + getSize.w(4) : CARD_WIDTH,
      height: selected ? CARD_HEIGHT + getSize.h(4) : CARD_HEIGHT,
      borderRadius: getSize.h(11),
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.paper,
    },
    wrapper: {
      width: CARD_WIDTH,
      height: CARD_HEIGHT,
      borderRadius: getSize.h(10),
      backgroundColor: theme.colors.paper,
    },
    featuredImage: {
      borderTopLeftRadius: getSize.h(10),
      borderTopRightRadius: getSize.h(10),
      height: IMAGE_HEIGHT,
      width: CARD_WIDTH,
      backgroundColor: theme.colors.grayLight,
      resizeMode: 'cover',
      justifyContent: 'center',
      alignItems: 'center',
    },
    noImage: {
      width: getSize.h(50),
      height: getSize.h(50),
      resizeMode: 'contain',
    },
    infoContainer: {
      paddingHorizontal: getSize.w(10),
      paddingVertical: getSize.h(12),
      justifyContent: 'space-between',
      flex: 1,
    },
    ptWrapper: {
      position: 'absolute',
      left: 0,
      top: IMAGE_HEIGHT - getSize.h(30),
      height: getSize.h(20),
      borderTopRightRadius: getSize.h(20 / 2),
      borderBottomRightRadius: getSize.h(20 / 2),
      ...theme.shadow.small.android,
      ...theme.shadow.small.ios,
      backgroundColor: theme.colors.paper,
    },
    ptContainer: {
      height: getSize.h(20),
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: getSize.w(10),
      borderTopRightRadius: getSize.h(20 / 2),
      borderBottomRightRadius: getSize.h(20 / 2),
    },
    title: {
      fontFamily: theme.fonts.sfPro.medium,
      lineHeight: getSize.f(18),
    },
    metaWrapper: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    castName: {
      fontSize: getSize.f(12),
      fontFamily: theme.fonts.sfPro.medium,
      maxWidth: CARD_WIDTH - getSize.w(20 + 35 + 5),
    },
    createdTime: {
      fontSize: getSize.f(10),
      color: theme.colors.text2,
      marginTop: getSize.h(3),
      maxWidth: CARD_WIDTH - getSize.w(20 + 35 + 5),
    },
    castAvatarOverlay: {
      width: getSize.h(35),
      height: getSize.h(35),
      borderRadius: getSize.h(35 / 2),
      position: 'absolute',
      justifyContent: 'center',
      alignItems: 'center',
    },
    castAvatar: {
      width: getSize.h(35),
      height: getSize.h(35),
      borderRadius: getSize.h(35 / 2),
      resizeMode: 'cover',
    },
    castAvatarWrap: {
      height: getSize.h(35),
      borderRadius: getSize.h(35 / 2),
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

  if (!data) {
    return null;
  }

  const Wrapper = !selected ? ShadowBox : LinearGradient;

  const wrapperProps = !selected
    ? {
        style: styles.shadowBox,
      }
    : {
        colors: theme.colors.gradient,
        start: {x: 0, y: 0},
        end: {x: 1, y: 0},
        style: styles.borderGradient,
      };

  // let timeString = '';
  // if (data.schedule) {
  //   timeString = data.schedule;
  // } else if (moment.utc(data.start).isValid()) {
  //   timeString = moment.utc(data.start).fromNow();
  // }

  return (
    <Touchable
      scalable
      onPress={() => {
        dispatch(
          addMemberToRoomExplore(
            {
              roomId: data?.id,
              members: [userInfo?.id],
            },
            {
              success: () => {
                dispatch(joinChatRoomByIdExplore(data?.id));
                dispatch(
                  seenChatRoomExplore(
                    {roomId: data?.id, userId: userInfo?.id},
                    {
                      success: () => {
                        dispatch(listChatRoomPublic({page: 1}));
                      },
                    },
                  ),
                );
              },
            },
          ),
        );
      }}
      style={wrapperStyle}>
      <Wrapper {...wrapperProps}>
        <View style={styles.wrapper}>
          {data?.avatar ? (
            <FastImage
              style={styles.featuredImage}
              source={data.avatar && {uri: data.avatar}}
            />
          ) : (
            <View style={styles.featuredImage}>
              <FastImage source={Icons.Logo} style={styles.noImage} />
            </View>
          )}
          <View style={styles.infoContainer}>
            <Text numberOfLines={2} style={styles.title}>
              {data.name}
            </Text>
            <View style={styles.metaWrapper}>
              <View style={styles.castAvatarWrap}>
                <Text numberOfLines={1} style={styles.castName}>
                  {data.users && data.users.length}{' '}
                  {data.users && data.users.length > 1
                    ? 'users joined'
                    : 'user joined'}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Wrapper>
    </Touchable>
  );
};

export default ChatRoomExplore;
