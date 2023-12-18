import React, {useState, useEffect, Fragment} from 'react';
import {StyleSheet, FlatList, View, RefreshControl, Alert} from 'react-native';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useSelector, useDispatch} from 'react-redux';

import useTheme from 'theme';
import {getSize} from 'utils/responsive';
import {
  Wrapper,
  Paper,
  HeaderBg,
  Text,
  Touchable,
  OfferItem,
  EmptyState,
  Loading,
} from 'components';
import {
  getGuestOfferList,
  updateOfferStatus,
  getCurrentTime,
  showAlert,
} from 'actions';
import moment from 'moment';
import useAppState from 'utils/appState';
import _ from 'lodash';

const GUEST_STATUSES = ['accept', 'completed'];

const GuestHangoutManagementScreen = ({navigation}) => {
  const dispatch = useDispatch();

  const {guestList, guestListLoading, guestListLastPage} = useSelector(
    (state) => state.offer,
  );
  const beingUpdateOfferStatus = useSelector(
    (state) => state.offer.beingUpdateOfferStatus,
  );
  const {stripeStatusResponse} = useSelector((state) => state.wallet);

  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [isLoad, setLoad] = useState(false);
  const HEADER_HEIGHT = getStatusBarHeight() + 97;
  const [filter, setFilter] = useState(null);
  const [showFilter, setShowFilter] = useState(false);
  const [page, setPage] = useState(1);
  const appState = useAppState();
  useEffect(() => {
    appState === 'active' && getList();
  }, [appState]);
  const getList = (p = page, status) => {
    _getList(
      dispatch(
        getGuestOfferList(
          {page: p, status},
          {
            success: (data, dispatch) => {
              setLoad(false);
            },
            error: () => {
              setLoad(false);
            },
          },
        ),
      ),
    );
  };
  const _getList = (func) => {
    if (guestList.length === 0) {
      return func;
    }

    const debouncedFunction = _.debounce(() => {
      func;
    }, 200);
    debouncedFunction();
  };
  function getMore() {
    if (page < guestListLastPage) {
      getList(page + 1);
      setPage(page + 1);
    }
  }

  function refreshList() {
    setPage(1);
    getList(1);
  }

  const styles = StyleSheet.create({
    wrapper: {flex: 1},
    scrollWrap: {flex: 1, top: -getSize.h(20)},
    scrollCon: {
      paddingTop: getSize.h(40),
      paddingBottom: getSize.h(20) + insets.bottom,
      paddingHorizontal: getSize.w(24),
    },
    filterBtn: {
      height: getSize.h(48),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: getStatusBarHeight() + getSize.h(30),
      paddingHorizontal: getSize.w(20),
      marginHorizontal: getSize.w(24),
    },
    filterLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    filterText: {
      marginLeft: getSize.w(14),
    },
    filterPopup: {
      left: getSize.w(24),
      right: getSize.w(24),
      top: getStatusBarHeight() + getSize.h(130),
      position: 'absolute',
      zIndex: 1,
    },
    filterItem: {
      paddingHorizontal: getSize.w(20),
      height: getSize.h(48),
      justifyContent: 'center',
    },
    filterItemDivider: {
      height: getSize.h(1),
      marginHorizontal: getSize.w(24),
      backgroundColor: theme.colors.divider,
    },
    filterItemText: {
      textTransform: 'uppercase',
      fontFamily: theme.fonts.sfPro.medium,
    },
    headerAppName: {
      fontFamily: theme.fonts.sfPro.medium,
      fontSize: getSize.f(18),
    },
    backBtn: {
      position: 'absolute',
      top: getStatusBarHeight() + getSize.h(20),
      left: getSize.w(24),
      zIndex: 20,
    },
    headerTitle: {
      top: getStatusBarHeight() + getSize.h(26),
      textAlign: 'center',
    },
    titleText: {
      lineHeight: getSize.f(23),
      fontSize: getSize.f(15),
      fontFamily: theme.fonts.sfPro.medium,
      marginBottom: getSize.h(10),
    },
    bodyText: {
      fontSize: getSize.f(15),
      color: theme.colors.tagTxt,
      marginBottom: getSize.h(10),
      lineHeight: getSize.f(23),
    },
    seperator: {
      height: getSize.h(20),
    },
    headerWrap: {zIndex: 10},
  });

  const getStatus = (st) => (st === 'accept' ? 'approved' : st);

  const onApprovedHangout = (item) =>
    Alert.alert('Information', 'Do you want to pay for helper?', [
      {
        text: 'Cancel',
        style: 'cancel',
        onPress: () => {
          setLoad(false);
        },
      },
      {
        text: 'OK',
        onPress: () => {
          setLoad(true);
          dispatch(
            updateOfferStatus(
              {
                id: item.id,
                status: 'approved',
                hangoutId: item.hangout_id,
                userId: item?.user?.data?.id,
              },
              getList(),
            ),
          );
        },
      },
    ]);
  const onStartHangout = (item) => {
    setLoad(true);
    Alert.alert('Information', 'Do you want to start hangout?', [
      {
        text: 'Cancel',
        style: 'cancel',
        onPress: () => {
          setLoad(false);
        },
      },
      {
        text: 'OK',
        onPress: () => {
          dispatch(
            updateOfferStatus(
              {
                id: item.id,
                status: 'started',
                hangoutId: item.hangout_id,
                userId: item?.user?.data?.id,
              },
              getList(),
            ),
          );
        },
      },
    ]);
  };
  const onCompleteHangout = (item) => {
    const {status} = stripeStatusResponse;
    if (item.payment_method != 'crypto') {
      if (status !== 'CONNECTED') {
        dispatch(
          showAlert({
            title: 'Error',
            body: 'Please connect your account to Stripe to receive payment',
            type: 'error',
          }),
        );
        return;
      }
    }

    setLoad(true);
    Alert.alert('Information', 'Do you want to complete hangout for cast?', [
      {
        text: 'Cancel',
        style: 'cancel',
        onPress: () => {
          setLoad(false);
        },
      },
      {
        text: 'OK',
        onPress: () => {
          dispatch(
            updateOfferStatus(
              {
                id: item.id,
                status: 'completed',
                hangoutId: item.hangout_id,
                userId: item?.user?.data?.id,
              },
              {
                success: async () => {
                  await getList();
                  await console.log('re-get List ');
                },
              },
            ),
          );
        },
      },
    ]);
  };
  const onRejectHangout = (item) => {
    setLoad(true);
    Alert.alert('Information', 'Do you want to reject help?', [
      {
        text: 'Cancel',
        style: 'cancel',
        onPress: () => {
          setLoad(false);
        },
      },
      {
        text: 'OK',
        onPress: () => {
          dispatch(
            updateOfferStatus(
              {
                id: item.id,
                status: 'reject',
                hangoutId: item.hangout_id,
                userId: item?.user?.data?.id,
              },
              getList(),
            ),
          );
        },
      },
    ]);
  };
  const onCancelHangout = (item) => {
    setLoad(true);
    dispatch(
      getCurrentTime({
        success: (data) => {
          const dateCreated = moment(item.created_at);
          const dateNow = moment(data.data.currentTime);
          const timeDiff = dateNow.diff(dateCreated, 'minutes');
          const isOver24Hours = 24 * 60 < timeDiff;

          Alert.alert(
            'Information',
            isOver24Hours
              ? 'Are you sure you want to cancel?'
              : 'Are you sure you want to cancel? You will automatically receive a 1 star rating.',
            [
              {
                text: 'No',
                style: 'cancel',
                onPress: () => {
                  setLoad(false);
                },
              },
              {
                text: 'Yes',
                onPress: () => {
                  isOver24Hours
                    ? dispatch(
                        updateOfferStatus(
                          {
                            id: item.id,
                            status: 'cancel',
                            hangoutId: item.hangout_id,
                            userId: item?.user?.data?.id,
                          },
                          getList(),
                        ),
                      )
                    : navigation.navigate('SupportCancelHangout', {
                        message:
                          "Unable to contact more than 3 days. You won't get 1 star.",
                        id: item.id,
                        status: 'cancel',
                        hangoutId: item.hangout_id,
                        userId: item?.user?.data?.id,
                        callback: getList,
                      });
                },
              },
            ],
          );
        },
        error: () => {
          setLoad(false);
        },
      }),
    );
  };
  const onCancelHangoutWhenStatusIsWaiting = (item) => {
    setLoad(true);
    Alert.alert('Information', 'Are you sure you want to cancel?', [
      {
        text: 'No',
        style: 'cancel',
        onPress: () => {
          setLoad(false);
        },
      },
      {
        text: 'Yes',
        onPress: () => {
          dispatch(
            updateOfferStatus(
              {
                id: item.id,
                status: 'declined',
                hangoutId: item.hangout_id,
                userId: item?.user?.data?.id,
              },
              getList(),
            ),
          );
        },
      },
    ]);
  };
  const onSupportHangout = (item) => {
    navigation.navigate('Support', {
      hangout_offer_id: item.id,
    });
  };

  useEffect(() => {
    getList();
  }, []);

  const renderItem = ({item, index}) => {
    return (
      <OfferItem
        key={`${index}-${item.id}`}
        type="guest"
        data={item}
        isHangout={true}
        isOwner={true}
        onCancelWhenWaiting={() => onCancelHangoutWhenStatusIsWaiting(item)}
        onCancel={() => onCancelHangout(item)}
        onStart={() => onStartHangout(item)}
        onComplete={() => onCompleteHangout(item)}
        onSupport={() => onSupportHangout(item)}
      />
    );
  };
  const _loadingView = () => {
    if (guestListLoading || beingUpdateOfferStatus || isLoad) {
      return <Loading size="large" fullscreen />;
    }
    return null;
  };

  return (
    <Wrapper style={styles.wrapper}>
      <HeaderBg height={HEADER_HEIGHT} />
      <Touchable onPress={navigation.goBack} style={styles.backBtn}>
        <MaterialCommunityIcons
          name="chevron-left"
          size={getSize.f(34)}
          color={theme.colors.textContrast}
        />
      </Touchable>
      <Text variant="header" style={styles.headerTitle}>
        Guest Management
      </Text>
      <Touchable
        scalable
        style={styles.headerWrap}
        onPress={() => setShowFilter(!showFilter)}>
        <Paper style={styles.filterBtn}>
          <View style={styles.filterLeft}>
            <MaterialCommunityIcons
              name="filter-variant"
              size={getSize.f(24)}
              color={theme.colors.text}
            />
            <Text
              style={styles.filterText}
              color={filter && theme.colors.offerStatus[getStatus(filter)]}>
              {filter
                ? `Status: ${getStatus(filter).toUpperCase()}`
                : 'All status'}
            </Text>
          </View>
          <MaterialCommunityIcons
            name="menu-down"
            size={getSize.f(24)}
            color={theme.colors.text}
          />
        </Paper>
      </Touchable>
      {showFilter && (
        <Paper style={styles.filterPopup}>
          {GUEST_STATUSES.map((item, index) => (
            <Fragment key={item}>
              <Touchable
                onPress={() => {
                  setFilter(item);
                  setShowFilter(false);
                  setPage(1);
                  getList(1, item);
                }}
                style={styles.filterItem}>
                <Text
                  style={styles.filterItemText}
                  color={theme.colors.offerStatus[getStatus(item)]}>
                  {getStatus(item)}
                </Text>
              </Touchable>
              <View style={styles.filterItemDivider} />
            </Fragment>
          ))}
          <Touchable
            onPress={() => {
              setFilter(null);
              setShowFilter(false);
              setPage(1);
              getList(1, null);
            }}
            style={styles.filterItem}>
            <Text style={styles.filterItemText} color={theme.colors.tagTxt}>
              Reset filter
            </Text>
          </Touchable>
        </Paper>
      )}
      <FlatList
        style={styles.scrollWrap}
        contentContainerStyle={styles.scrollCon}
        showsVerticalScrollIndicator={false}
        data={guestList}
        keyExtractor={(i) => i.id.toString()}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={styles.seperator} />}
        ListEmptyComponent={!guestListLoading && <EmptyState />}
        onEndReached={getMore}
        onEndReachedThreshold={0.5}
        initialNumToRender={10}
        refreshControl={
          <RefreshControl
            refreshing={guestListLoading}
            colors={theme.colors.gradient}
            tintColor={theme.colors.primary}
            onRefresh={refreshList}
          />
        }
      />
      {_loadingView()}
    </Wrapper>
  );
};

export default GuestHangoutManagementScreen;
