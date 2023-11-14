import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  FlatList,
  RefreshControl,
  View,
  Dimensions,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {useSelector, useDispatch} from 'react-redux';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import useTheme from 'theme';
import {getSize} from 'utils/responsive';
import {
  Wrapper,
  Touchable,
  Text,
  HeaderBg,
  EmptyState,
  Avatar,
} from 'components';
import {getBlockList, showModalize, hideModalize, unblockUser} from 'actions';

const width = Dimensions.get('window').width;

const BlockListScreen = ({navigation}) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const {blockList, blockListLoading, blockListLastPage, blockListError} =
    useSelector((state) => state.contact);
  const insets = useSafeAreaInsets();

  const styles = StyleSheet.create({
    wrapper: {flex: 1},
    backBtn: {
      position: 'absolute',
      top: getStatusBarHeight() + getSize.h(20),
      left: getSize.w(24),
      zIndex: 1,
    },
    headerTitle: {
      top: getStatusBarHeight() + getSize.h(26),
      textAlign: 'center',
    },
    scrollWrap: {
      marginTop: getSize.h(68),
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollCon: {
      paddingBottom: getSize.h(20) + insets.bottom,
      flexGrow: 1,
    },
    itemWrapper: {
      paddingHorizontal: getSize.w(24),
      alignItems: 'flex-start',
      width,
    },
    itemContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottomWidth: getSize.h(1),
      borderBottomColor: theme.colors.divider,
      height: getSize.h(68),
      width: width - getSize.w(48),
    },
    itemUser: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      height: getSize.h(68),
    },
    itemLabel: {
      fontSize: getSize.f(17),
      fontFamily: theme.fonts.sfPro.medium,
      color: theme.colors.tagTxt,
      marginLeft: getSize.w(10),
    },
  });

  const handleGetList = (p = page) => {
    dispatch(getBlockList({page: p}));
  };

  const handleLoadMore = () => {
    if (page < blockListLastPage) {
      handleGetList(page + 1);
      setPage(page + 1);
    }
  };

  const handleRefresh = () => {
    setPage(1);
    handleGetList(1);
  };

  useEffect(() => {
    handleGetList(1);
  }, []);

  const showUnblockOptions = (data) => {
    dispatch(
      showModalize([
        {
          label: `Unblock ${data?.user?.name}`,
          onPress: () => {
            dispatch(hideModalize());
            dispatch(unblockUser(data.id, data?.user?.id));
          },
          icon: (
            <MaterialCommunityIcons
              size={getSize.f(20)}
              color={theme.colors.primary}
              name="minus-circle"
            />
          ),
        },
      ]),
    );
  };

  function renderItem({item}) {
    return (
      <Touchable
        onPress={() => navigation.push('UserProfile', {userId: item?.user?.id})}
        style={styles.itemWrapper}>
        <View style={styles.itemContainer}>
          <View style={styles.itemUser}>
            <Avatar size="header" source={item?.user?.avatar} />
            <Text style={styles.itemLabel}>{item?.user?.name}</Text>
          </View>
          <Touchable onPress={() => showUnblockOptions(item)}>
            <MaterialCommunityIcons
              name="minus-circle"
              color={theme.colors.primary}
              size={getSize.h(20)}
            />
          </Touchable>
        </View>
      </Touchable>
    );
  }

  return (
    <Wrapper style={styles.wrapper}>
      <HeaderBg noBorder height={68} addSBHeight />
      <Touchable onPress={navigation.goBack} style={styles.backBtn}>
        <MaterialCommunityIcons
          name="chevron-left"
          size={getSize.f(34)}
          color={theme.colors.textContrast}
        />
      </Touchable>
      <Text variant="header" style={styles.headerTitle}>
        Block List
      </Text>
      <FlatList
        style={styles.scrollWrap}
        contentContainerStyle={styles.scrollCon}
        showsVerticalScrollIndicator={false}
        data={blockList}
        ListHeaderComponent={
          blockListError && (
            <EmptyState label={blockListError?.message || blockListError} />
          )
        }
        keyExtractor={(i) => i.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={
          !blockListLoading && !blockListError && <EmptyState />
        }
        onEndReached={handleLoadMore}
        refreshControl={
          <RefreshControl
            refreshing={blockListLoading}
            colors={theme.colors.gradient}
            tintColor={theme.colors.primary}
            onRefresh={handleRefresh}
          />
        }
      />
    </Wrapper>
  );
};

export default BlockListScreen;
