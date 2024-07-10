import React, {useEffect, useState, memo} from 'react';
import {
  StyleSheet,
  FlatList,
  RefreshControl,
  View,
  TouchableOpacity,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch, useSelector} from 'react-redux';
import moment from 'moment';

import useTheme from 'theme';
import {
  Wrapper,
  Text,
  Rating,
  Avatar,
  Touchable,
  Loading,
  EmptyState,
} from 'components';
import fetchApi from 'utils/fetchApi';
import {getSize} from 'utils/responsive';
import {updateOfferStatus, createChatRoom} from 'actions';
import {lessThan} from 'react-native-reanimated';
import {EnumHangoutStatus} from 'utils/constants';
import orangeLight from '../../theme/orangeLight';

const CapacityList = ({route, navigation}) => {
  const theme = useTheme();
  const {hangoutId, start, end} = route.params;
  const updating = useSelector((state) => state.feed.beingUpdateOffer);
  const userInfo = useSelector((state) => state.auth.userInfo);
  const dispatch = useDispatch();
  const [isLoadId, setLoadId] = useState();

  const [state, setState] = useState({
    loading: false,
    list: [],
    error: null,
  });

  const getCapacityList = async () => {
    if (!hangoutId) {
      return;
    }
    setState({
      ...state,
      loading: true,
    });
    try {
      const result = await fetchApi({
        endpoint: `/hangouts/${hangoutId}/offers`,
      });
      const {status, data, message} = result;
      if (status !== 200) {
        throw new Error(
          data?.data?.message ||
            data?.message ||
            message ||
            `Undefined error with status ${status}`,
        );
      }
      setState({
        loading: false,
        list: data?.data,
        error: null,
      });
      setLoadId();
    } catch (error) {
      setLoadId();
      setState({
        ...state,
        loading: false,
        error: error.message,
      });
    }
  };

  const handleUpdateStatus = (offerId, status, userId) => {
    setLoadId(offerId);
    dispatch(
      updateOfferStatus(
        {id: offerId, status, hangoutId, userId},
        {
          success: () => getCapacityList(),
        },
      ),
    );
  };

  useEffect(() => {
    getCapacityList();
  }, []);

  const styles = StyleSheet.create({
    wrapper: {flex: 1},
    itemWrapper: {
      paddingHorizontal: getSize.w(24),
      backgroundColor: orangeLight.colors.paper,
    },
    itemContainer: {
      borderBottomColor: orangeLight.colors.divider,
      borderBottomWidth: getSize.h(1),
      paddingVertical: 15,
    },
    itemLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    indexTxt: {
      fontSize: getSize.f(15),
      fontFamily: theme.fonts.sfPro.medium,
      color: theme.colors.tagTxt,
      marginRight: getSize.w(10),
    },
    itemName: {
      fontSize: getSize.f(17),
      fontFamily: theme.fonts.sfPro.medium,
      color: theme.colors.tagTxt,
      marginBottom: getSize.h(5),
    },
    avatar: {},
    itemMeta: {
      marginLeft: getSize.w(10),
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
    },
    itemRight: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-end',
      marginLeft: 100,
    },
    itemStatus: {
      fontFamily: theme.fonts.sfPro.medium,
      textTransform: 'uppercase',
    },
    approveBtn: {
      backgroundColor: theme.colors.offerStatus.approved,
      width: getSize.h(38),
      height: getSize.h(38),
      borderRadius: getSize.h(38 / 2),
      justifyContent: 'center',
      alignItems: 'center',
    },
    rejectBtn: {
      backgroundColor: theme.colors.offerStatus.rejected,
      width: getSize.h(38),
      height: getSize.h(38),
      borderRadius: getSize.h(38 / 2),
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: getSize.w(10),
    },
    btnDisabled: {
      opacity: 0.5,
    },
  });

  const _pushProfile = (item) =>
    navigation.push('UserProfile', {userId: item?.user?.data?.id});
  const _pushRating = (item) =>
    navigation.push('ReviewList', {user: item?.user?.data});

  const creChatRoom = (item) => {
    dispatch(
      createChatRoom({members: [item.user.data.id]}, (result) => {
        if (result?.data) {
          navigation.navigate('ChatRoom', {
            data: result.data,
          });
        }
      }),
    );
  };
  function renderItem({item, index}) {
    let canHangout = moment.utc(end).isAfter(moment());
    if (
      item?.available_status === EnumHangoutStatus.NO_TIME ||
      item?.available_status === EnumHangoutStatus.COMBINE
    ) {
      canHangout = true;
    }
    return (
      <ItemHelp
        key={`${index}-${item.id}`}
        onPressProfile={() => _pushProfile(item)}
        onPressRating={() => _pushRating(item)}
        isPending={
          canHangout &&
          (item?.status === 'pending' || item?.status == 'queuing')
        }
        isAccept={item?.status === 'accept'}
        rating={item?.user?.data?.rating?.rating || 0}
        name={item.user?.data?.name}
        avatar={item.user?.data?.media?.avatar}
        amount={index + 1}
        disableProfile={userInfo?.id === item?.user?.data?.id}
        setAccept={() =>
          !isLoadId &&
          handleUpdateStatus(item.id, 'accept', item?.user?.data?.id)
        }
        setChat={() => creChatRoom(item)}
        setClose={() =>
          !isLoadId &&
          handleUpdateStatus(item.id, 'reject', item?.user?.data?.id)
        }
        block={updating.includes(item.id)}
        styleChat={[
          styles.rejectBtn,
          updating.includes(item.id) && styles.btnDisabled,
          {
            backgroundColor: orangeLight.colors.offerStatus.approved,
          },
        ]}
        styleAccept={[
          styles.approveBtn,
          updating.includes(item.id) && styles.btnDisabled,
        ]}
        styleClose={[
          styles.rejectBtn,
          updating.includes(item.id) && styles.btnDisabled,
        ]}
        colors={theme.colors.textContrast}
        accepted={
          <Text
            style={styles.itemStatus}
            color={theme.colors.offerStatus[item?.status + 'ed']}>
            {item?.status + 'ed'}
          </Text>
        }
        styles={styles}
        isLoad={item.id === isLoadId}
      />
    );
  }

  return (
    <Wrapper style={styles.wrapper}>
      <FlatList
        data={state.list}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={!state.loading && <EmptyState />}
        refreshControl={
          <RefreshControl
            refreshing={state.loading}
            colors={theme.colors.gradient}
            tintColor={theme.colors.primary}
            onRefresh={getCapacityList}
          />
        }
      />
    </Wrapper>
  );
};

const ItemHelp = memo((props) => {
  return (
    <View style={props.styles.itemWrapper}>
      <View style={props.styles.itemContainer}>
        <Profile {...props} />
        <View style={props.styles.itemRight}>
          {props.isPending ? (
            <ActionFooter {...props} />
          ) : props.isAccept ? (
            props.accepted
          ) : null}
        </View>
      </View>
    </View>
  );
});

const Profile = memo((props) => {
  return (
    <TouchableOpacity
      onPress={props.onPressProfile}
      disabled={props.disableProfile ? true : false}
      style={props.styles.itemLeft}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <Text style={props.styles.indexTxt}>{props.amount}</Text>
        <Avatar size="header" data={props.avatar} />

        <View style={props.styles.itemMeta}>
          <Text style={props.styles.itemName}>{props.name}</Text>
          <Rating
            onPress={props.onPressProfile}
            small
            hideReviewCount
            value={props.rating}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
});

const ActionFooter = memo((props) => {
  return (
    <>
      <BtnAction
        disabled={props.block}
        onPress={props.setChat}
        style={props.styleChat}
        icon={
          <MaterialCommunityIcons
            name="message"
            color={props.colors}
            size={getSize.f(22)}
          />
        }
      />
      <BtnAction
        isLoad={props.isLoad}
        disabled={props.block}
        onPress={props.setClose}
        style={props.styleClose}
        icon={
          <MaterialCommunityIcons
            name="close"
            color={props.colors}
            size={getSize.f(22)}
          />
        }
      />
      <BtnAction
        isLoad={props.isLoad}
        disabled={props.block}
        onPress={props.setAccept}
        style={props.styleAccept}
        icon={
          <MaterialCommunityIcons
            name="check"
            color={props.colors}
            size={getSize.f(22)}
          />
        }
      />
    </>
  );
});

const BtnAction = memo((props) => {
  if (props.isLoad) {
    return (
      <View style={[props.style, {opacity: 0.5}]}>
        <Loading />
      </View>
    );
  }

  return (
    <Touchable
      disabled={props.disabled}
      onPress={props.onPress}
      style={props.style}>
      {props.icon}
    </Touchable>
  );
});

export default CapacityList;
