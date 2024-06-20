import React from 'react';
import {StyleSheet, ScrollView, Image, Dimensions} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import {Touchable, Text, Loading} from 'components';
import useTheme from 'theme';
import {getSize} from 'utils/responsive';

const width = Dimensions.get('window').width;
import orangeLight from '../../theme/orangeLight';
import {View} from 'react-native';
import {Icons} from 'utils/icon';

const HangoutAction = ({
  onPressComment,
  onPressShare,

  showHangout,
  showHelp,
  offered,
  hangoutLoading,
  hangoutOnPress,
  helpOnPress,
  handlePressMessage,
  showMessage,
  onPressLike,
  liked,
  messageLoading,
  idLoadHelp,
  showFindNearFriend,
  onPressFindNearFriend,
}) => {
  const theme = useTheme();

  return (
    <>
      <ScrollView
        contentContainerStyle={styles.actionWrapper}
        horizontal={true}
        bounces={false}
        showsHorizontalScrollIndicator={false}>
        {showMessage && (
          <ActionButton
            onPress={handlePressMessage}
            text="Message"
            icon={
              <MaterialIcons
                name="edit"
                size={getSize.f(16)}
                color={theme.colors.textContrast}
              />
            }
            isLoading={messageLoading}
            textStyle={styles.messageText}
            style={styles.messageItem}
          />
        )}
        {showHangout && (
          <ActionButton
            onPress={hangoutOnPress}
            text="Hangout"
            icon={
              <Image
                source={Icons.ic_hangout}
                style={[styles.hangoutIcon, offered && styles.icOffered]}
              />
            }
            isLoading={hangoutLoading}
            textStyle={offered && styles.offered}
          />
        )}

        {showHelp && (
          <ActionButton
            onPress={helpOnPress}
            text="Help"
            icon={
              <Image
                source={Icons.ic_hangout}
                style={[styles.hangoutIcon, offered && styles.icOffered]}
              />
            }
            isLoading={hangoutLoading || idLoadHelp}
            textStyle={offered && styles.offered}
          />
        )}

        {/* {showFindNearFriend && (
          <ActionButton
            onPress={onPressFindNearFriend}
            text="Find near"
            icon={
              <MaterialCommunityIcons
                name="account-group-outline"
                size={getSize.f(20)}
                color={theme.colors.tagTxt}
              />
            }
          />
        )} */}
        <ActionButton
          onPress={onPressLike}
          text="Like"
          icon={
            <MaterialCommunityIcons
              name={liked ? 'heart' : 'heart-outline'}
              size={getSize.f(22)}
              color={liked ? theme.colors.primary : theme.colors.tagTxt}
            />
          }
          isLoading={false}
          textStyle={liked && styles.primary}
        />

        <ActionButton
          onPress={onPressComment}
          text="Comment"
          icon={
            <MaterialCommunityIcons
              name="comment-outline"
              size={getSize.f(20)}
              color={theme.colors.tagTxt}
            />
          }
        />

        {!!onPressShare && (
          <ActionButton
            onPress={onPressShare}
            text="Share"
            icon={
              <MaterialCommunityIcons
                name="share"
                size={getSize.f(20)}
                color={theme.colors.tagTxt}
              />
            }
          />
        )}
      </ScrollView>
    </>
  );
};

const ActionButton = React.memo(
  ({onPress, icon, text, isLoading, style, textStyle}) => {
    if (isLoading) {
      return (
        <View style={[styles.actionItem, style]}>
          <Loading dark />
        </View>
      );
    }

    return (
      <Touchable onPress={onPress} style={[styles.actionItem, style]}>
        <>
          {icon}
          <Text style={[styles.actionText, textStyle]}>{text}</Text>
        </>
      </Touchable>
    );
  },
);
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
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0009',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HangoutAction;
