import {useEffect, useState} from 'react';
import {PermissionsAndroid, Platform, ToastAndroid} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {useDispatch, useSelector} from 'react-redux';
import axios from 'axios';

import {
  AUTOCOMPLETE_URL,
  REVRSE_GEO_CODE_URL,
  GOOGLE_API_KEY,
  PLACE_DETAIL_URL,
  TIMEZONE_API_URL,
} from 'utils/constants';
import {
  updateLocationRequest,
  updateLocationSuccess,
  updateLocationFailure,
  updateAddressRequest,
  updateAddressFailure,
  updateAddressSuccess,
  updateUserLocation,
} from 'actions';

export const useWatchLocation = () => {
  const dispatch = useDispatch();
  const location = useSelector((state) => state.location);
  const userLocation = useSelector((state) => state.auth.userInfo?.location);

  const hasLocationPermission = async () => {
    if (
      Platform.OS === 'ios' ||
      (Platform.OS === 'android' && Platform.Version < 23)
    ) {
      return true;
    }

    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    if (hasPermission) {
      return true;
    }

    const status = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    if (status === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    }

    if (status === PermissionsAndroid.RESULTS.DENIED) {
      ToastAndroid.show(
        'Location permission denied by user.',
        ToastAndroid.LONG,
      );
    } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      ToastAndroid.show(
        'Location permission revoked by user.',
        ToastAndroid.LONG,
      );
    }

    return false;
  };

  const getLocationUpdates = async () => {
    if (!(await hasLocationPermission())) {
      return;
    }

    dispatch(updateLocationRequest());

    return Geolocation.watchPosition(
      (position) => {
        dispatch(updateLocationSuccess(position));
      },
      (error) => {
        dispatch(updateLocationFailure(error));
      },
      {
        enableHighAccuracy: true,
        //enableHighAccuracy: false,
        distanceFilter: 0,
        interval: 50000,
        fastestInterval: 25000,
      },
    );
  };

  useEffect(() => {
    const watchId = getLocationUpdates();
    return () => {
      if (watchId) {
        Geolocation.clearWatch(watchId);
      }
    };
  }, []);

  const processCoords = async (coords) => {
    if (!(await hasLocationPermission())) {
      return;
    }

    dispatch(updateAddressRequest());
    try {
      const result = await fetchAddressForLocation(coords);

      const area = result?.address_components?.find(
        (item) =>
          item.types?.includes('administrative_area_level_2') ||
          item.types?.includes('administrative_area_level_1') ||
          item.types?.includes('country'),
      );
      if (location.area !== area?.short_name) {
        dispatch(
          updateAddressSuccess({
            area: area?.short_name,
            address: result.formatted_address,
          }),
        );
      }
    } catch (error) {
      dispatch(updateAddressFailure(error));
    }
  };

  useEffect(() => {
    processCoords(location.coords);
  }, [location.coords]);

  useEffect(() => {
    // Track user area changes for update
    if (userLocation?.address !== location.area) {
      dispatch(
        updateUserLocation({
          address: location.area,
          lat: location?.coords?.latitude?.toFixed(3),
          lng: location?.coords?.longitude?.toFixed(3),
        }),
      );
    }
  }, [location.area]);

  return location;
};

export function generateRandomPoint(center, radius) {
  const x0 = center.longitude;
  const y0 = center.latitude;

  const rd = radius / 111300;

  const u = Math.random();
  const v = Math.random();

  const w = rd * Math.sqrt(u);
  const t = 2 * Math.PI * v;
  const x = w * Math.cos(t);
  const y = w * Math.sin(t);

  const xp = x / Math.cos(y0);

  return {latitude: y + y0, longitude: xp + x0};
}

let call;
const once = (config = {}) => {
  if (call) {
    call.cancel('only one request allowed at a time');
  }
  call = axios.CancelToken.source();

  config.cancelToken = call.token;
  return axios(config);
};

export const fetchAddressForLocation = async (location) => {
  try {
    const {latitude, longitude} = location;
    const {data} = await once({
      url: `${REVRSE_GEO_CODE_URL}?key=${GOOGLE_API_KEY}&latlng=${latitude},${longitude}`,
    });
    const {results} = data;
    if (results.length > 0) {
      return results[0];
    }
    return {};
  } catch (error) {
    return {};
  }
};

export const searchForLocation = async (text) => {
  try {
    if (text.length >= 3) {
      const {data} = await once({
        url: AUTOCOMPLETE_URL,
        params: {
          input: text,
          key: GOOGLE_API_KEY,
          language: 'en',
        },
      });
      return data?.predictions;
    } else {
      return [];
    }
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const fetchLocationDetail = async (placeId) => {
  const {data} = await axios.get(
    `${PLACE_DETAIL_URL}?key=${GOOGLE_API_KEY}&place_id=${placeId}&fields=geometry`,
  );
  return data?.result || null;
};

export const getTimezone = async ({latitude, longitude, timestamp}) => {
  const {data} = await axios.get(
    `${TIMEZONE_API_URL}?location=${latitude},${longitude}&timestamp=${timestamp}&key=${GOOGLE_API_KEY}`,
  );
  return data;
};

export function useGetTimezone(latitude, longitude, timestamp) {
  const [timezone, setTimezone] = useState(null);
  const [loaded, setLoaded] = useState(false);

  async function fetchTimezone() {
    if (!latitude || !longitude || !timestamp) {
      return;
    }
    try {
      const {timeZoneId} = await getTimezone({latitude, longitude, timestamp});
      setTimezone(timeZoneId);
      setLoaded(true);
    } catch (error) {
      setLoaded(true);
    }
  }

  useEffect(() => {
    fetchTimezone();
  }, [latitude, longitude, timestamp]);

  useEffect(() => {
    return function cleanup() {};
  });

  return {timezone, loaded};
}
