// @ts-nocheck

import React, {useState, useEffect, Fragment, useCallback, useRef} from 'react';
import {FlatList, View, RefreshControl, Alert, StyleSheet} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch, useSelector} from 'react-redux';
import uuid from 'uuid/v4';
import useTheme from 'theme';
import {getSize} from 'utils/responsive';
import Clipboard from '@react-native-clipboard/clipboard';
import {useNavigation} from '@react-navigation/native';
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
  updateOfferStatus,
  getCastOfferList,
  getCurrentTime,
  showAlert,
} from 'actions';
import {getHangoutStatus} from 'utils/mixed';
import moment from 'moment';
import ModalChooseCardPayment from 'components/ModalChooseCardPayment';
import ModalChooseCryptoPayment from 'components/ModalChooseCryptoPayment';
import ModalChoosePaymentMethod from 'components/ModalChoosePaymentMethod';
import {Linking} from 'react-native';
import {showModalize, hideModalize} from 'actions';
import useAppState from 'utils/appState';
import _ from 'lodash';

const CAST_STATUSES = ['waiting', 'reject', 'accept', 'complete', 'cancel'];

const areEqualOfferItem = (prevProps, nextProps) => {
  return (
    prevProps?.hangout_id === nextProps?.hangout_id &&
    prevProps?.id === nextProps?.id
  );
};

const CastHangoutManagementScreen = () => {
  const navigation = useNavigation();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const HEADER_HEIGHT = insets.top + 97;

  const dispatch = useDispatch();
  const [filter, setFilter] = useState(null);
  const [showFilter, setShowFilter] = useState(false);
  const {castList, castListLoading, castListLastPage} = useSelector(
    (state) => state.offer,
  );
  const beingUpdateOfferStatus = useSelector(
    (state) => state.offer.beingUpdateOfferStatus,
  );
  const [isLoad, setLoad] = useState(false);
  const [page, setPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState({});
  const refModalChooseCardPayment = useRef(null);
  const refModalChooseCyptoAddressPayment = useRef(null);
  const refModalChoosePayment = useRef(null);
  const [itemCurrency, setItemCurrency] = useState(null);

  const appState = useAppState();
  useEffect(() => {
    appState === 'active' && getList();
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
        getCastOfferList(
          {page: p, status: filterValue},
          {
            success: (data, dispatch) => {
              setLoad(false);
              setSelectedItem({});
            },
            error: () => {
              setLoad(false);
              setSelectedItem({});
            },
          },
        ),
      ),
    );
  }
  const _getList = (func) => {
    if (!castList) return func;
    if (castList.length === 0) {
      return func;
    }

    const debouncedFunction = _.debounce(() => {
      func;
    }, 200);
    return debouncedFunction();
  };
  function getMore() {
    if (page < castListLastPage) {
      getList(page + 1);
      setPage(page + 1);
    }
  }

  function refreshList() {
    setPage(1);
    getList(1);
  }

  const style = StyleSheet.create({
    wrapper: {flex: 1},
    scrollWrap: {
      flex: 1,
      zIndex: -1,
    },
    scrollCon: {
      paddingTop: getSize.h(20),
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
    },
    filterItemText: {
      textTransform: 'uppercase',
    },
    headerAppName: {
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
      marginBottom: getSize.h(10),
    },
    bodyText: {
      fontSize: getSize.f(15),
      marginBottom: getSize.h(10),
      lineHeight: getSize.f(23),
    },
    seperator: {
      height: getSize.h(20),
    },
    headerWrap: {zIndex: 10},
  });

  const styles = {
    ...style,
    scrollCon: {
      ...style.scrollCon,
      paddingBottom: getSize.h(20) + insets.bottom,
    },
    filterItemDivider: {
      ...style.filterItemDivider,
      backgroundColor: theme.colors.divider,
    },
    filterItemText: {
      ...style.filterItemText,
      fontFamily: theme.fonts.sfPro.medium,
    },
    headerAppName: {
      ...style.headerAppName,
      fontFamily: theme.fonts.sfPro.medium,
    },
    titleText: {
      ...style.titleText,
      fontFamily: theme.fonts.sfPro.medium,
    },
    bodyText: {
      ...style.bodyText,
      color: theme.colors.tagTxt,
    },
  };

  useEffect(() => {
    getList();
  }, []);
  useEffect(() => {
    if (selectedItem) {
      onPayHangout(selectedItem);
    }
  }, [selectedItem]);

  const onCompleteHangout = (item) => {
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
              getList(),
            ),
          );
        },
      },
    ]);
  };

  const payByInvoicUrl = async (invoice_url) => {
    console.log(invoice_url);
    const supported = await Linking.canOpenURL(invoice_url);
    console.log(supported);
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
  const onPayHangout = (item) => {
    setSelectedItem((prev) => (prev = item));
    setLoad(true);

    if (item.invoice_url) {
      return payByInvoicUrl(item.invoice_url);
    }

    if (!selectedItem.id) {
      setLoad(false);
      return;
    }

    setItemCurrency(item.crypto_currency);

    switch (item.available_payment_method) {
      case 'credit':
        refModalChooseCardPayment.current.open();
        break;
      case 'crypto':
        refModalChooseCyptoAddressPayment.current.open();
        break;
      case 'both':
        refModalChoosePayment.current.open();
        break;
      default:
        setLoad(false);
        break;
    }
  };
  const onStartHangout = (item) => {
    setLoad(true);
    dispatch(
      updateOfferStatus(
        {
          id: item.id,
          status: 'guest_started',
          hangoutId: item.hangout_id,
          userId: item?.user?.data?.id,
        },
        {
          success: () => {
            dispatch(
              showAlert({
                title: 'Success',
                type: 'success',
                body: 'Notification to cast!',
              }),
            );
            getList();
          },
        },
      ),
    );
  };
  const onRejectHangout = (item) => {
    navigation.navigate('SupportRejectHangout', {
      id: item.id,
      status: 'reject',
      hangoutId: item.hangout_id,
      userId: item?.user?.data?.id,
      callback: getList,
    });
  };
  const onApprovedHangout = (item) => {
    setLoad(true);
    Alert.alert('Information', 'Do you want to approve for cast?', [
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
                          'Unable to contact more than 3 days. You will be refunded.',
                        id: item.id,
                        status: 'cancel',
                        hangoutId: item.hangout_id,
                        userId: item?.user?.data?.id,
                        callback: getList(),
                      });
                },
              },
            ],
          );
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
                status: 'guest_declined',
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

  const renderItem = ({item, index}) => {
    return (
      <OfferItem
        key={`${index}-${item.id}`}
        data={item}
        isHangout={true}
        isOwner={false}
        isBlockPay={selectedItem.id === item.id}
        onCancel={() => onCancelHangout(item)}
        onCancelWhenWaiting={() => onCancelHangoutWhenStatusIsWaiting(item)}
        onPay={() => onPayHangout(item)}
        onStart={() => onStartHangout(item)}
        onReject={() => onRejectHangout(item)}
        onApproved={() => onApprovedHangout(item)}
        onSupport={() => onSupportHangout(item)}
      />
    );
  };
  const _loadingView = () => {
    if (castListLoading || beingUpdateOfferStatus || isLoad) {
      return <Loading size="large" fullscreen />;
    }
    return null;
  };
  const confirmCredit = (id) => {
    setLoad(true);
    let data = {
      id: selectedItem.id,
      status: 'paid',
      hangoutId: selectedItem.hangout_id,
      userId: selectedItem?.user?.data?.id,
      payment_method: 'credit',
      card_id: id,
    };

    dispatch(
      updateOfferStatus(data, {
        success: (res) => {
          getList();
        },
        error: () => {
          setLoad(false);
          setSelectedItem({});
        },
      }),
    );
  };
  const cancelCard = () => {
    setLoad(false);
    setSelectedItem({});
  };

  const confirmCrypto = ({currency, crypto}) => {
    setLoad(true);

    let data = {
      id: selectedItem.id,
      status: 'paid',
      hangoutId: selectedItem.hangout_id,
      userId: selectedItem?.user?.data?.id,
      payment_method: 'crypto',
      currency,
      cryptoId: crypto.id,
    };

    if (data.id) {
      dispatch(
        updateOfferStatus(data, {
          success: (res) => {
            console.log('updateOfferStatus', res.data);
            setLoad(false);
            payByInvoicUrl(res.data.invoice_url);
          },
          error: () => {
            console.log('_____ERROR');
            setLoad(false);
            setSelectedItem({});
          },
        }),
      );
    } else {
      Alert.alert('Kizuner', 'Something went wrong! Please retry!', [
        {
          text: 'Ok',
          onPress: () => {
            setLoad(false);
            setSelectedItem({});
          },
        },
      ]);
    }
  };
  const cancelCrypto = () => {
    setLoad(false);
    setSelectedItem({});
  };

  return (
    <>
      <ModalChoosePaymentMethod
        ref={refModalChoosePayment}
        onCredit={() => {
          setTimeout(() => {
            dispatch(hideModalize());
            refModalChooseCardPayment.current.open();
          }, 100);
        }}
        onCrypto={() => {
          setTimeout(() => {
            dispatch(hideModalize());
            refModalChooseCyptoAddressPayment.current.open();
          }, 100);
        }}
        onCancel={() => {
          setLoad(false);
          setSelectedItem({});
          dispatch(hideModalize());
        }}
      />
      <ModalChooseCryptoPayment
        ref={refModalChooseCyptoAddressPayment}
        onConfirm={confirmCrypto}
        onCancel={cancelCrypto}
        currencyLabel={itemCurrency}
      />
      <ModalChooseCardPayment
        ref={refModalChooseCardPayment}
        onConfirm={confirmCredit}
        onCancel={cancelCard}
      />
      <Wrapper style={styles.wrapper}>
        <HeaderBg height={HEADER_HEIGHT} />
        <Headers
          onPress={navigation.goBack}
          styleBtn={styles.backBtn}
          styleTitle={styles.headerTitle}
          color={theme.colors.textContrast}
        />
        <FilterComponent
          theme={theme}
          styles={styles}
          onPress={() => setShowFilter(!showFilter)}
          colorForm={
            filter && theme.colors.offerStatus[getHangoutStatus(filter)]
          }
          title={
            filter
              ? `Status: ${getHangoutStatus(filter).toUpperCase()}`
              : 'All status'
          }
          setFilter={(item) => {
            setFilter(item);
            setShowFilter(false);
            setPage(1);
            getList(1, item);
          }}
          setReset={() => {
            setFilter(null);
            setShowFilter(false);
            setPage(1);
            getList(1, null);
          }}
          showFilter={showFilter}
        />
        <FlatList
          style={styles.scrollWrap}
          contentContainerStyle={styles.scrollCon}
          showsVerticalScrollIndicator={false}
          data={castList}
          keyExtractor={(i) => uuid()}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <View style={styles.seperator} />}
          ListEmptyComponent={!castListLoading && <EmptyState />}
          onEndReached={getMore}
          onEndReachedThreshold={0.5}
          initialNumToRender={10}
          refreshControl={
            <RefreshControl
              refreshing={castListLoading}
              colors={theme.colors.gradient}
              tintColor={theme.colors.primary}
              onRefresh={refreshList}
            />
          }
        />
        {_loadingView()}
      </Wrapper>
    </>
  );
};
const FilterComponent = (props) => {
  return (
    <>
      <Touchable
        scalable
        style={props.styles.headerWrap}
        onPress={props.onPress}>
        <Paper style={props.styles.filterBtn}>
          <View style={props.styles.filterLeft}>
            <MaterialCommunityIcons
              name="filter-variant"
              size={getSize.f(24)}
              color={props.theme.colors.text}
            />
            <Text style={props.styles.filterText} color={props.colorForm}>
              {props.title}
            </Text>
          </View>
          <MaterialCommunityIcons
            name="menu-down"
            size={getSize.f(24)}
            color={props.theme.colors.text}
          />
        </Paper>
      </Touchable>
      {props.showFilter && (
        <Paper style={props.styles.filterPopup}>
          {CAST_STATUSES.map((item, index) => (
            <Fragment key={index}>
              <Touchable
                onPress={() => props.setFilter(item)}
                style={props.styles.filterItem}>
                <Text
                  style={props.styles.filterItemText}
                  color={
                    props.theme.colors.offerStatus[getHangoutStatus(item)]
                  }>
                  {getHangoutStatus(item)}
                </Text>
              </Touchable>
              <View style={props.styles.filterItemDivider} />
            </Fragment>
          ))}
          <Touchable onPress={props.setReset} style={props.styles.filterItem}>
            <Text
              style={props.styles.filterItemText}
              color={props.theme.colors.tagTxt}>
              Reset filter
            </Text>
          </Touchable>
        </Paper>
      )}
    </>
  );
};
const Headers = (props) => {
  return (
    <>
      <Touchable onPress={props.onPress} style={props.styleBtn}>
        <MaterialCommunityIcons
          name="chevron-left"
          size={getSize.f(34)}
          color={props.color}
        />
      </Touchable>
      <Text variant="header" style={props.styleTitle}>
        Cast Management
      </Text>
    </>
  );
};

export default CastHangoutManagementScreen;
