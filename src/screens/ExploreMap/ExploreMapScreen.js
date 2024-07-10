import React, {useRef, useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  Animated,
  Image,
  Platform,
} from 'react-native';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import LinearGradient from 'react-native-linear-gradient';
import {useSelector, useDispatch} from 'react-redux';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {getDistance} from 'geolib';

import useTheme from 'theme';
import {
  Wrapper,
  HeaderBg,
  SearchBar,
  IconButton,
  UserMarker,
  PriceMarker,
  EmptyState,
  Touchable,
  Text,
} from 'components';
import HangoutExploreItem, {
  PlaceholderItems,
} from 'components/HangoutExploreItem';
import {CARD_WIDTH, CARD_HEIGHT} from 'components/HangoutExploreItem';
import {getSize} from 'utils/responsive';
import i18n from 'i18n';
import {getMapHangouts} from 'actions';
import {Icons} from 'utils/icon';

const width = Dimensions.get('window').width;

const DEFAULT_DELTA = {
  latitudeDelta: 0.075,
  longitudeDelta: 0.0605,
};

const ExploreMapScreen = ({navigation}) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const userCoords = useSelector((state) => state.location.coords);
  const mapView = useRef(null);
  const listView = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [listOffset] = useState(new Animated.Value(0));
  const dispatch = useDispatch();
  const {mapList, mapListLoading, mapListLastPage} = useSelector(
    (state) => state.feed,
  );
  const mapRadius = useSelector((state) => state.app.mapRadius);
  const [page, setPage] = useState(1);
  const [mapRegion, setMapRegion] = useState(null);
  const [showSearchArea, setShowSearchArea] = useState(false);
  const [dataRegion, setDataRegion] = useState(null);

  const HEADER_HEIGHT = insets.top + getSize.h(71);

  async function getRadius() {
    const {northEast, southWest} = await mapView.current.getMapBoundaries();
    return getDistance(northEast, southWest) / 1000 || 15;
  }

  const handleGetNearby = async (
    p = page,
    region = mapRegion || userCoords,
  ) => {
    setDataRegion(region);
    const radius = mapRadius || (await getRadius());
    dispatch(
      getMapHangouts(
        {
          page: p,
          lat: region.latitude,
          lng: region.longitude,
          radius: radius,
        },
        {
          success: () => {
            setShowSearchArea(false);
          },
        },
      ),
    );
  };

  const handleGetMoreNearby = () => {
    if (page < mapListLastPage) {
      handleGetNearby(page + 1);
      setPage(page + 1);
    }
  };

  function handleMapReady() {
    setPage(1);
    handleGetNearby(1, userCoords);
  }

  useEffect(() => {
    if (
      mapList &&
      mapList[0]?.location?.lat &&
      mapList[0]?.location?.lng &&
      page === 1
    ) {
      setCurrentIndex(0);
      listView?.current?.scrollToOffset({offset: 0, animated: true});
    }
  }, [mapList]);

  useEffect(() => {
    if (
      currentIndex >= 0 &&
      mapList[currentIndex]?.location?.lat &&
      mapList[currentIndex]?.location?.lng
    ) {
      mapView?.current.animateToRegion({
        latitude: parseFloat(mapList[currentIndex].location?.lat),
        longitude: parseFloat(mapList[currentIndex].location?.lng),
        ...DEFAULT_DELTA,
      });
    }
  }, [currentIndex]);

  const handleListScroll = (event) => {
    if (currentIndex !== -1) {
      setCurrentIndex(
        Math.trunc(event.nativeEvent.contentOffset.x / CARD_WIDTH),
      );
    }
  };

  const handleMarkerPress = (index) => {
    listView?.current?.scrollToIndex({
      index,
      animated: false,
      viewPosition: 0,
      viewOffset: getSize.w(14),
    });
  };

  function renderHangoutItem({item, index}) {
    return (
      <HangoutExploreItem
        selected={currentIndex === index}
        onPress={
          currentIndex !== index
            ? () => {
                setCurrentIndex(index);
                // handleMarkerPress(index);
              }
            : null
        }
        wrapperStyle={styles.itemWrapper}
        data={item}
      />
    );
  }

  function handleRegionChange(region) {
    setMapRegion(region);
    if (!dataRegion) {
      return;
    }
    const distance = getDistance(dataRegion, region);
    if (
      distance > 9000 ||
      region?.longitudeDelta !== dataRegion?.longitudeDelta
    ) {
      setShowSearchArea(true);
    }
  }

  function searchThisArea() {
    if (!mapRegion) {
      return;
    }
    setPage(1);
    handleGetNearby(1, mapRegion);
  }

  const lang = {
    searchPlaceholder: i18n.t('exploreMap.searchPlaceholder'),
  };

  const styles = StyleSheet.create({
    mapWrapper: {
      flex: 1,
      position: 'relative',
    },
    headerWrap: {
      paddingTop: insets.top,
      height: HEADER_HEIGHT,
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: getSize.w(25),
      zIndex: 1,
      flexDirection: 'row',
    },
    listOverlay: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    },
    hangoutListWrapper: {
      position: 'relative',
      borderTopWidth: getSize.h(1),
      borderTopColor: theme.colors.background,
    },
    hangoutList: {
      overflow: 'visible',
      marginVertical: getSize.h(10),
    },
    hangoutListContent: {
      paddingHorizontal: getSize.w(19),
    },
    hangoutListSeparator: {
      width: getSize.w(4),
    },
    myLocationBtn: {
      position: 'absolute',
      right: getSize.w(24),
      bottom: getSize.h(20),
    },
    navigateIcon: {
      paddingBottom: getSize.h(4),
      transform: [
        {
          rotateX: '45deg',
        },
      ],
    },
    itemWrapper: {
      marginHorizontal: getSize.h(5),
      marginVertical: getSize.w(5),
    },
    listFooterWrapper: {
      flex: 1,
      width: width - CARD_WIDTH - getSize.w(19 * 2),
      justifyContent: 'center',
      alignItems: 'center',
    },
    listFooterImage: {
      width: CARD_WIDTH / 2.5,
      height: CARD_WIDTH / 2.5,
      resizeMode: 'contain',
    },
    emptyWrap: {
      width: width - getSize.w(19 * 2),
      height: CARD_HEIGHT,
    },
    searchAreaBtn: {
      height: getSize.h(38),
      borderRadius: getSize.h(38 / 2),
      paddingHorizontal: getSize.w(15),
      backgroundColor: theme.colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      top: getSize.h(20),
      alignSelf: 'center',
      ...theme.shadow.small.ios,
      ...theme.shadow.small.android,
    },
    searchAreaTxt: {
      color: theme.colors.textContrast,
      fontFamily: theme.fonts.sfPro.medium,
    },
  });

  const USER_REGION = {
    latitude: userCoords.latitude || 37.78825,
    longitude: userCoords.longitude || -122.4324,
    ...DEFAULT_DELTA,
  };

  return (
    <Wrapper>
      <HeaderBg height={HEADER_HEIGHT + insets.top} noBorder />
      <View style={styles.headerWrap}>
        <SearchBar
          placeholder={lang.searchPlaceholder}
          wrapperStyle={{width: width - getSize.w(48 + 10 + 48)}}
          autoFocus={false}
          onPress={() => navigation.navigate('Search')}
        />
        <IconButton
          variant="nodefault"
          onPress={() => navigation.navigate('Explore')}
          icon={
            <AntDesign
              name="home"
              size={getSize.f(24)}
              color={theme.colors.text}
            />
          }
        />
      </View>

      <View style={styles.mapWrapper}>
        <MapView
          ref={mapView}
          provider={PROVIDER_GOOGLE}
          onRegionChangeComplete={handleRegionChange}
          style={styles.mapWrapper}
          customMapStyle={theme.mapStyle}
          showsMyLocationButton={false}
          onMapReady={handleMapReady}
          initialRegion={USER_REGION}>
          {userCoords.latitude && (
            <Marker
              anchor={{x: 0.5, y: 0.5}}
              coordinate={{
                latitude: parseFloat(userCoords.latitude),
                longitude: parseFloat(userCoords.longitude),
              }}>
              <UserMarker />
            </Marker>
          )}
          {mapList
            .filter((item) => item?.location?.lat && item?.location?.lng)
            .map((item, index) => (
              <Marker
                onPress={() => handleMarkerPress(index)}
                key={item.id.toString()}
                tracksViewChanges={Platform.OS === 'ios'}
                zIndex={index === currentIndex ? 2 : 1}
                coordinate={{
                  latitude: parseFloat(item.location.lat),
                  longitude: parseFloat(item.location.lng),
                }}>
                <PriceMarker
                  selected={index === currentIndex}
                  value={
                    item.is_range_price
                      ? `${item.min_amount} - ${item.min_amount}`
                      : item.amount
                  }
                />
              </Marker>
            ))}
        </MapView>

        <IconButton
          wrapperStyle={styles.myLocationBtn}
          activeOpacity={1}
          variant="primary"
          onPress={() => mapView?.current.animateToRegion(USER_REGION)}
          icon={
            <Ionicons
              name="navigate"
              size={getSize.f(24)}
              color={theme.colors.textContrast}
              style={styles.navigateIcon}
            />
          }
        />
        {showSearchArea && (
          <Touchable
            onPress={searchThisArea}
            scalable
            style={styles.searchAreaBtn}>
            <Text style={styles.searchAreaTxt}>Search this area</Text>
          </Touchable>
        )}
      </View>

      <View style={styles.hangoutListWrapper}>
        <LinearGradient
          colors={['#EEEEEE', '#FAFAFA']}
          start={{x: 0, y: 1}}
          end={{x: 0, y: 0}}
          style={styles.listOverlay}
        />
        <Animated.FlatList
          ref={listView}
          data={mapList}
          renderItem={renderHangoutItem}
          horizontal
          snapToInterval={getSize.w(150 + 14)}
          style={styles.hangoutList}
          contentContainerStyle={styles.hangoutListContent}
          keyExtractor={(item) => item.id.toString()}
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          decelerationRate={0.5}
          ItemSeparatorComponent={() => (
            <View style={styles.hangoutListSeparator} />
          )}
          ListFooterComponent={
            mapListLoading ? (
              <PlaceholderItems
                // eslint-disable-next-line react-native/no-inline-styles
                style={{marginLeft: mapList.length ? getSize.w(4) : 0}}
              />
            ) : mapList.length > 0 ? (
              <View style={styles.listFooterWrapper}>
                <Image style={styles.listFooterImage} source={Icons.Logo} />
              </View>
            ) : null
          }
          onScroll={Animated.event(
            [
              {
                nativeEvent: {
                  contentOffset: {
                    x: listOffset,
                  },
                },
              },
            ],
            {
              listener: handleListScroll,
              useNativeDriver: true,
            },
          )}
          initialNumToRender={6}
          onEndReachedThreshold={0.5}
          onEndReached={handleGetMoreNearby}
          ListEmptyComponent={
            !mapListLoading && <EmptyState wrapperStyle={styles.emptyWrap} />
          }
        />
      </View>
    </Wrapper>
  );
};

export default ExploreMapScreen;
