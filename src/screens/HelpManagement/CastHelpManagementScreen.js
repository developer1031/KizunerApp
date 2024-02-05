import React, {useState, useEffect, Fragment, memo} from 'react';
import {StyleSheet, FlatList, View, RefreshControl, Alert} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch, useSelector} from 'react-redux';
import uuid from 'uuid/v4';

import useTheme from 'theme';
import {getSize} from 'utils/responsive';
import {
  Wrapper,
  Paper,
  HeaderBg,
  Text,
  Touchable,
  OfferItem,
  Loading,
  EmptyState,
} from 'components';
import {
  getCastOfferListHelp,
  updateOfferStatusHelp,
  showAlert,
  getCurrentTime,
} from 'actions';
import {getHangoutStatus} from 'utils/mixed';
import moment from 'moment';
import useAppState from 'utils/appState';
import _ from 'lodash';

const CAST_STATUSES = ['waiting', 'reject', 'accept', 'complete', 'cancel'];

const areEqualOfferItem = (prevProps, nextProps) => {
  return (
    prevProps?.help_id === nextProps?.help_id && prevProps?.id === nextProps?.id
  );
};
const MemoOfferItem = memo(OfferItem, areEqualOfferItem);

const CastHelpManagementScreen = ({navigation}) => {
  const dispatch = useDispatch();

  const {castHelpList, castHelpListLoading, castHelpListLastPage} = useSelector(
    (state) => state.offer,
  );
  const beingUpdateOfferStatus = useSelector(
    (state) => state.offer.beingUpdateOfferStatus,
  );
  const {stripeStatusResponse} = useSelector((state) => state.wallet);

  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const HEADER_HEIGHT = insets.top + 97;
  const [filter, setFilter] = useState(null);
  const [showFilter, setShowFilter] = useState(false);
  const [isLoad, setLoad] = useState(false);
  const [page, setPage] = useState(1);
  const appState = useAppState();
  useEffect(() => {
    appState === 'active' && refreshList();
  }, [appState]);
  const getList = (p = page, status = filter) => {
    let filterValue = status;
    if (status === 'complete' || status === 'completed') {
      filterValue = 'completed';
    } else if (status === 'waiting') {
      filterValue = 'queuing';
    }

    _getList(
      dispatch(
        getCastOfferListHelp(
          {page: p, status: filterValue},
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
    if (castHelpList.length === 0) {
      return func;
    }

    const debouncedFunction = _.debounce(() => {
      func;
    }, 200);
    debouncedFunction();
  };

  function getMore() {
    if (page < castHelpListLastPage) {
      getList(page + 1);
      setPage(page + 1);
    }
  }

  function refreshList() {
    setPage(1);
    getList(1);
  }
  function onPullToReloadRefreshing() {
    setPage(1);
    getList(1);
  }

  const onCompleteHelp = (item) => {
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

    Alert.alert('Information', 'Do you want to complete help?', [
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
                status: 'completed',
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
    dispatch(
      updateOfferStatusHelp(
        {
          id: item.id,
          status: 'helper_started',
          helpId: item.help_id,
          userId: item?.user?.data?.id,
        },
        {
          success: () => {
            dispatch(
              showAlert({
                title: 'Success',
                type: 'success',
                body: 'Notification to requester!',
              }),
            );
            refreshList();
          },
        },
      ),
    );
  };

  const onCancelHelp = (item) => {
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
                        updateOfferStatusHelp(
                          {
                            id: item.id,
                            status: 'helper_cancelled',
                            helpId: item.help_id,
                            userId: item?.user?.data?.id,
                          },
                          refreshList(),
                        ),
                      )
                    : navigation.navigate('SupportCancelHelp', {
                        message:
                          "Unable to contact more than 3 days. You won't get 1 star.",
                        id: item.id,
                        status: 'helper_cancelled',
                        helpId: item.help_id,
                        userId: item?.user?.data?.id,
                        callback: refreshList,
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

  const onSupportHelp = (item) => {
    navigation.navigate('Support', {
      help_offer_id: item.id,
    });
  };

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
      marginTop: insets.top + getSize.h(30),
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
      top: insets.top + getSize.h(130),
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
      top: insets.top + getSize.h(20),
      left: getSize.w(24),
      zIndex: 20,
    },
    headerTitle: {
      top: insets.top + getSize.h(26),
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
  }, []);
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
                status: 'declined',
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
  const renderItem = ({item, index}) => {
    return (
      <MemoOfferItem
        key={`${index}-${item.id}`}
        data={item}
        isHangout={false}
        isOwner={false}
        onCancelWhenWaiting={() => onCancelHangoutWhenStatusIsWaiting(item)}
        onCancel={() => onCancelHelp(item)}
        onComplete={() => onCompleteHelp(item)}
        onStart={() => onStartHelp(item)}
        onSupport={() => onSupportHelp(item)}
      />
    );
  };
  const _loadingView = () => {
    if (castHelpListLoading || beingUpdateOfferStatus || isLoad) {
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
        Requester Management
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
        data={castHelpList}
        keyExtractor={(i) => uuid()}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={styles.seperator} />}
        ListEmptyComponent={!castHelpListLoading && <EmptyState />}
        onEndReached={getMore}
        onEndReachedThreshold={0.5}
        initialNumToRender={10}
        refreshControl={
          <RefreshControl
            refreshing={castHelpListLoading}
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

export default CastHelpManagementScreen;
