import React, {useEffect, useRef} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import openMap from 'react-native-open-maps';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment-timezone';

import {Text} from 'components';
import {getSize} from 'utils/responsive';
import useTheme from 'theme';
import {hangoutRangeFormat} from 'utils/datetime';
import {useGetTimezone} from 'utils/geolocationService';

import orangeLight from '../../theme/orangeLight';

const defaultFormat = 'LLL'; // 'DD/MM/YYYY hh:mm A'

const HangoutCalendar = ({title, location, schedule, start, end, isNoTime}) => {
  const theme = useTheme();
  // const {timezone, loaded} = useGetTimezone(
  //   location?.lat,
  //   location?.lng,
  //   moment(start).unix(),
  // );

  const isMounted = useRef(true); // Initial value isMounted = true

  useEffect(() => {
    return () => {
      // ComponentWillUnmount in Class Component
      isMounted.current = false;
    };
  }, []);

  function handleOpenMap() {
    openMap({
      latitude: parseFloat(location?.lat),
      longitude: parseFloat(location?.lng),
      end: location?.address,
      query: title,
      provider: 'google',
    });
  }

  // if (location?.address && !start) {
  //   return (
  //     <View style={stylesMain.metaWrap}>
  //       <View style={stylesMain.metaRight}>
  //         <TouchableOpacity onPress={handleOpenMap}>
  //           <Text style={stylesMain.locationNoTime}>
  //             {location?.short_address && location?.short_address?.length > 0
  //               ? location?.short_address
  //               : location?.address}
  //           </Text>
  //         </TouchableOpacity>
  //       </View>
  //     </View>
  //   );
  // }

  if (!location?.address && !schedule && !start) {
    return null;
  }

  // const isSameTimezone =
  //   !schedule &&
  //   timezone &&
  //   moment.tz().format('z') ===
  //     moment(start)
  //       .tz(timezone)
  //       .format('z');

  function onShowDate() {
    if (start) {
      return `${moment(start).format(defaultFormat)} - ${moment(end).format(
        defaultFormat,
      )}`;
    }
    return '';
  }

  function onShowDateEnd() {
    if (end) {
      return ` - End: ${moment(end).format(defaultFormat)}`;
    }
    return '';
  }
  return (
    <View style={stylesMain.metaWrap}>
      {/* <TouchableOpacity scalable style={stylesMain.metaLeft}>
        <MaterialCommunityIcons
          name='calendar'
          color={theme.colors.primary}
          size={getSize.f(24)}
        />
        {!schedule && timezone && !isSameTimezone && (
          <Text style={styles.timezoneTxt}>
            {moment(start)
              .tz(timezone)
              .format('z')}
          </Text>
        )}
      </TouchableOpacity> */}
      <View style={stylesMain.metaRight}>
        {Boolean(schedule || start || end) && (
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <MaterialCommunityIcons
              name="calendar"
              color={theme.colors.primary}
              size={getSize.f(24)}
              style={{marginRight: 10}}
            />
            <Text
              style={[
                isNoTime
                  ? stylesMain.scheduleTimeNoTime
                  : stylesMain.scheduleTime,
                {flex: 1},
              ]}>
              {schedule ? schedule + onShowDateEnd() : onShowDate()}
            </Text>
          </View>
        )}
        {!!location?.address && (
          <TouchableOpacity onPress={handleOpenMap}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <MaterialIcons
                name="location-on"
                color={theme.colors.primary}
                size={getSize.f(24)}
                style={{marginRight: 10}}
              />
              <Text
                style={[
                  isNoTime ? stylesMain.locationNoTime : stylesMain.location,
                  {flex: 1},
                ]}>
                {location?.short_address && location?.short_address?.length > 0
                  ? location?.short_address
                  : location?.address}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const stylesMain = StyleSheet.create({
  metaWrap: {
    marginHorizontal: getSize.w(24),
    flexDirection: 'row',
    marginTop: getSize.h(20),
    marginBottom: getSize.h(10),
  },
  metaRight: {
    width: '100%',
  },
  scheduleTime: {
    color: orangeLight.colors.primary,
    fontFamily: orangeLight.fonts.sfPro.semiBold,
    fontSize: getSize.f(15),
  },
  scheduleTimeNoTime: {
    color: orangeLight.colors.disabled,
    fontFamily: orangeLight.fonts.sfPro.semiBold,
    fontSize: getSize.f(15),
  },
  location: {
    color: orangeLight.colors.tagTx,
    fontFamily: orangeLight.fonts.sfPro.medium,
    marginTop: getSize.h(5),
    fontSize: getSize.f(15),
  },
  locationNoTime: {
    color: orangeLight.colors.disabled,
    fontFamily: orangeLight.fonts.sfPro.medium,
    marginTop: getSize.h(5),
    fontSize: getSize.f(15),
  },
  timezoneTxt: {
    color: orangeLight.colors.primary,
    fontFamily: orangeLight.fonts.sfPro.semiBold,
    fontSize: getSize.f(12),
  },
  timezoneTxtNoTime: {
    color: orangeLight.colors.disabled,
    fontFamily: orangeLight.fonts.sfPro.semiBold,
    fontSize: getSize.f(12),
  },
  metaLeft: {
    alignItems: 'center',
  },
});

export default HangoutCalendar;
