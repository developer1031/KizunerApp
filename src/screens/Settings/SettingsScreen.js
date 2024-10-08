import React, {useEffect} from 'react';
import {StyleSheet, ScrollView, View, Switch} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';

import useTheme from 'theme';
import {getSize} from 'utils/responsive';
import {Wrapper, Touchable, Text, HeaderBg} from 'components';
import {updateNotiSetting, getNotiSetting, updateEmailSetting} from 'actions';

const SettingsScreen = ({navigation}) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const {
    allow,
    allowEmail,
    beingGetNotiSetting,
    beingUpdateSetting,
    beingUpdateEmailSetting,
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
        Settings
      </Text>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollWrap}>
        <Touchable
          onPress={() => navigation.navigate('NotificationSetting')}
          key={'toggleNotification'}
          style={styles.menuItemWrap}>
          <View style={styles.menuItemContainer}>
            <View style={styles.menuItemLeft}>
              <View style={styles.menuItemIcon}>
                <MaterialCommunityIcons
                  name="bell"
                  size={getSize.f(20)}
                  color={theme.colors.primary}
                />
              </View>
              <Text style={styles.menuItemWrapLabel}>Notification Setting</Text>
            </View>
          </View>
        </Touchable>
        <Touchable
          onPress={() => navigation.navigate('EmailSetting')}
          key={'toggleReceiveEmail'}
          style={styles.menuItemWrap}>
          <View style={styles.menuItemContainer}>
            <View style={styles.menuItemLeft}>
              <View style={styles.menuItemIcon}>
                <MaterialCommunityIcons
                  name="bell"
                  size={getSize.f(20)}
                  color={theme.colors.primary}
                />
              </View>
              <Text style={styles.menuItemWrapLabel}>Email Setting</Text>
            </View>
          </View>
        </Touchable>
        <Touchable
          onPress={() => navigation.navigate('BlockList')}
          key={'blockList'}
          style={styles.menuItemWrap}>
          <View style={styles.menuItemContainer}>
            <View style={styles.menuItemLeft}>
              <View style={styles.menuItemIcon}>
                <MaterialCommunityIcons
                  name="block-helper"
                  size={getSize.f(20)}
                  color={theme.colors.primary}
                />
              </View>
              <Text style={styles.menuItemWrapLabel}>Block List</Text>
            </View>
          </View>
        </Touchable>
        <Touchable
          onPress={() => navigation.navigate('MyDetails')}
          key={'myDetails'}
          style={styles.menuItemWrap}>
          <View style={styles.menuItemContainer}>
            <View style={styles.menuItemLeft}>
              <View style={styles.menuItemIcon}>
                <MaterialCommunityIcons
                  name="account"
                  size={getSize.f(22)}
                  color={theme.colors.primary}
                />
              </View>
              <Text style={styles.menuItemWrapLabel}>My Details</Text>
            </View>
          </View>
        </Touchable>

        <Touchable
          onPress={() => navigation.navigate('ChangePassword')}
          key={'changePass'}
          style={styles.menuItemWrap}>
          <View style={styles.menuItemContainer}>
            <View style={styles.menuItemLeft}>
              <View style={styles.menuItemIcon}>
                <MaterialCommunityIcons
                  name="lock"
                  size={getSize.f(22)}
                  color={theme.colors.primary}
                />
              </View>
              <Text style={styles.menuItemWrapLabel}>Change Password</Text>
            </View>
          </View>
        </Touchable>
      </ScrollView>
    </Wrapper>
  );
};

export default SettingsScreen;
