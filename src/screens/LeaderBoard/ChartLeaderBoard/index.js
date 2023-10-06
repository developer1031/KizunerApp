import React from 'react';
import {StyleSheet, Animated} from 'react-native';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import LinearGradient from 'react-native-linear-gradient';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

import useTheme from 'theme';
import {getSize} from 'utils/responsive';
import LeaderBoardCast from './LeaderBoardCast';
import orangeLight from '../../../theme/orangeLight';
import LeaderBoardGuest from './LeaderBoardGuest';
import LeaderBoardRequest from './LeaderBoardRequest';
import LeaderBoardHelp from './LeaderBoardHelp';

const Tab = createMaterialTopTabNavigator();
const AnimatedLG = Animated.createAnimatedComponent(LinearGradient);

const ChartLeaderBoard = ({navigation}) => {
  const theme = useTheme();

  return (
    <AnimatedLG
      colors={theme.colors.gradient}
      start={{x: 0, y: 1}}
      end={{x: 1, y: 1}}
      style={styles.wrapper}>
      <Tab.Navigator
        initialRouteName="ChartLeaderBoard"
        lazy={true}
        tabBarOptions={{
          indicatorStyle: {
            backgroundColor: 'white',
          },
          labelStyle: styles.labelStyle,
          tabStyle: styles.tabStyle,
          style: styles.tabs,
          inactiveTintColor: theme.colors.grayLight,
          activeTintColor: 'white',
        }}>
        <Tab.Screen name="Cast" component={LeaderBoardCast} />
        <Tab.Screen name="Guest" component={LeaderBoardGuest} />
        <Tab.Screen name="Requester" component={LeaderBoardRequest} />
        <Tab.Screen name="Helper" component={LeaderBoardHelp} />
      </Tab.Navigator>
    </AnimatedLG>
  );
};

const styles = StyleSheet.create({
  wrapper: {flex: 1},
  scrollWrap: {
    flex: 1,
    zIndex: -1,
  },
  backBtn: {
    position: 'absolute',
    top: getStatusBarHeight() + getSize.h(20),
    left: getSize.w(24),
    zIndex: 20,
  },
  headerTitle: {
    top: getStatusBarHeight() + getSize.h(26),
    textAlign: 'center',
  },
  tabStyle: {
    paddingHorizontal: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelStyle: {
    fontSize: getSize.f(12),
    fontFamily: orangeLight.fonts.sfPro.bold,
    // width: '100%',
    // alignItems: 'center',
    // justifyContent: 'center',
    // backgroundColor: 'red',
  },
  tabs: {
    backgroundColor: 'transparent',
  },
});

export default ChartLeaderBoard;
