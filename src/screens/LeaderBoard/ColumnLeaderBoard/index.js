import React from 'react';
import {StyleSheet, Animated} from 'react-native';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import LinearGradient from 'react-native-linear-gradient';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

import useTheme from 'theme';
import {getSize} from 'utils/responsive';
import LeaderBoardCountry from './LeaderBoardCountry';
import LeaderBoardRegion from './LeaderBoardRegion';
import LeaderBoardGlobal from './LeaderBoardGlobal';
import orangeLight from '../../../theme/orangeLight';

const Tab = createMaterialTopTabNavigator();
const AnimatedLG = Animated.createAnimatedComponent(LinearGradient);

const ColumnLeaderBoard = ({navigation}) => {
  const theme = useTheme();

  return (
    <AnimatedLG
      colors={theme.colors.gradient}
      start={{x: 0, y: 1}}
      end={{x: 1, y: 1}}
      style={styles.wrapper}>
      <Tab.Navigator
        initialRouteName="Regional"
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
        <Tab.Screen name="Regional" component={LeaderBoardRegion} />
        <Tab.Screen name="Country" component={LeaderBoardCountry} />
        <Tab.Screen name="Global" component={LeaderBoardGlobal} />
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
  tabStyle: {},
  labelStyle: {
    fontSize: getSize.f(14),
    fontFamily: orangeLight.fonts.sfPro.bold,
  },
  tabs: {
    backgroundColor: 'transparent',
  },
});

export default ColumnLeaderBoard;
