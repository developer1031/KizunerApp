import React, {useEffect, useState} from 'react';
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

import useTheme from 'theme';
import {Text, Touchable, Paper} from 'components';
import {getSize} from 'utils/responsive';
import {useSelector, useDispatch} from 'react-redux';
import {toggleIsShowTrophyModal} from 'actions';
import {Icons} from 'utils/icon';

const TopUpLeaderBoard = () => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const {isShowModalTrophy} = useSelector((state) => state.alert);
  const {rewardList} = useSelector((state) => state.app);

  const userInfo = useSelector((state) => state.auth.userInfo);
  const [isShow, setIsShow] = useState(isShowModalTrophy);
  const [reward, setReward] = useState(0);

  useEffect(() => {
    setIsShow(isShowModalTrophy);
    if (rewardList) {
      handleCheckListBadge();
    }
  }, [isShowModalTrophy, userInfo]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    subContainer: {
      width: Dimensions.get('window').width - getSize.w(40),
      height: Dimensions.get('window').height / 2.9,
      backgroundColor: '#fff',
      borderRadius: getSize.w(30),
      alignItems: 'center',
      paddingVertical: getSize.w(8),
    },
    content: {
      paddingHorizontal: getSize.w(8),
      flex: 1,
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
    imageCon: {
      width: getSize.w(120),
      height: getSize.w(120),
    },
    text: {
      fontFamily: theme.fonts.sfPro.medium,
      fontSize: getSize.f(14),
      marginTop: getSize.w(4),
      textAlign: 'center',
    },
  });
  const handleCheckListBadge = () => {
    if (rewardList) {
      switch (userInfo?.badge) {
        case 1:
          setReward(rewardList[0]?.badge_01?.reward);
          break;
        case 2:
          setReward(rewardList[1]?.badge_02?.reward);
          break;
        case 3:
          setReward(rewardList[2]?.badge_03?.reward);
          break;
        case 4:
          setReward(rewardList[3]?.badge_04?.reward);
          break;
        case 5:
          setReward(rewardList[4]?.badge_05?.reward);
          break;
      }
    }
  };
  return (
    <Modal
      style={{zIndex: 99999}}
      visible={isShow}
      animationType={'slide'}
      transparent={true}>
      {Platform.OS === 'android' ? (
        <StatusBar backgroundColor="rgba(0,0,0,0.5)" />
      ) : null}
      <View style={styles.container}>
        <Paper noShadow={false} style={styles.subContainer}>
          <Touchable
            onPress={() => {
              dispatch(toggleIsShowTrophyModal(false));
            }}
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
          <FastImage
            source={Icons.ic_congratulationsReward}
            style={styles.imageCon}
          />
          <View style={styles.content}>
            <Text style={styles.text}>Congratulation!</Text>
            {userInfo?.badge === 5 ? (
              <Text style={styles.text}>You have reached full level now.</Text>
            ) : (
              <Text style={styles.text}>
                You have reached level {userInfo?.badge} now.
              </Text>
            )}
            <Text style={styles.text}>
              And you will get {reward} kizuna reward.
            </Text>
          </View>
        </Paper>
      </View>
    </Modal>
  );
};

export default TopUpLeaderBoard;
