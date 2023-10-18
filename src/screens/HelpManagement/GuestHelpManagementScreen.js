import React, {useState, useEffect, Fragment, memo} from 'react';
import {StyleSheet, FlatList, View, RefreshControl, Alert} from 'react-native';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSafeArea} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';
import uuid from 'uuid/v4';
import Clipboard from '@react-native-clipboard/clipboard';

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
  getGuestOfferListHelp,
  updateOfferStatusHelp,
  getCurrentTime,
} from 'actions';
import {getHangoutStatus} from 'utils/mixed';
import moment from 'moment';
import {Linking} from 'react-native';
import useAppState from 'utils/appState';
import _ from 'lodash';

const CAST_STATUSES = ['waiting', 'reject', 'accept', 'complete', 'cancel'];

const areEqualOfferItem = (prevProps, nextProps) => {
  return (
    prevProps?.help_id === nextProps?.help_id && prevProps?.id === nextProps?.id
  );
};
const MemoOfferItem = memo(OfferItem, areEqualOfferItem);

const GuestHelpManagementScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const insets = useSafeArea();
  const HEADER_HEIGHT = getStatusBarHeight() + 97;
  const [isLoad, setLoad] = useState(false);
  const [isBlockPay, setBlockPay] = useState(null);
  const [filter, setFilter] = useState(null);
  const [showFilter, setShowFilter] = useState(false);
  const {guestHelpList, guestHelpListLoading, guestHelpListLastPage} =
    useSelector((state) => state.offer);
  const beingUpdateOfferStatus = useSelector(
    (state) => state.offer.beingUpdateOfferStatus,
  );
  const [page, setPage] = useState(1);
  const appState = useAppState();
  useEffect(() => {
    appState === 'active' && refreshList();
  }, [appState]);
  function getList(p = page, status = filter) {
    let filterValue = status;
    if (status === 'complete' || status === 'completed') {
      filterValue = 'completed';
    } else if (status === 'waiting') {
      filterValue = 'queuing';
    }

    _getList(
      dispatch(
        getGuestOfferListHelp(
          {page: p, status: filterValue},
          {
            success: (data, dispatch) => {
              setLoad(false);
              setBlockPay(null);
            },
            error: () => {
              setLoad(false);
              setBlockPay(null);
            },
          },
        ),
      ),
    );
  }
  const _getList = (func) => {
    if (guestHelpList.length === 0) {
      return func;
    }

    const debouncedFunction = _.debounce(() => {
      func;
    }, 200);
    debouncedFunction();
  };

  function getMore() {
    if (page < guestHelpListLastPage) {
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
    scrollWrap: {
      flex: 1,
      zIndex: -1,
    },
    scrollCon: {
      paddingTop: getSize.h(20),
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

  useEffect(() => {
    getList();

    return () => {
      setLoad(false);
    };
  }, []);

  const onApprovedHelp = (item) => {
    setLoad(true);
    Alert.alert('Information', 'Do you want to approve for helper?', [
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
            updateOfferStatusHelp(
              {
                id: item.id,
                status: 'approved',
                helpId: item.help_id,
                userId: item?.user?.data?.id,
              },
              refreshList(),
            ),
          );
        },
      },
    ]);
  };
  const onStartHelp = (item) => {
    setLoad(true);
    Alert.alert('Information', 'Do you want to start help?', [
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
            updateOfferStatusHelp(
              {
                id: item.id,
                status: 'started',
                helpId: item.help_id,
                userId: item?.user?.data?.id,
              },
              refreshList(),
            ),
          );
        },
      },
    ]);
  };
  const onRejectHelp = (item) => {
    return navigation.navigate('SupportRejectHelp', {
      id: item.id,
      status: 'reject',
      hangoutId: item.hangout_id,
      userId: item?.user?.data?.id,
      callback: getList,
    });
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
            updateOfferStatusHelp(
              {
                id: item.id,
                status: 'helper_declined',
                helpId: item.help_id,
                userId: item?.user?.data?.id,
              },
              getList(),
            ),
          );
        },
      },
    ]);
  };
  const onCancelHelp = (item) => {
    setLoad(true);
    dispatch(
      getCurrentTime({
        success: (data) => {
          console.log(
            '🚀 ~ file: GuestHelpManagementScreen.js:275 ~ onCancelHelp ~ data:',
            data,
          );
          const dateCreated = moment(item.created_at);
          const dateNow = moment(data.data.currentTime);
          const timeDiff = dateNow.diff(dateCreated, 'minutes');
          const isOver24Hours = 24 * 60 < timeDiff;
          Alert.alert(
            'Information',
            isOver24Hours
              ? 'Are you sure you want to cancel?'
              : 'Are you sure you want to cancel? There is no refund.',
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
                        updateOfferStatusHelp(
                          {
                            id: item.id,
                            status: 'cancel',
                            helpId: item.help_id,
                            userId: item?.user?.data?.id,
                          },
                          refreshList(),
                        ),
                      )
                    : navigation.navigate('SupportCancelHelp', {
                        message:
                          'Unable to contact more than 3 days. You will be refunded.',
                        id: item.id,
                        status: 'cancel',
                        helpId: item.help_id,
                        userId: item?.user?.data?.id,
                        callback: refreshList,
                      });
                },
              },
            ],
          );
        },
      }),
    );
  };

  const payByInvoicUrl = async (invoice_url) => {
    const supported = await Linking.canOpenURL(invoice_url);
    if (supported) {
      await Linking.openURL(invoice_url);

      return;
    }

    Alert.alert(
      'Warning',
      `We can not open link automatically, please pay manually by: ${invoice_url}`,
      [
        {
          text: 'Copy link',
          onPress: () => {
            Clipboard.setString(invoice_url);
          },
        },
        {
          text: 'Cancel',
        },
      ],
    );
  };

  const onPayHelp = (item) => {
    setLoad(true);
    setBlockPay(item.id);
    if (item.invoice_url) {
      return payByInvoicUrl(item.invoice_url);
    }

    Alert.alert('Information', 'Do you want to pay help?', [
      {
        text: 'Cancel',
        style: 'cancel',
        onPress: () => {
          setBlockPay(null);
          setLoad(false);
        },
      },
      {
        text: 'OK',
        onPress: () => {
          dispatch(
            updateOfferStatusHelp(
              {
                id: item.id,
                status: 'paid',
                helpId: item.help_id,
                userId: item?.user?.data?.id,
              },
              {
                success: (res) => {
                  payByInvoicUrl(res.data.invoice_url);
                },
              },
            ),
          );
        },
      },
    ]);
  };
  const onSupportHelp = (item) => {
    navigation.navigate('Support', {
      help_offer_id: item.id,
    });
  };

  const renderItem = ({item, index}) => {
    return (
      <MemoOfferItem
        key={`${index}-${item.id}`}
        data={item}
        isHangout={false}
        isOwner={true}
        onCancelWhenWaiting={() => onCancelHangoutWhenStatusIsWaiting(item)}
        isBlockPay={isBlockPay === item.id}
        onCancel={() => onCancelHelp(item)}
        onStart={() => onStartHelp(item)}
        onReject={() => onRejectHelp(item)}
        onApproved={() => onApprovedHelp(item)}
        onPay={() => onPayHelp(item)}
        onSupport={() => onSupportHelp(item)}
      />
    );
  };
  const _loadingView = () => {
    if (guestHelpListLoading || beingUpdateOfferStatus || isLoad) {
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
        Helper Management
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
              color={
                filter && theme.colors.offerStatus[getHangoutStatus(filter)]
              }>
              {filter
                ? `Status: ${getHangoutStatus(filter).toUpperCase()}`
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
          {CAST_STATUSES.map((item, index) => (
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
                  color={theme.colors.offerStatus[getHangoutStatus(item)]}>
                  {getHangoutStatus(item)}
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
        data={guestHelpList}
        keyExtractor={(i) => uuid()}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={styles.seperator} />}
        ListEmptyComponent={!guestHelpListLoading && <EmptyState />}
        onEndReached={getMore}
        onEndReachedThreshold={0.5}
        initialNumToRender={10}
        refreshControl={
          <RefreshControl
            refreshing={guestHelpListLoading}
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

export default GuestHelpManagementScreen;
