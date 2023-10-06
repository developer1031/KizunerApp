import React, {useState, useEffect} from 'react';
import {StyleSheet, FlatList, RefreshControl} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {useDispatch, useSelector} from 'react-redux';

import useTheme from 'theme';
import {getSize} from 'utils/responsive';
import {
  Wrapper,
  Touchable,
  Text,
  HeaderBg,
  EmptyState,
  CastItem,
} from 'components';

import {
  createChatRoom,
  addMemberToRoom,
  showAlert,
  createChatRoomBot,
} from 'actions';
import orangeLight from '../../theme/orangeLight';

const HEADER_HEIGHT = getStatusBarHeight() + 68;

const NearFriendScreen = ({navigation, route}) => {
  const {casts} = route.params;

  const theme = useTheme();
  const dispatch = useDispatch();
  const [listLoading, setListLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(1);

  const {beingCreateRoom, roomDetail, beingAddMember} = useSelector(
    (state) => state.chat,
  );

  const handleGetList = (p = page) => {};

  const handleLoadMore = () => {};

  const handleRefresh = () => {
    setIsRefreshing(false);
  };

  useEffect(() => {
    setListLoading(false);
  }, []);

  function renderCastItem({item}) {
    return <CastItem openChat={openChat} data={item} />;
  }

  function openChat(item) {
    setSelected([item.id]);
    handleDone(item);
  }

  function handleDone(item) {
    if (roomDetail) {
      dispatch(
        addMemberToRoom(
          {
            roomId: roomDetail.id,
            members: selected,
          },
          {
            success: () => {
              navigation.goBack();
              dispatch(
                showAlert({
                  title: 'Success',
                  type: 'success',
                  body: 'New members added!',
                }),
              );
            },
          },
        ),
      );
    } else {
      dispatch(
        createChatRoomBot({
          members: [item.id],
          isFake: item.is_fake === 1 ? true : false,
        }),
      );
    }
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
        Near friends
      </Text>
      <FlatList
        data={casts}
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
        renderItem={renderCastItem}
        keyExtractor={(item) => item.id}
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

export default NearFriendScreen;
