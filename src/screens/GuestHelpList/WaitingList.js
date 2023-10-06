import React, {useEffect, useState} from 'react';
import {StyleSheet, FlatList, RefreshControl, View} from 'react-native';

import useTheme from 'theme';
import {Wrapper, Text, Rating, Avatar, EmptyState} from 'components';
import fetchApi from 'utils/fetchApi';
import {getSize} from 'utils/responsive';

import orangeLight from '../../theme/orangeLight';

const WaitingList = ({route, navigation}) => {
  const theme = useTheme();
  const {helpId} = route.params;

  const [state, setState] = useState({
    loading: false,
    list: [],
    error: null,
  });

  const getWaitingList = async () => {
    if (!helpId) {
      return;
    }
    setState({
      ...state,
      loading: true,
    });
    try {
      const result = await fetchApi({
        endpoint: `/helps/${helpId}/offers`,
        params: {
          status: 'waiting',
        },
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
    } catch (error) {
      setState({
        ...state,
        loading: false,
        error: error.message,
      });
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getWaitingList();
    });

    return unsubscribe;
  }, [navigation]);

  function renderItem({item, index}) {
    return (
      <View style={styles.itemWrapper}>
        <View style={styles.itemContainer}>
          <View style={styles.itemLeft}>
            <Text style={styles.indexTxt}>{index + 1}</Text>
            <Avatar size="header" data={item.user?.data?.media?.avatar} />
            <View style={styles.itemMeta}>
              <Text style={styles.itemName}>{item.user?.data?.name}</Text>
              <Rating
                onPress={() =>
                  navigation.push('ReviewList', {user: item?.user?.data})
                }
                small
                hideReviewCount
                value={item?.user?.data?.rating?.rating}
              />
            </View>
          </View>
          <View style={styles.itemRight}>
            <Text
              style={styles.itemStatus}
              color={theme.colors.offerStatus[item?.status]}>
              {item?.status}
            </Text>
          </View>
        </View>
      </View>
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
            onRefresh={getWaitingList}
          />
        }
      />
    </Wrapper>
  );
};

const styles = StyleSheet.create({
  wrapper: {flex: 1},
  itemWrapper: {
    paddingHorizontal: getSize.w(24),
    height: getSize.h(68),
    backgroundColor: orangeLight.colors.paper,
  },
  itemContainer: {
    borderBottomColor: orangeLight.colors.divider,
    borderBottomWidth: getSize.h(1),
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexGrow: 1,
    alignItems: 'center',
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  indexTxt: {
    fontSize: getSize.f(15),
    fontFamily: orangeLight.fonts.sfPro.medium,
    color: orangeLight.colors.tagTxt,
    marginRight: getSize.w(10),
  },
  itemName: {
    fontSize: getSize.f(17),
    fontFamily: orangeLight.fonts.sfPro.medium,
    color: orangeLight.colors.tagTxt,
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
  },
  itemStatus: {
    fontFamily: orangeLight.fonts.sfPro.medium,
    textTransform: 'uppercase',
  },
});

export default WaitingList;
