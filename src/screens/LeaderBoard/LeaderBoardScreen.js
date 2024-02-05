import React from 'react';
import {StyleSheet, Animated} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

import useTheme from 'theme';
import {getSize} from 'utils/responsive';
import {Text, Touchable} from 'components';
import LeaderBoardCountry from './ColumnLeaderBoard/LeaderBoardCountry';
import LeaderBoardRegion from './ColumnLeaderBoard/LeaderBoardRegion';
import LeaderBoardGlobal from './ColumnLeaderBoard/LeaderBoardGlobal';
import orangeLight from '../../theme/orangeLight';

import ChartLeaderBoard from './ChartLeaderBoard';
import ColumnLeaderBoard from './ColumnLeaderBoard';
import {View} from 'react-native';

const Tab = createMaterialTopTabNavigator();
const AnimatedLG = Animated.createAnimatedComponent(LinearGradient);

const LeaderBoardScreen = ({navigation}) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const styles = StyleSheet.create({
    wrapper: {flex: 1},
    scrollWrap: {
      flex: 1,
      zIndex: -1,
    },
    backBtn: {
      position: 'absolute',
      top: insets.top + getSize.h(20),
      left: getSize.w(24),
      zIndex: 20,
    },
    headerTitle: {
      top: insets.top + getSize.h(26),
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

  return (
    <AnimatedLG
      colors={theme.colors.gradient}
      start={{x: 0, y: 1}}
      end={{x: 1, y: 1}}
      style={styles.wrapper}>
      <Touchable onPress={navigation.goBack} style={styles.backBtn}>
        <MaterialCommunityIcons
          name="chevron-left"
          size={getSize.f(34)}
          color={theme.colors.textContrast}
        />
      </Touchable>
      <Text variant="header" style={styles.headerTitle}>
        Leaderboard
      </Text>
      <Tab.Navigator
        initialRouteName="Quantity"
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
        }}
        tabBar={({state}) => {
          return null;
        }}
        style={{
          marginTop: insets.top + getSize.h(26),
        }}>
        {/* <Tab.Screen name="Ranking" component={ColumnLeaderBoard} /> */}
        <Tab.Screen name="Quantity" component={ChartLeaderBoard} />
      </Tab.Navigator>
    </AnimatedLG>
  );
};

export default LeaderBoardScreen;
