import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useDispatch} from 'react-redux';
import openMap from 'react-native-open-maps';
import {IconButton} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import useTheme from 'theme';
import pinky from '../theme/pinkLight';
import {Touchable, Text, AvatarBot} from 'components';
import {getSize} from 'utils/responsive';
import {showModalize, hideModalize} from 'actions';
import {GENDERS} from 'utils/constants';

const CastItem = ({data, openChat}) => {
  const dispatch = useDispatch();
  if (!data) {
    return null;
  }

  function handleOpenMap() {
    openMap({
      latitude: parseFloat(data?.lat),
      longitude: parseFloat(data?.lng),
      end: data?.address,
      query: data?.name,
      provider: 'google',
    });
  }

  const showOptions = () => {
    dispatch(
      showModalize([
        {
          label: 'Open map',
          icon: (
            <MaterialCommunityIcons
              size={getSize.f(20)}
              color={pinky.colors.primary}
              name="routes"
            />
          ),
          onPress: () => {
            dispatch(hideModalize());
            handleOpenMap();
          },
        },
        {
          label: 'Open chat',
          icon: (
            <MaterialCommunityIcons
              size={getSize.f(20)}
              color={pinky.colors.primary}
              name="chat"
            />
          ),
          onPress: () => {
            dispatch(hideModalize());
            openChat && openChat(data);
          },
        },
      ]),
    );
  };

  const distanceFix =
    Math.round((data?.distance + Number.EPSILON) * 100) / 100 ?? 0;
  return (
    <Touchable style={styles.wrapper}>
      <AvatarBot source={{uri: data?.avatar}} gray noShadow size="medium" />
      <View style={styles.container}>
        <Text style={styles.date}>{data?.name}</Text>
        {GENDERS.find((i) => i.value === data.gender)?.label && (
          <Text style={styles.address}>
            {GENDERS.find((i) => i.value === data.gender)?.label}
          </Text>
        )}
        <Text style={styles.address}>
          Distance: {distanceFix} {'km'}
        </Text>
      </View>
      <IconButton
        icon="dots-horizontal"
        style={styles.moreBtn}
        onPress={showOptions}
        size={getSize.f(20)}
      />
    </Touchable>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: getSize.w(24),
    height: getSize.h(120),
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: pinky.colors.divider,
  },
  notiIconWrap: {
    width: getSize.h(24),
    height: getSize.h(24),
    borderRadius: getSize.h(24 / 2),
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    right: -getSize.w(5),
  },
  notiIcon: {
    width: getSize.h(12),
    height: getSize.h(12),
  },
  container: {
    marginLeft: getSize.w(15),
    flex: 1,
    flexGrow: 1,
  },
  date: {
    fontSize: getSize.f(12),
    fontFamily: pinky.fonts.sfPro.semiBold,
    color: pinky.colors.tagTxt,
  },
  moreBtn: {
    right: -getSize.w(10),
    top: -getSize.h(20),
  },
  address: {
    fontSize: getSize.f(12),
    color: pinky.colors.text2,
  },
});

export default CastItem;
