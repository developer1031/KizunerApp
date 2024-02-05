import React, {useRef, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  StyleSheet,
  View,
  Image,
  ScrollView,
  Dimensions,
  Linking,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useScrollToTop} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {
  Wrapper,
  Header,
  Paper,
  Avatar,
  Text,
  Rating,
  Touchable,
  UserRelation,
  PointList,
} from 'components';
import {
  getRewardSetting,
  logout,
  showAlert,
  toggleIsFirstLaunch,
} from 'actions';
import useTheme from 'theme';
import {getSize} from 'utils/responsive';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {CONTACT_US} from 'utils/constants';
import {icBadges} from 'utils/icBadge';

const width = Dimensions.get('window').width;

const ManageScreen = ({navigation}) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const notification = useSelector((state) => state.notification);
  const currentWallet = useSelector((state) => state.wallet.current);
  const {rewardList} = useSelector((state) => state.app);
  const {isShowModalTrophy} = useSelector((state) => state.alert);
  const listRef = useRef(null);
  const [max, setMax] = useState(10);
  const [min, setMin] = useState(0);
  const [description, setDescription] = useState('');
  const [nameBadge, setNameBadge] = useState('');
  const [percentMax, setPercentMax] = useState(1);
  const [currentPercent, setCurrentPercent] = useState(0);
  const insets = useSafeAreaInsets();

  useScrollToTop(listRef);

  const userInfo = auth.userInfo;

  const HEADER_HEIGHT = getSize.h(120) + insets.top;

  const handleLogout = () => {
    dispatch(toggleIsFirstLaunch(false));
    dispatch(logout());
  };

  useEffect(() => {
    dispatch(getRewardSetting());
    handleCheckListBadge();
  }, []);

  useEffect(() => {
    handleCheckListBadge();
  }, [userInfo]);

  const gotoContactUs = async () => {
    try {
      const supported = await Linking.canOpenURL(CONTACT_US);
      if (supported) {
        await Linking.openURL(CONTACT_US);
      } else {
        showAlert(`Don't know how to open this URL: ${CONTACT_US}`);
      }
    } catch (e) {}
  };

  const styles = StyleSheet.create({
    wrapper: {
      flex: 1,
    },
    header: {
      zIndex: -1,
    },
    scrollWrap: {
      ...StyleSheet.absoluteFillObject,
      zIndex: -13,
    },
    scrollContainer: {
      paddingBottom: getSize.h(6),
    },
    userWrap: {
      top: getSize.h(21),
      marginHorizontal: getSize.w(24),
    },
    userCont: {
      height: getSize.h(109),
      paddingHorizontal: getSize.w(24),
      alignItems: 'center',
      flexDirection: 'row',
    },
    userMeta: {
      marginLeft: getSize.w(16),
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
    },
    userName: {
      fontSize: getSize.f(18),
      fontFamily: theme.fonts.sfPro.semiBold,
      width: width - getSize.w(48 + 48 + 68 + 10),
    },
    ratingWrap: {
      marginTop: getSize.h(4),
    },
    kizunaCoin: {
      marginTop: getSize.h(5),
      flexDirection: 'row',
      alignItems: 'center',
    },
    coinIcon: {
      width: getSize.h(20),
      height: getSize.h(20),
      resizeMode: 'contain',
      marginRight: getSize.w(8),
    },
    kizunaPoint: {
      fontSize: getSize.f(15),
      fontFamily: theme.fonts.sfPro.semiBold,
      color: theme.colors.secondary,
    },
    textUserId: {
      fontSize: getSize.f(15),
      fontFamily: theme.fonts.sfPro.semiBold,
      color: theme.colors.secondary,
      marginTop: 5,
    },
    logoutBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      zIndex: 10,
    },
    logoutText: {
      fontSize: getSize.f(16),
      color: theme.colors.textContrast,
      marginLeft: getSize.w(6),
    },
    statisticWrap: {
      height: HEADER_HEIGHT + getSize.h(152),
      justifyContent: 'flex-end',
      paddingBottom: getSize.h(25),
      marginBottom: getSize.h(5),
    },
    statisticRank: {
      //  height: getSize.h(144),
      marginVertical: getSize.h(10),
      marginHorizontal: getSize.h(15),
      borderRadius: getSize.h(10),
      paddingVertical: getSize.h(12),
    },
    statisticContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: getSize.w(10),
    },
    statisticItem: {
      flexGrow: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    statisticDivider: {
      backgroundColor: theme.colors.divider,
      width: getSize.w(1),
      height: getSize.h(48),
    },
    statisticValue: {
      fontFamily: theme.fonts.sfPro.bold,
      fontSize: getSize.f(18),
      textAlign: 'center',
    },
    statisticLabel: {
      fontSize: getSize.f(12),
      fontFamily: theme.fonts.sfPro.medium,
      textAlign: 'center',
      marginTop: getSize.h(3),
      color: theme.colors.tagTxt,
      textTransform: 'uppercase',
    },
    primary: {
      color: theme.colors.primary,
    },
    menuItemWrap: {
      paddingHorizontal: getSize.h(24),
    },
    menuItemContainer: {
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
    aboutIcon: {
      width: getSize.h(19),
      height: getSize.h(19),
      resizeMode: 'contain',
    },
    badgeIcon: {
      width: getSize.w(64),
      height: getSize.h(64),
    },
    contextRank: {
      paddingHorizontal: getSize.w(12),
      marginBottom: getSize.h(8),
      alignItems: 'center',
      justifyContent: 'center',
    },
    contextDes: {
      paddingHorizontal: getSize.w(20),
    },
    contextPointDes: {
      fontSize: getSize.f(14),
      fontWeight: '400',
      color: theme.colors.tagTxt,
    },
    contextNameDes: {
      marginVertical: getSize.w(8),
      fontSize: getSize.f(15),
      color: theme.colors.tagTxt,
      fontFamily: theme.fonts.sfPro.medium,
    },
  });

  function printDebug() {
    dispatch(
      showAlert({title: 'Debug mode', body: 'Log printed', type: 'info'}),
    );
  }

  const MENU_ITEMS = [
    // {
    //   icon: (
    //     <MaterialCommunityIcons
    //       name='trophy'
    //       color={theme.colors.primary}
    //       size={getSize.f(22)}
    //     />
    //   ),
    //   label: 'Leaderboard',
    //   onPress: () => navigation.push('LeaderBoard'),
    // },
    {
      icon: (
        <MaterialCommunityIcons
          name="clipboard-check"
          color={theme.colors.primary}
          size={getSize.f(22)}
        />
      ),
      label: 'Cast Management',
      onPress: () => navigation.navigate('CastManagement'),
    },
    {
      icon: (
        <MaterialCommunityIcons
          name="clipboard-check"
          color={theme.colors.primary}
          size={getSize.f(22)}
        />
      ),
      label: 'Guest Management',
      onPress: () => navigation.navigate('GuestManagement'),
    },
    {
      icon: (
        <MaterialCommunityIcons
          name="clipboard-check"
          color={theme.colors.primary}
          size={getSize.f(22)}
        />
      ),
      label: 'Requester Management',
      onPress: () => navigation.navigate('CastHelpManagement'),
    },
    {
      icon: (
        <MaterialCommunityIcons
          name="clipboard-check"
          color={theme.colors.primary}
          size={getSize.f(22)}
        />
      ),
      label: 'Helper Management',
      onPress: () => navigation.navigate('GuestHelpManagement'),
    },
    // {
    //   icon: (
    //     <MaterialCommunityIcons
    //       name='wallet'
    //       color={theme.colors.primary}
    //       size={getSize.f(22)}
    //     />
    //   ),
    //   label: 'Kizuner Wallet',
    //   onPress: () => navigation.navigate('MyWallet'),
    // },
    {
      icon: (
        <MaterialCommunityIcons
          name="wallet"
          color={theme.colors.primary}
          size={getSize.f(22)}
        />
      ),
      label: 'Wallet',
      onPress: () => navigation.navigate('Wallet'),
    },
    {
      icon: (
        <MaterialCommunityIcons
          name="bell"
          color={theme.colors.primary}
          size={getSize.f(22)}
        />
      ),
      label: 'Notifications',
      onPress: () => navigation.navigate('Notification'),
    },
    {
      icon: (
        <MaterialIcons
          name="person-add"
          color={theme.colors.primary}
          size={getSize.f(22)}
        />
      ),
      label: 'Invite through contact list',
      onPress: () => navigation.navigate('ShareAppWithFriend'),
    },
    {
      icon: (
        <MaterialCommunityIcons
          name="settings"
          color={theme.colors.primary}
          size={getSize.f(22)}
        />
      ),
      label: 'Settings',
      onPress: () => navigation.navigate('Settings'),
      onLongPress: () => __DEV__ && printDebug(),
    },
    {
      icon: (
        <Image
          source={require('../../assets/images/ic-about.png')}
          style={styles.aboutIcon}
          tintColor={theme.colors.primary}
        />
      ),
      label: 'About',
      onPress: () => navigation.navigate('About'),
    },
    {
      icon: (
        <MaterialCommunityIcons
          name="help-circle"
          color={theme.colors.primary}
          size={getSize.f(22)}
        />
      ),
      label: 'FAQ & Helps',
      onPress: () => navigation.navigate('FAQ'),
    },
    {
      icon: (
        <MaterialCommunityIcons
          name="information-outline"
          color={theme.colors.primary}
          size={getSize.f(22)}
        />
      ),
      label: 'Terms & Conditions',
      onPress: () => navigation.navigate('Terms'),
    },
    {
      icon: (
        <MaterialCommunityIcons
          name="script-text-outline"
          color={theme.colors.primary}
          size={getSize.f(22)}
        />
      ),
      label: 'Privacy Policy',
      onPress: () => navigation.navigate('PrivacyPolicy'),
    },
    {
      icon: (
        <MaterialIcons
          name="contact-mail"
          color={theme.colors.primary}
          size={getSize.f(22)}
        />
      ),
      label: 'Support',
      onPress: () => navigation.navigate('Support'), //gotoContactUs(),
    },
  ];
  const handleCheckListBadge = () => {
    if (
      rewardList &&
      rewardList[0] &&
      rewardList[1] &&
      rewardList[2] &&
      rewardList[3] &&
      rewardList[4]
    ) {
      switch (userInfo?.badge) {
        case 0:
          setNameBadge('No rank');
          setMin(1);
          setMax(rewardList[0] && rewardList[0]?.badge_01?.point);
          setCurrentPercent(userInfo?.point / rewardList[0]?.badge_01?.point);
          return;
        case 1:
          setNameBadge(rewardList[0]?.badge_01?.name);
          setMin(rewardList[0] && rewardList[0]?.badge_01?.point);
          setMax(rewardList[1] && rewardList[1]?.badge_02?.point);
          setCurrentPercent(userInfo?.point / rewardList[1]?.badge_02?.point);
          return;
        case 2:
          setNameBadge(rewardList[1]?.badge_02?.name);
          setMin(rewardList[1]?.badge_02?.point);
          setMax(rewardList[2]?.badge_03?.point);
          setCurrentPercent(userInfo?.point / rewardList[2]?.badge_03?.point);
          return;
        case 3:
          setNameBadge(rewardList[2]?.badge_03?.name);
          setMin(rewardList[2]?.badge_03?.point);
          setMax(rewardList[3]?.badge_04?.point);
          setCurrentPercent(userInfo?.point / rewardList[3]?.badge_04?.point);
          return;
        case 4:
          setNameBadge(rewardList[3]?.badge_04?.name);
          setMin(rewardList[3]?.badge_04?.point);
          setMax(rewardList[4]?.badge_05?.point);
          setCurrentPercent(userInfo?.point / rewardList[4]?.badge_05?.point);
          return;
        case 5:
          setNameBadge(rewardList[4]?.badge_05?.name);
          setMin(rewardList[4]?.badge_05?.point);
          setMax(rewardList[4]?.badge_05?.point);
          if (userInfo?.point === max) {
            setCurrentPercent(1);
          } else {
            setCurrentPercent(userInfo?.point / rewardList[4]?.badge_05?.point);
          }
          return;
      }
    }
  };

  const renderRewardIconWithBadge = () => {
    switch (userInfo?.badge) {
      case 1:
        return rewardList[0]?.badge_01?.icon;
      case 2:
        return rewardList[1]?.badge_02?.icon;
      case 3:
        return rewardList[2]?.badge_03?.icon;
      case 4:
        return rewardList[3]?.badge_04?.icon;
      case 5:
        return rewardList[4]?.badge_05?.icon;
    }
  };

  const renderInActionIcon = (rank) => {
    switch (rank) {
      case 1:
        return {uri: rewardList[0]?.badge_01?.inactive_icon};
      case 2:
        return {uri: rewardList[1]?.badge_02?.inactive_icon};
      case 3:
        return {uri: rewardList[2]?.badge_03?.inactive_icon};
      case 4:
        return {uri: rewardList[3]?.badge_04?.inactive_icon};
      case 5:
        return {uri: rewardList[4]?.badge_05?.inactive_icon};
    }
  };

  // console.log(userInfo);
  return (
    <Wrapper style={styles.wrapper}>
      <Header
        height={HEADER_HEIGHT}
        style={styles.header}
        rightComponent={
          <Touchable onPress={handleLogout} style={styles.logoutBtn}>
            <MaterialCommunityIcons
              name="login-variant"
              color={theme.colors.textContrast}
              size={getSize.f(20)}
            />
            <Text style={styles.logoutText}>Log out</Text>
          </Touchable>
        }
      />
      <Touchable
        onPress={() => navigation.navigate('MyPage')}
        style={styles.userWrap}
        scalable>
        <Paper style={styles.userCont}>
          <Avatar data={userInfo?.media?.avatar} />
          <View style={styles.userMeta}>
            <Text numberOfLines={1} style={styles.userName}>
              {userInfo?.name}
            </Text>
            <Rating
              wrapperStyle={styles.ratingWrap}
              value={userInfo?.rating?.rating || 0}
              reviewCount={userInfo?.rating?.count || 0}
              onPress={() => navigation.push('ReviewList', {user: userInfo})}
            />
            <Text style={styles.textUserId}>{userInfo?.username}</Text>
            {/* stripe_id */}
            {/* <View style={styles.kizunaCoin}>
              <Image
                style={styles.coinIcon}
                source={require('../../assets/images/ic-coin.png')}
                tintColor={theme.colors.secondary}
              />
              <Text style={styles.kizunaPoint}>
                {currentWallet?.balance || userInfo?.kizuna || 0} Kizuna
              </Text>
            </View> */}
          </View>
          {/* <Image
            resizeMode='contain'
            source={renderRewardIconWithBadge()}
            style={styles.badgeIcon}
          /> */}
        </Paper>
      </Touchable>

      <ScrollView
        ref={listRef}
        style={styles.scrollWrap}
        nestedScrollEnabled
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}>
        <Paper style={styles.statisticWrap}>
          <UserRelation relation={userInfo?.relation} />
        </Paper>

        {MENU_ITEMS.map((item) => {
          return (
            <Touchable
              onPress={item.onPress}
              onLongPress={item.onLongPress}
              key={item.label}
              style={styles.menuItemWrap}>
              <View style={styles.menuItemContainer}>
                <View style={styles.menuItemLeft}>
                  {item.icon && (
                    <View style={styles.menuItemIcon}>{item.icon}</View>
                  )}
                  <Text style={styles.menuItemWrapLabel}>{item.label}</Text>
                </View>
                <MaterialCommunityIcons
                  name="chevron-right"
                  color={theme.colors.text}
                  size={getSize.f(24)}
                />
              </View>
            </Touchable>
          );
        })}
      </ScrollView>
    </Wrapper>
  );
};

export default ManageScreen;
