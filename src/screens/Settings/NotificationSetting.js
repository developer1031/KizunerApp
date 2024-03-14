import React, {useEffect} from 'react';
import {StyleSheet, ScrollView, View, Switch} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';

import useTheme from 'theme';
import {getSize} from 'utils/responsive';
import {Wrapper, Touchable, Text, HeaderBg} from 'components';
import {
  getNotiSetting,
  updateHangoutHelpNoti,
  updateMessageNoti,
  updateFollowNoti,
  updateCommentNoti,
  updateLikeNoti,
} from 'actions';

const NotificationSetting = ({navigation}) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const {
    beingGetNotiSetting,
    beingUpdateSetting,
    hangout_help_notification,
    message_notification,
    follow_notification,
    comment_notification,
    like_notification,
  } = useSelector((state) => state.notification);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    dispatch(getNotiSetting());
  }, []);

  const HEADER_HEIGHT = insets.top + 68;
  const styles = StyleSheet.create({
    wrapper: {flex: 1},
    scrollWrap: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      left: 0,
      top: getSize.h(HEADER_HEIGHT),
    },
    menuItemWrap: {},
    menuItemContainer: {
      paddingHorizontal: getSize.h(24),
      borderBottomColor: theme.colors.divider,
      borderBottomWidth: getSize.h(1),
      height: getSize.h(64),
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    menuItemWrapLabel: {
      fontSize: getSize.f(15),
      color: theme.colors.tagTxt,
      fontFamily: theme.fonts.sfPro.medium,
    },
    menuItemLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    menuItemIcon: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: getSize.w(19),
      width: getSize.w(24),
    },
    backBtn: {
      position: 'absolute',
      top: insets.top + getSize.h(20),
      left: getSize.w(24),
      zIndex: 1,
    },
    headerTitle: {
      top: insets.top + getSize.h(26),
      textAlign: 'center',
    },
  });

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
        Notification Settings
      </Text>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollWrap}>
        <View key={'HangoutHelp'} style={styles.menuItemWrap}>
          <View style={styles.menuItemContainer}>
            <View style={styles.menuItemLeft}>
              <View style={styles.menuItemIcon}>
                <MaterialCommunityIcons
                  name="bell"
                  size={getSize.f(22)}
                  color={theme.colors.primary}
                />
              </View>
              <Text style={styles.menuItemWrapLabel}>
                On/ Off Hangout, Help
              </Text>
            </View>

            <Switch
              trackColor={{
                false: theme.colors.disabled,
                true: theme.colors.secondary,
              }}
              thumbColor={theme.colors.paper}
              ios_backgroundColor={theme.colors.disabled}
              onValueChange={() =>
                dispatch(
                  updateHangoutHelpNoti({
                    hangout_help_notification: !hangout_help_notification,
                  }),
                )
              }
              value={hangout_help_notification}
              disabled={
                beingGetNotiSetting || beingUpdateSetting ? true : false
              }
            />
          </View>
        </View>

        <View key={'Message'} style={styles.menuItemWrap}>
          <View style={styles.menuItemContainer}>
            <View style={styles.menuItemLeft}>
              <View style={styles.menuItemIcon}>
                <MaterialCommunityIcons
                  name="bell"
                  size={getSize.f(22)}
                  color={theme.colors.primary}
                />
              </View>
              <Text style={styles.menuItemWrapLabel}>On/ Off Message</Text>
            </View>

            <Switch
              trackColor={{
                false: theme.colors.disabled,
                true: theme.colors.secondary,
              }}
              thumbColor={theme.colors.paper}
              ios_backgroundColor={theme.colors.disabled}
              onValueChange={() =>
                dispatch(
                  updateMessageNoti({
                    message_notification: !message_notification,
                  }),
                )
              }
              value={message_notification}
              disabled={
                beingGetNotiSetting || beingUpdateSetting ? true : false
              }
            />
          </View>
        </View>

        <View key={'Comment'} style={styles.menuItemWrap}>
          <View style={styles.menuItemContainer}>
            <View style={styles.menuItemLeft}>
              <View style={styles.menuItemIcon}>
                <MaterialCommunityIcons
                  name="bell"
                  size={getSize.f(22)}
                  color={theme.colors.primary}
                />
              </View>
              <Text style={styles.menuItemWrapLabel}>On/ Off Comment</Text>
            </View>

            <Switch
              trackColor={{
                false: theme.colors.disabled,
                true: theme.colors.secondary,
              }}
              thumbColor={theme.colors.paper}
              ios_backgroundColor={theme.colors.disabled}
              onValueChange={() =>
                dispatch(
                  updateCommentNoti({
                    comment_notification: !comment_notification,
                  }),
                )
              }
              value={comment_notification}
              disabled={
                beingGetNotiSetting || beingUpdateSetting ? true : false
              }
            />
          </View>
        </View>

        <View key={'Follow'} style={styles.menuItemWrap}>
          <View style={styles.menuItemContainer}>
            <View style={styles.menuItemLeft}>
              <View style={styles.menuItemIcon}>
                <MaterialCommunityIcons
                  name="bell"
                  size={getSize.f(22)}
                  color={theme.colors.primary}
                />
              </View>
              <Text style={styles.menuItemWrapLabel}>On/ Off Follow</Text>
            </View>

            <Switch
              trackColor={{
                false: theme.colors.disabled,
                true: theme.colors.secondary,
              }}
              thumbColor={theme.colors.paper}
              ios_backgroundColor={theme.colors.disabled}
              onValueChange={() =>
                dispatch(
                  updateFollowNoti({
                    follow_notification: !follow_notification,
                  }),
                )
              }
              value={follow_notification}
              disabled={
                beingGetNotiSetting || beingUpdateSetting ? true : false
              }
            />
          </View>
        </View>

        <View key={'Like'} style={styles.menuItemWrap}>
          <View style={styles.menuItemContainer}>
            <View style={styles.menuItemLeft}>
              <View style={styles.menuItemIcon}>
                <MaterialCommunityIcons
                  name="bell"
                  size={getSize.f(22)}
                  color={theme.colors.primary}
                />
              </View>
              <Text style={styles.menuItemWrapLabel}>On/ Off Like</Text>
            </View>

            <Switch
              trackColor={{
                false: theme.colors.disabled,
                true: theme.colors.secondary,
              }}
              thumbColor={theme.colors.paper}
              ios_backgroundColor={theme.colors.disabled}
              onValueChange={() =>
                dispatch(
                  updateLikeNoti({
                    like_notification: !like_notification,
                  }),
                )
              }
              value={like_notification}
              disabled={
                beingGetNotiSetting || beingUpdateSetting ? true : false
              }
            />
          </View>
        </View>
      </ScrollView>
    </Wrapper>
  );
};

export default NotificationSetting;
