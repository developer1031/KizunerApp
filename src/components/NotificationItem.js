import React from 'react';
import {StyleSheet, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import HTML from 'react-native-render-html';
import moment from 'moment';
import FastImage from 'react-native-fast-image';
import {useDispatch, useSelector} from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {IconButton} from 'react-native-paper';

import useTheme from 'theme';
import {Touchable, Text, Avatar} from 'components';
import {getSize} from 'utils/responsive';
import {
  checkIsAnyUnreadNotification,
  handlePressNoti,
} from 'utils/notificationService';
import {deleteNoti, showModalize, hideModalize, getNotiCount} from 'actions';

import {Platform} from 'react-native';
import {Icons} from 'utils/icon';

const NotificationItem = ({data}) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.auth.userInfo);

  const styles = StyleSheet.create({
    wrapper: {
      paddingHorizontal: getSize.w(24),
      height: getSize.h(100),
      flexDirection: 'row',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.divider,
      backgroundColor: !data?.status
        ? theme.colors.divider
        : theme.colors.paper,
    },
    notiIconWrap: {
      width: getSize.h(24),
      height: getSize.h(24),
      borderRadius: getSize.h(24 / 2),
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      bottom: 0,
      right: -getSize.w(5),
    },
    notiIcon: {
      width: getSize.h(12),
      height: getSize.h(12),
    },
    container: {
      marginLeft: getSize.w(15),
      flex: 1,
      flexGrow: 1,
    },
    date: {
      marginTop: getSize.h(5),
      fontSize: getSize.f(12),
      color: theme.colors.grayLight,
    },
    moreBtn: {
      right: -getSize.w(10),
      top: -getSize.h(20),
    },
  });

  const showOptions = () =>
    dispatch(
      showModalize([
        {
          label: 'Remove',
          icon: (
            <MaterialCommunityIcons
              size={getSize.f(20)}
              color={theme.colors.primary}
              name="trash-can"
            />
          ),
          onPress: () => {
            dispatch(hideModalize());
            dispatch(deleteNoti(data?.id));
            setTimeout(() => {
              dispatch(getNotiCount());
            }, 1500);
          },
        },
      ]),
    );

  const onPressItem = async () => {
    await handlePressNoti(data, dispatch, userInfo?.id);
    checkIsAnyUnreadNotification(dispatch, userInfo?.id);
    if (Platform.OS === 'android') {
      setTimeout(() => {
        dispatch(getNotiCount());
      }, 2000);
    }
  };

  function renderNotiIcon() {
    let iconSrc = Icons.ic_notificationIc;
    if (data?.payload?.type === 'new-chat') {
      iconSrc = Icons.ic_chatIc;
    } else if (
      data?.payload?.type === 'new-follow' ||
      data?.payload?.type === 'friend-request' ||
      data?.payload?.type === 'friend-accepted'
    ) {
      iconSrc =  Icons.ic_relationIc;
    } else if (
      data?.payload?.type === 'new-review' ||
      data?.payload?.type === 'review-reminder'
    ) {
      iconSrc =  Icons.ic_rateIc;
    } else if (
      data?.payload?.type === 'status-liked' ||
      data?.payload?.type === 'hangout-liked'
    ) {
      iconSrc =  Icons.ic_reactIc;
    } else if (data?.payload?.type === 'new-offer') {
      iconSrc = Icons.ic_hangoutIc;
    }

    return (
      <LinearGradient
        colors={theme.colors.gradient}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        style={styles.notiIconWrap}>
        <FastImage
          source={iconSrc}
          style={styles.notiIcon}
          resizeMode="contain"
        />
      </LinearGradient>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <Touchable onPress={onPressItem} style={styles.wrapper}>
      <Avatar gray noShadow size="medium" renderExtra={renderNotiIcon} />
      <View style={styles.container}>
        <HTML
          html={`<p>${data?.payload?.message}</p>`}
          tagsStyles={{
            p: {
              color: theme.colors.text,
              fontSize: getSize.f(15),
              fontFamily: theme.fonts.sfPro.regular,
              letterSpacing: 0.34,
            },
            b: {
              color: theme.colors.text,
              fontSize: getSize.f(15),
              fontFamily: theme.fonts.sfPro.semiBold,
              fontWeight: 'normal',
              letterSpacing: 0.34,
            },
          }}
        />
        <Text style={styles.date}>{moment(data?.created_at).fromNow()}</Text>
      </View>
      <IconButton
        icon="dots-horizontal"
        style={styles.moreBtn}
        onPress={showOptions}
        size={getSize.f(20)}
      />
    </Touchable>
  );
};

export default NotificationItem;
