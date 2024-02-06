import React from 'react';
import {StyleSheet, View, Dimensions} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

import {Wrapper, HeaderBg, Text, Touchable} from 'components';
import useTheme from 'theme';
import {getSize} from 'utils/responsive';
import CapacityList from './CapacityList';
import WaitingList from './WaitingList';

const Tab = createMaterialTopTabNavigator();
const width = Dimensions.get('window').width;

const GuestListScreen = ({navigation, route}) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const STATUS_BAR = insets.top;
  const HEADER_HEIGHT = STATUS_BAR + 68;

  const {hangoutId, capacity, start, end} = route.params;

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
      fontFamily: theme.fonts.sfPro.medium,
      color: theme.colors.textContrast,
    },
    tabWrap: {
      flexDirection: 'row',
      paddingVertical: getSize.h(20),
      paddingHorizontal: getSize.w(24),
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: theme.colors.paper,
      marginTop: getSize.h(HEADER_HEIGHT),
      ...theme.shadow.large.ios,
      ...theme.shadow.large.android,
    },
    tabItem: {
      height: getSize.h(38),
      borderRadius: getSize.h(38 / 2),
      backgroundColor: theme.colors.tagBg,
      justifyContent: 'center',
      alignItems: 'center',
      width: width / 2 - getSize.w(24 + 10),
    },
    tabItemActive: {
      backgroundColor: theme.colors.secondary,
    },
    tabLabel: {
      fontFamily: theme.fonts.sfPro.medium,
      color: theme.colors.text,
    },
    tabLabelActive: {
      fontFamily: theme.fonts.sfPro.semiBold,
      color: theme.colors.textContrast,
    },
  });

  const lang = {
    title: 'Guest list',
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
          return (
            <View style={styles.tabWrap}>
              {/* <Touchable
                onPress={() => navigation.navigate('CapacityList')}
                style={[
                  styles.tabItem,
                  state.index === 0 && styles.tabItemActive,
                ]}>
                <Text
                  numberOfLines={1}
                  style={[
                    styles.tabLabel,
                    state.index === 0 && styles.tabLabelActive,
                  ]}>
                  {capacity ? `Capacity (${capacity})` : 'Capacity'}
                </Text>
              </Touchable>
              <Touchable
                onPress={() => navigation.navigate('WaitingList')}
                style={[
                  styles.tabItem,
                  state.index === 1 && styles.tabItemActive,
                ]}>
                <Text
                  style={[
                    styles.tabLabel,
                    state.index === 1 && styles.tabLabelActive,
                  ]}>
                  Waiting List
                </Text>
              </Touchable> */}
            </View>
          );
        }}>
        <Tab.Screen
          name="CapacityList"
          component={CapacityList}
          initialParams={{hangoutId, start, end}}
        />
        <Tab.Screen
          name="WaitingList"
          component={WaitingList}
          initialParams={{hangoutId, end}}
        />
      </Tab.Navigator>
    </Wrapper>
  );
};

export default GuestListScreen;
