import React from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import moment from 'moment';
import {useSelector, useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Clipboard from '@react-native-clipboard/clipboard';
import Hyperlink from 'react-native-hyperlink';

import {Avatar, Text, Touchable} from 'components';
import {getSize} from 'utils/responsive';
import useTheme from 'theme';
import {showModalize, hideModalize, showAlert, deleteComment} from 'actions';

const width = Dimensions.get('window').width;

const CommentItem = ({data, onEdit, hangoutId}) => {
  const navigation = useNavigation();
  const userInfo = useSelector((state) => state.auth.userInfo);
  const comment = useSelector((state) => state.feedDetail.comment[hangoutId]);
  const theme = useTheme();
  const dispatch = useDispatch();

  const styles = StyleSheet.create({
    commentWrapper: {
      marginHorizontal: getSize.w(24),
      paddingTop: getSize.h(20),
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
    disabled: {
      opacity: 0.3,
    },
    linkStyle: {
      color: theme.colors.primary,
    },
  });

  function navigateToProfile() {
    if (userInfo?.id !== data?.user?.data?.id) {
      navigation.push('UserProfile', {userId: data?.user?.data?.id});
    }
  }

  function handleShowOptions() {
    dispatch(
      showModalize([
        {
          label: 'Copy To Clipboard',
          icon: (
            <MaterialCommunityIcons
              size={getSize.f(20)}
              color={theme.colors.primary}
              name="content-copy"
            />
          ),
          onPress: () => {
            dispatch(hideModalize());
            Clipboard.setString(data?.body);
            dispatch(
              showAlert({
                title: 'Success',
                body: 'Copied to clipboard',
                type: 'success',
              }),
            );
          },
        },
        {
          label: 'Edit Comment',
          icon: (
            <MaterialIcons
              size={getSize.f(20)}
              color={theme.colors.primary}
              name="edit"
            />
          ),
          onPress: () => {
            dispatch(hideModalize());
            onEdit && onEdit(data);
          },
          hide: data?.user?.data?.id !== userInfo?.id,
        },
        {
          label: 'Delete Comment',
          icon: (
            <MaterialCommunityIcons
              size={getSize.f(20)}
              color={theme.colors.primary}
              name="delete"
            />
          ),
          onPress: () => {
            dispatch(hideModalize());
            dispatch(deleteComment({id: data?.id, hangoutId}));
          },
          hide: data?.user?.data?.id !== userInfo?.id,
        },
      ]),
    );
  }

  const disabled = Boolean(
    comment?.posting === data?.id || comment?.deleting === data?.id,
  );

  return (
    <View style={[styles.commentWrapper, disabled && styles.disabled]}>
      <Avatar
        onPress={navigateToProfile}
        size="header"
        noShadow
        data={data?.user?.data?.media?.avatar}
        source={{uri: data?.user?.data?.avatar}}
      />
      <View style={styles.commentContainer}>
        <Touchable
          disabled={disabled}
          onLongPress={handleShowOptions}
          style={styles.commentDetail}>
          <Text style={styles.commentName}>{data?.user?.data?.name}</Text>
          <Hyperlink linkStyle={styles.linkStyle} linkDefault>
            <Text style={styles.commentText}>{data?.body}</Text>
          </Hyperlink>
        </Touchable>
        <Text
          onPress={navigateToProfile}
          variant="caption"
          style={styles.commentTime}>
          {moment(data?.updated_at).fromNow()}
        </Text>
      </View>
    </View>
  );
};

export default CommentItem;
