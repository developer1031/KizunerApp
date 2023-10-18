import React from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Modal,
  Platform,
  StatusBar,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSelector} from 'react-redux';

import {Text, Touchable} from 'components';
import {getSize} from 'utils/responsive';
import useTheme from 'theme';
import Avatar from './Avatar';
import Paper from './Paper';

import NavigationService from 'navigation/service';

const UserInfoBadge = ({open, onClose, userInfo}) => {
  const theme = useTheme();
  const {rewardList} = useSelector((state) => state.app);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    subContainer: {
      ...Platform.select({
        ios: {
          width: Dimensions.get('window').width - getSize.w(20),
          height: Dimensions.get('window').height / 2.5,
          backgroundColor: '#fff',
          borderRadius: getSize.w(30),
          alignItems: 'center',
        },
        android: {
          width: Dimensions.get('window').width - getSize.w(20),
          paddingVertical: getSize.w(8),
          backgroundColor: '#fff',
          borderRadius: getSize.w(30),
          alignItems: 'center',
        },
      }),
    },
    avatar: {
      ...Platform.select({
        ios: {
          position: 'absolute',
          zIndex: 1,
          top: -getSize.h(80),
        },
        android: {
          zIndex: 1,
          borderColor: theme.colors.primary,
          borderWidth: getSize.w(8),
        },
      }),
    },
    iconClose: {
      zIndex: 100000,
      position: 'absolute',
      ...Platform.select({
        ios: {
          top: -getSize.h(50),
          right: 0,
        },
        android: {
          right: getSize.w(8),
          top: getSize.w(8),
        },
      }),
    },
    point: {
      fontSize: getSize.f(21),
      fontFamily: theme.fonts.sfPro.bold,
      color: '#FF6464',
      textTransform: 'uppercase',
      marginVertical: getSize.h(4),
    },
    name: {
      marginTop: getSize.h(32),
    },
    firstRowReward: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      paddingHorizontal: getSize.w(42),
      paddingVertical: getSize.w(8),
      justifyContent: 'space-around',
      width: '100%',
    },
    twoRowReward: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      paddingHorizontal: getSize.w(42),
      paddingVertical: getSize.w(8),
      justifyContent: 'space-around',
      width: '80%',
    },
    contextBadge: {
      width: getSize.w(70),
      height: getSize.w(70),
      borderRadius: getSize.w(70 / 2),
      backgroundColor: '#F0F0F0',
      justifyContent: 'center',
      alignItems: 'center',
    },
    icBadge: {
      width: getSize.w(50),
      height: getSize.w(50),
    },
    icBadge1: {
      width: getSize.w(50),
      height: getSize.w(50),
    },
  });

  const badge = userInfo?.badge || 0;
  const renderActionIcon = (rank) => {
    if (
      rewardList &&
      rewardList[0] &&
      rewardList[1] &&
      rewardList[2] &&
      rewardList[3] &&
      rewardList[4]
    ) {
      switch (rank) {
        case 1:
          return {uri: rewardList[0]?.badge_01?.icon};
        case 2:
          return {uri: rewardList[1]?.badge_02?.icon};
        case 3:
          return {uri: rewardList[2]?.badge_03?.icon};
        case 4:
          return {uri: rewardList[3]?.badge_04?.icon};
        case 5:
          return {uri: rewardList[4]?.badge_05?.icon};
      }
    }
  };

  const renderInActionIcon = (rank) => {
    if (
      rewardList &&
      rewardList[0] &&
      rewardList[1] &&
      rewardList[2] &&
      rewardList[3] &&
      rewardList[4]
    ) {
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
    }
  };

  return (
    <Modal visible={open} animationType={'fade'} transparent={true}>
      {Platform.OS === 'android' ? (
        <StatusBar backgroundColor="rgba(0,0,0,0.5)" />
      ) : null}
      <View style={styles.container}>
        <Paper noShadow={false} style={styles.subContainer}>
          <Touchable
            onPress={() => onClose()}
            scalable
            style={styles.iconClose}>
            {Platform.OS === 'ios' ? (
              <MaterialCommunityIcons
                size={getSize.f(40)}
                color={theme.colors.paper}
                name="close-circle-outline"
              />
            ) : (
              <MaterialCommunityIcons
                size={getSize.f(40)}
                color={theme.colors.primary}
                name="close-circle-outline"
              />
            )}
          </Touchable>

          <Avatar
            onPress={() => {
              if (userInfo) {
                onClose();
                NavigationService.push('UserProfile', {
                  userId: userInfo?.user?.data?.id,
                });
              }
            }}
            style={styles.avatar}
            size="badge"
            noShadow
            data={userInfo?.user?.data?.media?.avatar}
            source={{uri: userInfo?.user?.data?.avatar}}
          />
          <Text style={styles.name} variant={'headerBlack'}>
            {userInfo?.user?.data?.name}
          </Text>
          <Text style={styles.point}>{userInfo?.point}</Text>
          <View style={styles.firstRowReward}>
            <View style={styles.contextBadge}>
              <FastImage
                resizeMode="contain"
                source={
                  badge >= 1 ? renderActionIcon(1) : renderInActionIcon(1)
                }
                style={styles.icBadge1}
              />
            </View>
            <View style={styles.contextBadge}>
              <FastImage
                resizeMode="contain"
                source={
                  badge >= 2 ? renderActionIcon(2) : renderInActionIcon(2)
                }
                style={styles.icBadge}
              />
            </View>
            <View style={styles.contextBadge}>
              <FastImage
                resizeMode="contain"
                source={
                  badge >= 3 ? renderActionIcon(3) : renderInActionIcon(3)
                }
                style={styles.icBadge}
              />
            </View>
          </View>
          <View style={styles.twoRowReward}>
            <View style={styles.contextBadge}>
              <FastImage
                resizeMode="contain"
                source={
                  badge >= 4 ? renderActionIcon(4) : renderInActionIcon(4)
                }
                style={styles.icBadge}
              />
            </View>
            <View style={styles.contextBadge}>
              <FastImage
                resizeMode="contain"
                source={
                  badge >= 5 ? renderActionIcon(5) : renderInActionIcon(5)
                }
                style={styles.icBadge}
              />
            </View>
          </View>
        </Paper>
      </View>
    </Modal>
  );
};

export default UserInfoBadge;
