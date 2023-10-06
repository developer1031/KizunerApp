import React from 'react';
import {View, StyleSheet} from 'react-native';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import {useSelector} from 'react-redux';

import {Text} from 'components';
import {getSize} from 'utils/responsive';
import orangeLight from '../theme/orangeLight';

const UserAddress = () => {
  //const {area} = useSelector(state => state.location);
  const {userInfo, shortLocationUser} = useSelector((state) => state.auth);
  // const [shortName, setShortName] = useState(null);

  // const processCoords = async coords => {
  //   try {
  //     const result = await fetchAddressForLocation(coords);
  //     const areaTemp = result?.address_components?.find(
  //       item =>
  //         item.types?.includes('administrative_area_level_2') ||
  //         item.types?.includes('administrative_area_level_1') ||
  //         item.types?.includes('country'),
  //     );
  //     setShortName(areaTemp.short_name);
  //   } catch (ex) {
  //     return;
  //   }
  // };

  // useEffect(() => {
  //   if (userInfo?.resident) {
  //     const location = Object.assign(userInfo?.resident, {
  //       latitude: userInfo?.resident.lat,
  //       longitude: userInfo?.resident.long,
  //     });
  //     processCoords(location);
  //   }
  // }, [userInfo?.resident]);

  if (
    userInfo?.resident?.short_address &&
    userInfo?.resident?.short_address?.length > 0
  ) {
    return (
      <View style={styles.locationWrap}>
        <SimpleLineIcons
          name="location-pin"
          color={orangeLight.colors.tagTxt}
          size={getSize.f(17)}
        />
        <Text numberOfLines={2} style={styles.locationTxt}>
          {userInfo?.resident?.short_address}
        </Text>
      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  locationWrap: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: getSize.h(5),
    alignItems: 'center',
  },
  locationTxt: {
    marginLeft: getSize.w(5),
    marginHorizontal: 5,
  },
});

export default UserAddress;
