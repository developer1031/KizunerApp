import React from 'react';
import {StyleSheet, View, Dimensions} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

import {Wrapper, HeaderBg, Text, Touchable} from 'components';
import useTheme from 'theme';
import {getSize} from 'utils/responsive';
import CapacityList from './CapacityList';
import WaitingList from './WaitingList';
import orangeLight from '../../theme/orangeLight';

const Tab = createMaterialTopTabNavigator();
const width = Dimensions.get('window').width;

const GuestListHelpScreen = ({navigation, route}) => {
  const theme = useTheme();
  const {helpId, capacity, start, end} = route.params;
  const insets = useSafeAreaInsets();

  const STATUS_BAR = insets.top;
  const HEADER_HEIGHT = STATUS_BAR + 68;

  const styles = StyleSheet.create({
    wrapper: {flex: 1},
    headerBg: {zIndex: 1},
    headerTitle: {
      top: STATUS_BAR + getSize.h(26),
      textAlign: 'center',
      left: 0,
      right: 0,
      position: 'absolute',
      zIndex: 1,
    },
    headerActions: {
      position: 'absolute',
      top: STATUS_BAR + getSize.h(25),
      left: getSize.w(24),
      right: getSize.w(24),
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      zIndex: 1,
    },
    headerBtn: {
      fontSize: getSize.f(16),
      fontFamily: orangeLight.fonts.sfPro.medium,
      color: orangeLight.colors.textContrast,
    },
    tabWrap: {
      flexDirection: 'row',
      paddingVertical: getSize.h(20),
      paddingHorizontal: getSize.w(24),
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: orangeLight.colors.paper,
      marginTop: getSize.h(HEADER_HEIGHT),
      ...orangeLight.shadow.large.ios,
      ...orangeLight.shadow.large.android,
    },
    tabItem: {
      height: getSize.h(38),
      borderRadius: getSize.h(38 / 2),
      backgroundColor: orangeLight.colors.tagBg,
      justifyContent: 'center',
      alignItems: 'center',
      width: width / 2 - getSize.w(24 + 10),
    },
    tabItemActive: {
      backgroundColor: orangeLight.colors.secondary,
    },
    tabLabel: {
      fontFamily: orangeLight.fonts.sfPro.medium,
      color: orangeLight.colors.text,
    },
    tabLabelActive: {
      fontFamily: orangeLight.fonts.sfPro.semiBold,
      color: orangeLight.colors.textContrast,
    },
  });

  const lang = {
    title: 'Helper list',
    cancel: 'Cancel',
  };

  return (
    <Wrapper style={styles.wrapper}>
      <HeaderBg height={HEADER_HEIGHT} noBorder style={styles.headerBg} />
      <Text variant="header" style={styles.headerTitle}>
        {lang.title}
      </Text>
      <View style={styles.headerActions}>
        <Touchable onPress={navigation.goBack}>
          <Text style={styles.headerBtn}>{lang.cancel}</Text>
        </Touchable>
      </View>

      <Tab.Navigator
        tabBar={({state}) => {
          return <View style={styles.tabWrap}></View>;
        }}>
        <Tab.Screen
          name="CapacityList"
          component={CapacityList}
          initialParams={{helpId, start, end}}
        />
        <Tab.Screen
          name="WaitingList"
          component={WaitingList}
          initialParams={{helpId}}
        />
      </Tab.Navigator>
    </Wrapper>
  );
};

export default GuestListHelpScreen;
