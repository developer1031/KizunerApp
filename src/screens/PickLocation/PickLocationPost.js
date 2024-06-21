import React, {useRef, useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
  FlatList,
  Dimensions,
  Keyboard,
  TouchableOpacity,
} from 'react-native';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import {useSelector} from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {
  Wrapper,
  IconButton,
  SearchBar,
  Touchable,
  Button,
  Text,
} from 'components';
import {getSize} from 'utils/responsive';
import useTheme from 'theme';
import {
  searchForLocation,
  fetchAddressForLocation,
  fetchLocationDetail,
} from 'utils/geolocationService';
import debounce from 'utils/debounce';

const width = Dimensions.get('window').width;

const PickLocationPostScreen = ({navigation, route}) => {
  const mapView = useRef(null);
  const searchBar = useRef(null);
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const userCoords = useSelector((state) => state.location.coords);
  const {onSelect, location} = route.params;
  const [search, setSearch] = useState('');
  const [searchExact, setSearchExact] = useState('');
  const [typeSearch, setTypeSearch] = useState('normal'); // 'exact' | 'normal'
  const [predictions, setPredictions] = useState([]);
  const [searching, setSearching] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const DEFAULT_DELTA = {
    latitudeDelta: 0.03,
    longitudeDelta: 0.0405,
  };

  const USER_REGION = {
    latitude:
      location && location.lat
        ? parseFloat(location.lat)
        : userCoords.latitude || 37.78825,
    longitude:
      location && location.lng
        ? parseFloat(location.lng)
        : userCoords.longitude || -122.4324,
    ...DEFAULT_DELTA,
  };
  const [region, setRegion] = useState(USER_REGION);

  useEffect(() => {
    handleFetchAddressDebounced(USER_REGION);
  }, []);

  const styles = StyleSheet.create({
    wrapper: {flex: 1},
    mapWrapper: {flex: 1},
    markerFixed: {
      left: '50%',
      marginLeft: -24,
      marginTop: -48 / 2,
      position: 'absolute',
      top: '50%',
    },
    marker: {
      fontSize: 48,
    },
    backBtn: {
      position: 'absolute',
      top: insets.top + getSize.h(20),
      left: getSize.w(24),
    },
    myLocationBtn: {
      position: 'absolute',
      right: getSize.w(24),
      bottom: getSize.h(20 + insets.bottom + 90),
    },
    navigateIcon: {
      paddingBottom: getSize.h(4),
      transform: [
        {
          rotateX: '45deg',
        },
      ],
    },
    searchWrap: {
      left: getSize.w(24),
      right: getSize.w(24),
      position: 'absolute',
      top: insets.top + getSize.h(80),
      zIndex: 10,
    },
    buttonWrap: {
      left: getSize.w(24),
      right: getSize.w(24),
      position: 'absolute',
      bottom: insets.bottom + getSize.h(40),
    },
    searchItem: {
      height: getSize.h(60),
      justifyContent: 'center',
      paddingHorizontal: getSize.w(24),
    },
    listDivider: {
      height: getSize.h(1),
      backgroundColor: theme.colors.divider,
    },
    searchBar: {
      zIndex: 11,
    },
    listWrap: {
      width: '100%',
      top: -getSize.h(20),
      backgroundColor: theme.colors.paper,
      borderBottomLeftRadius: 10,
      borderBottomRightRadius: 10,
      ...theme.shadow.small.ios,
      ...theme.shadow.small.android,
    },
    listHide: {
      height: 0,
    },
    listCon: {
      paddingTop: getSize.h(20),
    },
    searchInput: {
      width: width - getSize.w(48) - getSize.w(80),
    },
  });

  const handleSearchAsync = async (value) => {
    setSearching(true);
    const result = await searchForLocation(value);
    setPredictions(result);
    setSearching(false);
  };

  const handleFetchAddress = async (data) => {
    setSearching(true);
    const {formatted_address, address_components} =
      await fetchAddressForLocation(data);
    const short = address_components?.find(
      (item) =>
        item.types?.includes('administrative_area_level_2') ||
        item.types?.includes('administrative_area_level_1') ||
        item.types?.includes('country'),
    );

    const routeAddress = address_components?.find((item) =>
      item.types?.includes('route'),
    );
    let subRouteAddress = null;
    if (!routeAddress) {
      const sublocality_level_3 = address_components?.find(
        (item) =>
          item.types?.includes('political') &&
          item.types?.includes('sublocality_level_3'),
      );

      const sublocality_level_2 = address_components?.find(
        (item) =>
          item.types?.includes('political') &&
          item.types?.includes('sublocality_level_2'),
      );

      const sublocality_level_1 = address_components?.find(
        (item) =>
          item.types?.includes('political') &&
          item.types?.includes('sublocality_level_1'),
      );

      //routeAddress =
      subRouteAddress = handleStringAddress(
        sublocality_level_1?.long_name,
        sublocality_level_2?.long_name,
        sublocality_level_3?.long_name,
      );
    }

    const political = address_components?.find(
      (item) =>
        item.types?.includes('administrative_area_level_1') &&
        item.types?.includes('political'),
    );
    const country = address_components?.find(
      (item) =>
        item.types?.includes('political') && item.types?.includes('country'),
    );

    setSearch(
      handleStringAddress(
        political?.long_name,
        country?.long_name,
        // subRouteAddress ? subRouteAddress : routeAddress?.long_name,
      ),
    );

    setSearching(false);
  };

  const handleStringAddress = (item_one, item_two, item_three) => {
    if (item_one && item_two && item_three) {
      return item_three + ', ' + item_one + ', ' + item_two;
    } else if (item_one && item_three) {
      return item_three + ', ' + item_one;
    } else if (item_two && item_three) {
      return item_three + ', ' + item_two;
    }

    if (item_one && item_two) {
      return item_one + ', ' + item_two;
    } else if (item_one && !!item_two) {
      return item_one;
    } else if (!!item_one && item_two) {
      return item_two;
    }
  };

  const handleSearchDebounced = debounce(handleSearchAsync, 500);
  const handleFetchAddressDebounced = debounce(handleFetchAddress, 500);

  const handleSearch = (value) => {
    setSearch(value);
    setSearchExact(value);
    handleSearchDebounced(value);
  };

  function handleClear() {
    setSearch('');
    setSearchExact('');
    setPredictions([]);
  }

  const handlePressItem = async (data, exactLocationName) => {
    setTypeSearch((prev) => (prev = 'exact'));
    setSearchExact((prev) => (prev = exactLocationName));
    setPredictions([]);
    setSearch('');
    // setSearchFocused(false);

    const detail = await fetchLocationDetail(data.place_id);
    if (!detail) {
      return;
    }

    const newRegion = {
      ...region,
      latitude: detail?.geometry?.location.lat,
      longitude: detail?.geometry?.location.lng,
    };

    if (
      data?.types?.includes('geocode') &&
      data?.types?.includes('political')
    ) {
      setSearch(data?.description);
      mapView?.current.animateToRegion(newRegion);
      return;
    }

    const locationRequest = Object.assign(
      {},
      {
        latitude: detail?.geometry?.location.lat,
        longitude: detail?.geometry?.location.lng,
      },
    );

    const result = await fetchAddressForLocation(locationRequest);

    const short = result?.address_components?.find(
      (item) =>
        item.types?.includes('administrative_area_level_2') ||
        item.types?.includes('administrative_area_level_1') ||
        item.types?.includes('country'),
    );
    const routeAddress = result?.address_components?.find((item) =>
      item.types?.includes('route'),
    );

    let subRouteAddress = null;
    if (!routeAddress) {
      const sublocality_level_3 = result?.address_components?.find(
        (item) =>
          item.types?.includes('political') &&
          item.types?.includes('sublocality_level_3'),
      );

      const sublocality_level_2 = result?.address_components?.find(
        (item) =>
          item.types?.includes('political') &&
          item.types?.includes('sublocality_level_2'),
      );

      const sublocality_level_1 = result?.address_components?.find(
        (item) =>
          item.types?.includes('political') &&
          item.types?.includes('sublocality_level_1'),
      );

      //routeAddress =
      subRouteAddress = handleStringAddress(
        sublocality_level_1?.long_name,
        sublocality_level_2?.long_name,
        sublocality_level_3?.long_name,
      );
    }

    const political = result?.address_components?.find(
      (item) =>
        item.types?.includes('administrative_area_level_1') &&
        item.types?.includes('political'),
    );
    const country = result?.address_components?.find(
      (item) =>
        item.types?.includes('political') && item.types?.includes('country'),
    );

    setSearch(
      handleStringAddress(
        political?.long_name,
        country?.long_name,
        subRouteAddress ? subRouteAddress : routeAddress?.long_name,
      ),
    );

    mapView?.current.animateToRegion(newRegion);
  };

  const handleMapRegionChangeComplete = (data) => {
    setRegion(data);
    if (searchFocused) {
      Keyboard.dismiss();
    }
    handleFetchAddressDebounced(data);
  };

  const handleSelect = () => {
    const address = typeSearch === 'normal' ? search : searchExact;
    onSelect({
      address: search,
      lat: region.latitude,
      lng: region.longitude,
      short_address: address,
    });
    navigation.goBack();
  };

  const handleSelectOnMap = (data) => {
    setTypeSearch((prev) => (prev = 'normal'));
    setSearchExact('');

    setRegion(Object.assign(data, DEFAULT_DELTA));
    mapView?.current.animateToRegion(data);
    if (searchFocused) {
      Keyboard.dismiss();
    }
    handleFetchAddressDebounced(data);
  };

  return (
    <Wrapper dismissKeyboard style={styles.wrapper}>
      <StatusBar barStyle="dark-content" />
      <MapView
        ref={mapView}
        provider={PROVIDER_GOOGLE}
        style={styles.mapWrapper}
        customMapStyle={theme.mapStyle}
        showsMyLocationButton={true}
        initialRegion={region}
        onRegionChangeComplete={handleMapRegionChangeComplete}
        autoFocus={true}
        onPanDrag={() => setTypeSearch((prev) => (prev = 'normal'))}
        onPress={(event) => {
          handleSelectOnMap(event?.nativeEvent?.coordinate);
        }}
      />

      <View style={styles.markerFixed}>
        <MaterialCommunityIcons
          style={styles.marker}
          name="map-marker"
          color={theme.colors.primary}
        />
      </View>

      <Touchable onPress={navigation.goBack} style={styles.backBtn}>
        <MaterialCommunityIcons
          name="chevron-left"
          size={getSize.f(34)}
          color={theme.colors.text}
        />
      </Touchable>

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
      <View style={styles.buttonWrap}>
        <Button
          disabled={
            searching || !search || !region?.latitude || !region?.longitude
              ? true
              : false
          }
          title="Select"
          fullWidth
          onPress={handleSelect}
        />
      </View>
      <View style={styles.searchWrap}>
        <SearchBar
          ref={searchBar}
          autoFocus={false}
          placeholder={searching ? 'Searching...' : 'Search for location'}
          value={typeSearch === 'normal' ? search : searchExact}
          onChangeText={handleSearch}
          onClear={handleClear}
          underlineColorAndroid={'transparent'}
          autoCapitalize="words"
          wrapperStyle={styles.searchBar}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          style={styles.searchInput}
        />
        <FlatList
          data={predictions}
          keyExtractor={(item) => item.place_id}
          style={[
            styles.listWrap,
            (!searchFocused || !predictions?.length) && styles.listHide,
          ]}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.listCon}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.listDivider} />}
          renderItem={({item}) => (
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.searchItem}
              onPress={() => {
                const exactLocationName = `${item.structured_formatting.main_text} - ${item.structured_formatting.secondary_text}`;

                handlePressItem(item, exactLocationName);
              }}>
              <Text numberOfLines={1}>
                {item.structured_formatting.main_text}
              </Text>
              <Text variant="caption" numberOfLines={1}>
                {item.structured_formatting.secondary_text}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </Wrapper>
  );
};

export default PickLocationPostScreen;
