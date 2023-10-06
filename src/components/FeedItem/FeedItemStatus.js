import React, {useCallback} from 'react';
import {StyleSheet, View, Alert} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useSelector} from 'react-redux';

import {useDispatch} from 'react-redux';

import useTheme from 'theme';
import {getSize} from 'utils/responsive';
import {
  toggleLikeStatus,
  showModalize,
  hideModalize,
  deleteStatus,
} from 'actions';
import {Touchable, Paper} from 'components';
import NavigationService from 'navigation/service';
import {shareMultipleMediaFile, shareTitleWithUrl} from 'utils/share';

import HangoutAction from './HangoutAction';
import HangoutBody from './HangoutBody';
import HangoutCount from './HangoutCount';
import HangoutUser from './HangoutUser';

const FeedItemStatus = ({type, data, enableShare = true}) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.auth.userInfo);

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
    NavigationService.push('StatusDetail', {
      statusId: data?.id,
    });
    return;
  }

  function handlePressComment() {
    NavigationService.push('StatusDetail', {
      commentFocused: true,
      statusId: data.id,
    });
  }

  const isOwn = data?.user?.data?.id === userInfo?.id;
  const isPrivate = Boolean(data?.room_id);
  const onPressLike = () => {
    dispatch(
      toggleLikeStatus({
        statusId: data.id,
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
        Object.assign(data, {type: 'status'}),
        !data?.liked && onPressLike,
      );
    }
  }

  const showStatusOptions = () =>
    dispatch(
      showModalize([
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
        type="status"
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
        onPressShare={enableShare && !isPrivate && sharePostStatus}
        onPressComment={handlePressComment}
        onPressLike={onPressLike}
      />
    </Paper>
  );
};

export default FeedItemStatus;
