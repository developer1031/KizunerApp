import React, {useState, useEffect, memo} from 'react';
import {StyleSheet, FlatList, RefreshControl} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {useDispatch} from 'react-redux';

import useTheme from 'theme';
import {getSize} from 'utils/responsive';
import {Wrapper, Touchable, Text, HeaderBg, EmptyState} from 'components';

import orangeLight from '../../theme/orangeLight';
import {createUUID} from 'utils/util';
import FeedItemFakeHelp from './FeedItemFakeHelp';

const HEADER_HEIGHT = getStatusBarHeight() + 68;
const areEqualFeedItem = (prevProps, nextProps) => {
  return prevProps?.data?.id === nextProps?.data?.id;
};
const MemoFeedItemHelp = memo(FeedItemFakeHelp, areEqualFeedItem);

const FakeHangoutScreen = ({navigation, route}) => {
  const {hangouts} = route.params;

  const theme = useTheme();
  const dispatch = useDispatch();
  const [listLoading, setListLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleLoadMore = () => {};

  const handleRefresh = () => {
    setIsRefreshing(false);
  };

  useEffect(() => {
    setListLoading(false);
  }, []);

  function renderItem({item}) {
    return <FeedItemFakeHelp data={item} type={item?.type} />;
  }

  return (
    <Wrapper style={styles.wrapper}>
      <HeaderBg noBorder height={HEADER_HEIGHT} />
      <Touchable onPress={navigation.goBack} style={styles.backBtn}>
        <MaterialCommunityIcons
          name="chevron-left"
          size={getSize.f(34)}
          color={theme.colors.textContrast}
        />
      </Touchable>
      <Text variant="header" style={styles.headerTitle}>
        Hangouts
      </Text>
      <FlatList
        data={hangouts ? hangouts?.data : []}
        showsVerticalScrollIndicator={false}
        style={styles.scrollWrap}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            colors={theme.colors.gradient}
            tintColor={theme.colors.primary}
            onRefresh={handleRefresh}
          />
        }
        renderItem={renderItem}
        keyExtractor={(item) => item?.id?.toString() + createUUID()}
        onEndReachedThreshold={0.5}
        onEndReached={handleLoadMore}
        ListEmptyComponent={() =>
          !listLoading && <EmptyState wrapperStyle={styles.emptyState} />
        }
      />
    </Wrapper>
  );
};

const styles = StyleSheet.create({
  wrapper: {flex: 1},
  scrollWrap: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    top: getSize.h(HEADER_HEIGHT),
    backgroundColor: orangeLight.colors.paper,
  },
  backBtn: {
    position: 'absolute',
    top: getStatusBarHeight() + getSize.h(20),
    left: getSize.w(24),
    zIndex: 1,
  },
  moreBtn: {
    position: 'absolute',
    top: getStatusBarHeight() + getSize.h(25),
    right: getSize.w(24),
    zIndex: 1,
  },
  headerTitle: {
    top: getStatusBarHeight() + getSize.h(26),
    textAlign: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: getSize.h(57),
    borderBottomColor: orangeLight.colors.divider,
    borderBottomWidth: getSize.h(1),
    paddingHorizontal: getSize.w(24),
  },
  sectionLabel: {
    fontSize: getSize.f(15),
    textTransform: 'uppercase',
    fontFamily: orangeLight.fonts.sfPro.medium,
  },
  seeAllBtn: {
    color: orangeLight.colors.primary,
    fontSize: getSize.f(15),
  },
  emptyState: {
    marginTop: getSize.h(100),
  },
});

export default FakeHangoutScreen;
