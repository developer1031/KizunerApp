import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  FlatList,
  View,
  LayoutAnimation,
  RefreshControl,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import moment from 'moment';
import {useSelector, useDispatch} from 'react-redux';

import useTheme from 'theme';
import {getSize} from 'utils/responsive';
import {getTransactionHistory} from 'actions';
import {
  Wrapper,
  Touchable,
  Text,
  HeaderBg,
  Avatar,
  Button,
  DateTimePicker,
  EmptyState,
} from 'components';
import orangeLight from '../../theme/orangeLight';

const HEADER_HEIGHT = 68;

const TransactionHistoryScreen = ({navigation}) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();

  const {transactionsLoading, transactions, transactionsLastPage} = useSelector(
    (state) => state.wallet,
  );
  const [filtering, setFiltering] = useState(false);
  const [filterDate, setFilterDate] = useState({
    from: moment().subtract(1, 'month').toDate(),
    to: new Date(),
  });
  const [showDatePicker, setShowDatePicker] = useState(null);
  const [page, setPage] = useState(1);

  const styles = StyleSheet.create({
    wrapper: {flex: 1, backgroundColor: orangeLight.colors.background},
    scrollWrap: {
      marginTop: 0,
    },
    backBtn: {
      position: 'absolute',
      top: insets.top + getSize.h(20),
      left: getSize.w(24),
      zIndex: 1,
    },
    headerTitle: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: insets.top + getSize.h(26),
      textAlign: 'center',
    },
    filterBtn: {
      position: 'absolute',
      right: getSize.w(24),
      top: insets.top + getSize.h(20),
      width: getSize.w(36),
      height: getSize.w(36),
      borderRadius: getSize.w(36 / 2),
      backgroundColor: orangeLight.colors.textContrast,
      justifyContent: 'center',
      alignItems: 'center',
    },
    filteringBtn: {
      backgroundColor: 'transparent',
      borderWidth: 2,
      borderColor: orangeLight.colors.textContrast,
    },
    scrollCon: {
      paddingBottom: getSize.h(20),
    },
    itemWrapper: {
      paddingHorizontal: getSize.w(20),
    },
    itemContainer: {
      borderBottomWidth: 1,
      borderBottomColor: orangeLight.colors.divider,
      height: getSize.h(68),
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    itemMeta: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
      flexGrow: 1,
    },
    itemDetail: {
      marginHorizontal: getSize.w(10),
      flex: 1,
      flexGrow: 1,
    },
    itemUser: {
      fontSize: getSize.f(17),
      fontFamily: orangeLight.fonts.sfPro.medium,
      color: orangeLight.colors.tagTxt,
    },
    itemValue: {
      fontSize: getSize.f(17),
      fontFamily: orangeLight.fonts.sfPro.medium,
      color: orangeLight.colors.offered,
    },
    itemValueNegative: {
      color: orangeLight.colors.primary,
    },
    filterWrap: {
      backgroundColor: orangeLight.colors.paper,
      borderBottomLeftRadius: getSize.h(30),
      borderBottomRightRadius: getSize.h(30),
      marginTop: insets.top + getSize.h(HEADER_HEIGHT),
      elevation: 1,
      zIndex: 0,
      overflow: 'hidden',
      ...orangeLight.shadow.small.ios,
    },
    filterBtnWrap: {
      borderTopWidth: 1,
      borderTopColor: orangeLight.colors.divider,
      paddingTop: getSize.h(20),
      paddingBottom: getSize.h(30),
      paddingHorizontal: getSize.w(24),
    },
    filterCon: {
      flexDirection: 'row',
    },
    dateBtn: {
      paddingVertical: getSize.h(20),
      paddingHorizontal: getSize.w(24),
      flex: 1,
    },
    filterLabel: {
      fontSize: getSize.f(15),
    },
    filterDate: {
      fontSize: getSize.f(17),
      fontFamily: orangeLight.fonts.sfPro.bold,
      color: orangeLight.colors.primary,
      marginTop: getSize.h(5),
    },
    dateDivider: {
      borderRightWidth: 1,
      borderRightColor: orangeLight.colors.divider,
    },
    filterHide: {height: 0},
  });

  function loadList(p = 1) {
    dispatch(
      getTransactionHistory({
        from_date: moment(filterDate.from).format('YYYY-MM-DD'),
        to_date: moment(filterDate.to).format('YYYY-MM-DD'),
        page: p,
      }),
    );
  }

  useEffect(() => {
    loadList();
  }, []);

  function handleRefresh() {
    setPage(1);
    loadList(1);
  }

  function handleLoadMore() {
    if (page < transactionsLastPage) {
      loadList(page + 1);
      setPage(page + 1);
    }
  }

  function toggleFiltering() {
    setFiltering(!filtering);
    LayoutAnimation.configureNext(
      LayoutAnimation.create(50, 'easeInEaseOut', 'scaleX'),
    );
  }

  function applyFiltering() {
    toggleFiltering();
    handleRefresh();
  }

  function renderTransactionItem({item}) {
    return (
      <Touchable scalable style={styles.itemWrapper}>
        <View style={styles.itemContainer}>
          <View style={styles.itemMeta}>
            <Avatar source={{uri: item.user.avatar}} size="header" />
            <View style={styles.itemDetail}>
              <Text variant="caption">
                {moment(item.created_at).format('L')}
              </Text>
              <Text style={styles.itemUser}>{item.user.name}</Text>
            </View>
          </View>
          <Text
            style={[
              styles.itemValue,
              item.point.includes('-') && styles.itemValueNegative,
            ]}>
            {item.point} kizuna
          </Text>
        </View>
      </Touchable>
    );
  }
  console.log(transactions);
  return (
    <Wrapper style={styles.wrapper}>
      <HeaderBg noBorder addSBHeight height={HEADER_HEIGHT} />
      <Touchable onPress={navigation.goBack} style={styles.backBtn}>
        <MaterialCommunityIcons
          name="chevron-left"
          size={getSize.f(34)}
          color={theme.colors.textContrast}
        />
      </Touchable>
      <Text variant="header" style={styles.headerTitle}>
        Transaction History
      </Text>
      <Touchable
        style={[styles.filterBtn, !filtering && styles.filteringBtn]}
        onPress={toggleFiltering}>
        <MaterialCommunityIcons
          name="filter-variant"
          color={filtering ? theme.colors.primary : theme.colors.textContrast}
          size={getSize.f(24)}
        />
      </Touchable>
      <View style={[styles.filterWrap, !filtering && styles.filterHide]}>
        <View style={styles.filterCon}>
          <Touchable
            onPress={() => setShowDatePicker('from')}
            scalable
            style={[styles.dateBtn, styles.dateDivider]}>
            <Text style={styles.filterLabel}>From Date</Text>
            <Text style={styles.filterDate}>
              {moment(filterDate.from).format('MMM DD, YYYY')}
            </Text>
          </Touchable>
          <Touchable
            onPress={() => setShowDatePicker('to')}
            scalable
            style={styles.dateBtn}>
            <Text style={styles.filterLabel}>To Date</Text>
            <Text style={styles.filterDate}>
              {moment(filterDate.to).format('MMM DD, YYYY')}
            </Text>
          </Touchable>
        </View>
        <View style={styles.filterBtnWrap}>
          <Button onPress={applyFiltering} title="Apply Filter" fullWidth />
        </View>
      </View>
      <FlatList
        style={styles.scrollWrap}
        contentContainerStyle={styles.scrollCon}
        data={transactions}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={renderTransactionItem}
        initialNumToRender={10}
        onEndReachedThreshold={0.5}
        onEndReached={handleLoadMore}
        ListEmptyComponent={
          <EmptyState wrapperStyle={{marginVertical: getSize.h(50)}} />
        }
        refreshControl={
          <RefreshControl
            colors={theme.colors.gradient}
            tintColor={theme.colors.primary}
            progressViewOffset={insets.top}
            onRefresh={handleRefresh}
            refreshing={transactionsLoading}
          />
        }
      />
      <DateTimePicker
        open={showDatePicker !== null}
        onCancel={() => setShowDatePicker(null)}
        mode="date"
        onConfirm={(date) => {
          const newDate = {
            ...filterDate,
            [showDatePicker]: date,
          };
          setShowDatePicker(null);
          setFilterDate(newDate);
        }}
        maximumDate={showDatePicker === 'from' ? filterDate.to : undefined}
        date={showDatePicker === 'from' ? filterDate.from : filterDate.to}
      />
    </Wrapper>
  );
};

export default TransactionHistoryScreen;
