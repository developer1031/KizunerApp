import React, {useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import moment from 'moment';

import useTheme from 'theme';
import {getSize} from 'utils/responsive';
import {Touchable, Text, Paper, Loading, Avatar} from 'components';
import {getHangoutStatus} from 'utils/mixed';
import {hangoutRangeFormat} from 'utils/datetime';
import {createChatRoom} from 'actions';
import orangeLight from '../theme/orangeLight';
import {EnumHangoutStatus} from 'utils/constants';
import {getPaymentString} from 'utils/mixed';
import {ButtonCustom} from './ButtonCustom';
import {Enum} from 'utils/constants';
import {SpaceView} from './SpaceView';

const BtnCustom = (props) => {
  return (
    <ButtonCustom
      isLoading={props.isLoading}
      onPress={props.onPress}
      style={styles.filledButton}
      titleStyle={props.titleStyle || styles.filledButtonText}
      title={props.title}
      isDisable={props.isDisable}
    />
  );
};

const OfferItem = ({
  type,
  data,
  canceling,
  isHangout = true,
  isOwner = false,
  onCancel,
  onCancelWhenWaiting,
  onPay,
  onStart,
  onComplete,
  onReject,
  isBlockPay = false,
  onApproved,
  onSupport,
  isLoading = false,
}) => {
  const theme = useTheme();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.auth.userInfo);
  const beingUpdateOfferStatus = useSelector(
    (state) => state.offer.beingUpdateOfferStatus,
  );

  if (!data) {
    return null;
  }

  const handleView = () => {
    if (data?.help_id) {
      navigation.push('HelpDetail', {helpId: data.help_id});
    } else if (data?.hangout_id) {
      navigation.push('HangoutDetail', {hangoutId: data.hangout_id});
    }
  };

  function handleSendMessage() {
    data?.user?.data?.id &&
      dispatch(
        createChatRoom({members: [data.user.data.id]}, (result) => {
          if (result?.data) {
            navigation.navigate('ChatRoom', {
              data: result.data,
            });
          }
        }),
      );
  }

  const funcMess = () => (
    <BtnCustom onPress={handleSendMessage} title={'Message'} />
  );
  const funcCancel = () => <BtnCustom onPress={onCancel} title={'Cancel'} />;
  const funcPay = () => (
    <BtnCustom isDisable={isBlockPay} onPress={onPay} title={'Pay'} />
  );
  const funcApprove = () => (
    <BtnCustom
      onPress={onApproved}
      isDisable={data.payment_status === Enum.PAYMENT_STATUS.TRANSFERRING}
      title={'Approve'}
    />
  );
  const funcReject = () => (
    <BtnCustom
      onPress={onReject}
      isDisable={data.payment_status === Enum.PAYMENT_STATUS.TRANSFERRING}
      title="Reject"
    />
  );
  const funcComplete = () => (
    <BtnCustom onPress={onComplete} title={'Complete'} />
  );

  function handleReview() {
    navigation.navigate('ReviewForm', {offer: data});
  }

  // #region action footer
  const actionWaiting = () => {
    return (
      <View style={styles.actionWrap}>
        <BtnCustom onPress={onCancelWhenWaiting} title={'Cancel'} />
      </View>
    );
  };
  const actionReject = () => {
    return (
      <View style={styles.actionWrap}>
        {funcMess()}
        <SpaceView />
        <BtnCustom onPress={onSupport} title={'Support'} />
        {((isOwner && !isHangout) || (!isOwner && isHangout)) && (
          <>
            <SpaceView />
            {funcApprove()}
          </>
        )}
      </View>
    );
  };
  const actionStarted = () => {
    if (isHangout) {
      if (isOwner) {
        const isShowBtnComplete =
          onComplete &&
          (data?.available_status === EnumHangoutStatus.NO_TIME ||
            data?.available_status === EnumHangoutStatus.COMBINE);
        return (
          <View style={styles.actionWrap}>
            {funcMess()}
            <SpaceView />
            {funcCancel()}
            {isShowBtnComplete && (
              <>
                <SpaceView />
                {funcComplete()}
              </>
            )}
          </View>
        );
      }

      return (
        <View style={styles.actionWrap}>
          {funcMess()}
          <SpaceView />
          {funcCancel()}
        </View>
      );
    }

    return (
      <View style={styles.actionWrap}>
        {funcMess()}

        <SpaceView />
        {funcCancel()}

        {!!onComplete && (
          <>
            <SpaceView />
            {funcComplete()}
          </>
        )}
      </View>
    );
  };
  const actionAccepted = () => {
    if (isHangout) {
      const isWithoutTime =
        data?.available_status === EnumHangoutStatus.NO_TIME ||
        data?.available_status === EnumHangoutStatus.COMBINE;
      const isWithTime =
        data?.available_status === null ||
        data?.available_status === EnumHangoutStatus.ONLINE;
      const withinDateEnd = moment().diff(data.end_time, 'minutes') < 0;

      const isShowBtnPay =
        onPay && (isWithoutTime || (isWithTime && withinDateEnd));

      return (
        <View style={styles.actionWrap}>
          {funcMess()}
          <SpaceView />
          {funcCancel()}
          {isShowBtnPay && (
            <>
              <SpaceView />
              {funcPay()}
            </>
          )}
        </View>
      );
    }

    if (!isHangout) {
      return (
        <View style={styles.actionWrap}>
          {funcMess()}
          <SpaceView />
          {funcCancel()}
          {onPay && (
            <>
              <SpaceView />
              {funcPay()}
            </>
          )}
        </View>
      );
    }
  };
  const actionBought = () => {
    const isShowBtnStart =
      onStart &&
      (data?.available_status === EnumHangoutStatus.NO_TIME ||
        data?.available_status === EnumHangoutStatus.COMBINE);
    return (
      <View style={styles.actionWrap}>
        {funcMess()}
        {isShowBtnStart && (
          <>
            <SpaceView />
            <BtnCustom onPress={onStart} title={'Start'} />
          </>
        )}
      </View>
    );
  };
  const actionCompleted = () => {
    if (isHangout) {
      if (isOwner) {
        return (
          <View style={styles.actionWrap}>
            <SpaceView />
            {funcMess()}
          </View>
        );
      }

      const isShowBtn =
        onReject &&
        onApproved &&
        (data?.available_status === EnumHangoutStatus.NO_TIME ||
          data?.available_status === EnumHangoutStatus.COMBINE);

      return (
        <View style={styles.actionWrap}>
          {funcMess()}
          {isShowBtn && (
            <>
              <SpaceView />
              {funcReject()}

              <SpaceView />
              {funcApprove()}
            </>
          )}
        </View>
      );
    }

    if (isOwner) {
      const isShowBtn =
        onReject &&
        onApproved &&
        (data?.available_status === EnumHangoutStatus.NO_TIME ||
          data?.available_status === EnumHangoutStatus.COMBINE);

      return (
        <View style={styles.actionWrap}>
          {funcMess()}
          {isShowBtn && (
            <>
              <SpaceView />
              {funcReject()}

              <SpaceView />
              {funcApprove()}
            </>
          )}
        </View>
      );
    }

    return (
      <View style={styles.actionWrap}>{!data.review && <>{funcMess()}</>}</View>
    );
  };
  const actionPaid = () => {
    const isWithoutTime =
      data?.available_status === EnumHangoutStatus.NO_TIME ||
      data?.available_status === EnumHangoutStatus.COMBINE;

    return (
      <View style={styles.actionWrap}>
        {funcMess()}
        <SpaceView />
        {funcCancel()}
        <SpaceView />
        {isWithoutTime &&
          (data.payment_status === Enum.PAYMENT_STATUS.TRANSFERRED ||
            data.payment_status === Enum.PAYMENT_STATUS.PAID) && (
            <BtnCustom onPress={onStart} title={'Start'} />
          )}
      </View>
    );
  };
  const actionApproved = () => {
    return (
      <View style={styles.actionWrap}>
        {!data.review ? (
          <BtnCustom title={'Rate & Review'} onPress={handleReview} />
        ) : (
          <View style={{flex: 1, flexGrow: 1}}>
            <Text
              style={[
                styles.filledButtonText,
                {color: 'gray'},
              ]}>{` You rated ${data.review.rate} star`}</Text>
          </View>
        )}
        <SpaceView />
        {funcMess()}
      </View>
    );
  };
  const actionCancelled = () => {
    return <View style={styles.actionWrap}>{funcMess()}</View>;
  };
  const actionDeclined = () => {
    return <View style={styles.actionWrap}>{funcMess()}</View>;
  };
  const renderAction = () => {
    let actions = {
      waiting: actionWaiting(),
      rejected: actionReject(),
      started: actionStarted(),
      accepted: actionAccepted(),
      bought: actionBought(),
      completed: actionCompleted(),
      paid: actionPaid(),
      approved: actionApproved(),
      cancelled: actionCancelled(),
      declined: actionDeclined(),
    };

    const status = getHangoutStatus(data?.status);

    return actions[status] ? actions[status] : null;
  };
  // #endregion action footer

  return (
    <Paper>
      <Touchable onPress={handleView}>
        {/* //header */}
        <View style={styles.headerWrap}>
          <Touchable
            onPress={() =>
              userInfo?.id !== data?.user?.data?.id &&
              navigation.push('UserProfile', {userId: data?.user?.data?.id})
            }
            style={styles.headerUserWrap}>
            <Avatar
              source={{uri: data.user?.data?.media?.avatar?.thumb}}
              size="header"
            />
            <View style={styles.headerUserInfo}>
              <Text style={styles.headerUserName}>{data.user?.data?.name}</Text>
              <Text variant="caption">{moment(data.created_at).fromNow()}</Text>
            </View>
          </Touchable>

          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <Text
              style={styles.statusText}
              color={theme.colors.offerStatus[getHangoutStatus(data?.status)]}>
              {getHangoutStatus(data?.status)}
            </Text>

            {(data.payment_status?.includes('refund') ||
              data.payment_status?.includes('transfer') ||
              data.payment_status?.includes('paid')) && (
              <Text variant="inputLabel">({data.payment_status})</Text>
            )}
          </View>
        </View>

        {/* //body */}
        <View style={styles.bodyWrap}>
          <Text style={styles.hangoutTitle}>{data.title}</Text>
          <Text style={styles.hangoutKizuna}>
            {getPaymentString(data.payment_method)}
          </Text>
          <Text style={styles.hangoutKizuna}>{data?.amount} USD</Text>
          {data?.available_status != EnumHangoutStatus.NO_TIME && (
            <Text style={styles.hangoutTime}>
              {hangoutRangeFormat(data.start_time, data.end_time)}
            </Text>
          )}
          <Text style={styles.hangoutAddress}>
            {/* {data.address} */}
            {data?.short_address && data?.short_address?.length > 0
              ? data?.short_address
              : data?.address}
          </Text>
        </View>

        {/* //footer */}
        <View style={styles.bodyFooter}>{renderAction()}</View>
      </Touchable>
    </Paper>
  );
};
const styles = StyleSheet.create({
  wrapper: {},
  headerWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: getSize.h(1),
    borderBottomColor: orangeLight.colors.divider,
    paddingHorizontal: getSize.w(16),
    paddingVertical: getSize.h(15),
  },
  headerUserWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerUserInfo: {
    marginLeft: getSize.w(10),
  },
  headerUserName: {
    fontSize: getSize.f(16),
    fontFamily: orangeLight.fonts.sfPro.medium,
  },
  bodyWrap: {
    paddingHorizontal: getSize.w(16),
    paddingVertical: getSize.h(19),
    borderBottomWidth: getSize.h(1),
    borderBottomColor: orangeLight.colors.divider,
  },
  hangoutTitle: {
    fontFamily: orangeLight.fonts.sfPro.medium,
    color: orangeLight.colors.tagTxt,
    fontSize: getSize.f(18),
    lineHeight: getSize.h(22),
  },
  hangoutKizuna: {
    lineHeight: getSize.h(22),
    fontSize: getSize.f(15),
    marginTop: getSize.h(6),
    color: orangeLight.colors.text2,
  },
  hangoutAddress: {
    lineHeight: getSize.h(22),
    fontSize: getSize.f(15),
    color: orangeLight.colors.tagTxt,
  },
  hangoutTime: {
    lineHeight: getSize.h(22),
    fontSize: getSize.f(15),
    color: orangeLight.colors.primary,
    fontFamily: orangeLight.fonts.sfPro.medium,
    marginTop: getSize.h(6),
  },
  bodyFooter: {
    paddingVertical: getSize.h(15),
    paddingHorizontal: getSize.w(16),
  },
  outlinedButton: {
    borderColor: orangeLight.colors.primary,
    borderWidth: 2,
    height: getSize.h(38),
    borderRadius: getSize.h(38 / 2),
    justifyContent: 'center',
    alignItems: 'center',
    flexGrow: 1,
    flex: 1,
  },
  filledButton: {
    backgroundColor: orangeLight.colors.primary,
    height: getSize.h(38),
    borderRadius: getSize.h(38 / 2),
    justifyContent: 'center',
    alignItems: 'center',
    flexGrow: 1,
    flex: 1,
  },
  filledComplete: {
    backgroundColor: orangeLight.colors.secondary,
    height: getSize.h(38),
    borderRadius: getSize.h(38 / 2),
    justifyContent: 'center',
    alignItems: 'center',
    flexGrow: 1,
    flex: 1,
  },

  outlinedButtonText: {
    color: orangeLight.colors.primary,
    fontFamily: orangeLight.fonts.sfPro.medium,
  },
  filledButtonText: {
    color: orangeLight.colors.textContrast,
    fontFamily: orangeLight.fonts.sfPro.medium,
  },
  statusText: {
    textTransform: 'uppercase',
    fontFamily: orangeLight.fonts.sfPro.medium,
  },
  actionWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default OfferItem;
