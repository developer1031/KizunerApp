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

const PickLocationDistrictScreen = ({navigation, route}) => {
  const mapView = useRef(null);
  const searchBar = useRef(null);
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const userCoords = useSelector((state) => state.location.coords);
  const {onSelect, location} = route.params;
  const [search, setSearch] = useState('');
  const [predictions, setPredictions] = useState([]);
  const [searching, setSearching] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const DEFAULT_DELTA = {
    latitudeDelta: 0.075,
    longitudeDelta: 0.0605,
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
    const {formatted_address} = await fetchAddressForLocation(data);
    formatted_address && setSearch(formatted_address);
    setSearching(false);
  };

  const handleSearchDebounced = debounce(handleSearchAsync, 500);
  const handleFetchAddressDebounced = debounce(handleFetchAddress, 500);

  const handleSearch = (value) => {
    setSearch(value);
    handleSearchDebounced(value);
  };

  function handleClear() {
    setSearch('');
    setPredictions([]);
  }

  const handlePressItem = async (data) => {
    const detail = await fetchLocationDetail(data.place_id);
    if (detail) {
      const newRegion = {
        ...region,
        latitude: detail?.geometry?.location.lat,
        longitude: detail?.geometry?.location.lng,
      };
      setRegion(newRegion);
      setSearch(data.description);
      mapView?.current.animateToRegion(newRegion);
    }
  };

  const handleMapRegionChangeComplete = (data) => {
    setRegion(data);
    if (searchFocused) {
      Keyboard.dismiss();
    }
    handleFetchAddressDebounced(data);
  };

  const handleSelect = () => {
    onSelect({
      address: search,
      lat: region.latitude,
      lng: region.longitude,
    });
    navigation.goBack();
  };

  return (
    <Wrapper dismissKeyboard style={styles.wrapper}>
      <StatusBar barStyle="dark-content" />
      <MapView
        ref={mapView}
        provider={PROVIDER_GOOGLE}
        style={styles.mapWrapper}
        customMapStyle={theme.mapStyle}
        showsMyLocationButton={false}
        initialRegion={region}
        onRegionChangeComplete={handleMapRegionChangeComplete}
        autoFocus={false}
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
          value={search}
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
          keyExtractor={(item) => item.id}
          style={[
            styles.listWrap,
            (!searchFocused || !predictions?.length) && styles.listHide,
          ]}
          contentContainerStyle={styles.listCon}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.listDivider} />}
          renderItem={({item}) => (
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.searchItem}
              onPress={() => handlePressItem(item)}>
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

export default PickLocationDistrictScreen;
