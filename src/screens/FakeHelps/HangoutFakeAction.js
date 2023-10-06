import React from 'react';
import {StyleSheet, ScrollView, Image, Dimensions} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import {Touchable, Text, Loading} from 'components';
import useTheme from 'theme';
import {getSize} from 'utils/responsive';

const width = Dimensions.get('window').width;
import orangeLight from '../../theme/orangeLight';

const styles = StyleSheet.create({
  actionWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: getSize.w(5),
  },
  actionItem: {
    flexGrow: 1,
    height: getSize.h(60),
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: getSize.w(12),
  },
  actionText: {
    marginLeft: getSize.w(8),
    fontFamily: orangeLight.fonts.sfPro.medium,
    color: orangeLight.colors.tagTxt,
    fontSize: getSize.f(14),
  },
  messageItem: {
    flexGrow: 1,
    height: getSize.h(35),
    marginVertical: getSize.h(10),
    marginHorizontal: getSize.w(10),
    borderRadius: getSize.h(37 / 2),
    backgroundColor: orangeLight.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    width: width / 2 - getSize.w(70),
  },
  messageText: {
    marginLeft: getSize.w(5),
    fontFamily: orangeLight.fonts.sfPro.medium,
    color: orangeLight.colors.textContrast,
  },
  hangoutIcon: {
    width: getSize.h(18),
    height: getSize.h(18),
    resizeMode: 'contain',
  },
  offered: {
    color: orangeLight.colors.offered,
  },
  icOffered: {
    tintColor: orangeLight.colors.offered,
  },
  primary: {
    color: orangeLight.colors.primary,
  },
});

const HangoutFakeAction = ({
  showHangout,
  showHelp,
  offered,
  hangoutLoading,
  hangoutOnPress,
  helpOnPress,

  showFindNearFriend,
  onPressFindNearFriend,

  showFakeHelps,
  onPressFakeHelps,
}) => {
  const theme = useTheme();
  return (
    <ScrollView
      contentContainerStyle={styles.actionWrapper}
      horizontal={true}
      bounces={false}
      showsHorizontalScrollIndicator={false}>
      {showHangout && (
        <Touchable
          onPress={hangoutOnPress}
          disabled={hangoutLoading}
          style={styles.actionItem}>
          {hangoutLoading ? (
            <Loading dark />
          ) : (
            <Image
              source={Icons.ic_hangout}
              style={[styles.hangoutIcon, offered && styles.icOffered]}
              tintColor={offered ? theme.colors.offered : theme.colors.tagTxt}
            />
          )}
          <Text style={[styles.actionText, offered && styles.offered]}>
            Hangout
          </Text>
        </Touchable>
      )}

      {showHelp && (
        <Touchable
          onPress={helpOnPress}
          disabled={hangoutLoading}
          style={styles.actionItem}>
          {hangoutLoading ? (
            <Loading dark />
          ) : (
            <Image
              source={Icons.ic_hangout}
              style={[styles.hangoutIcon, offered && styles.icOffered]}
              tintColor={offered ? theme.colors.offered : theme.colors.tagTxt}
            />
          )}
          <Text style={[styles.actionText, offered && styles.offered]}>
            Help
          </Text>
        </Touchable>
      )}
      {showFindNearFriend && (
        <Touchable onPress={onPressFindNearFriend} style={styles.actionItem}>
          <MaterialCommunityIcons
            name="account-group-outline"
            size={getSize.f(20)}
            color={theme.colors.tagTxt}
          />
          <Text style={styles.actionText}>Find near</Text>
        </Touchable>
      )}
      {showFakeHelps && (
        <Touchable onPress={onPressFakeHelps} style={styles.actionItem}>
          <MaterialCommunityIcons
            name="account-group-outline"
            size={getSize.f(20)}
            color={theme.colors.tagTxt}
          />
          <Text style={styles.actionText}>Helps</Text>
        </Touchable>
      )}
    </ScrollView>
  );
};

export default HangoutFakeAction;
