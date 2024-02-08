import React, {useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {useDispatch, useSelector} from 'react-redux';

import useTheme from 'theme';
import {getSize} from 'utils/responsive';
import {
  Wrapper,
  HeaderBg,
  Text,
  Touchable,
  SearchBar,
  Tag,
  Paper,
} from 'components';
import {editContactSearch} from 'actions';

import UserList from './UserList';

const Tab = createMaterialTopTabNavigator();

const CONTACT_TABS = ['Followings', 'Followers'];

const ContactListScreen = ({navigation, route}) => {
  const theme = useTheme();
  const {userId, initialTab} = route.params;
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      dispatch(editContactSearch(userId, ''));
    });

    return unsubscribe;
  }, [navigation]);

  const styles = StyleSheet.create({
    wrapper: {flex: 1},
    headerSearch: {
      height: getSize.h(48),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: insets.top + getSize.h(30),
      paddingHorizontal: getSize.w(20),
      marginHorizontal: getSize.w(24),
    },
    backBtn: {
      position: 'absolute',
      top: insets.top + getSize.h(20),
      left: getSize.w(24),
      zIndex: 20,
    },
    headerBg: {
      zIndex: 0,
    },
    headerTitle: {
      top: insets.top + getSize.h(26),
      textAlign: 'center',
      zIndex: 1,
    },
    headerWrap: {zIndex: 10},
    tabWrapper: {
      justifyContent: 'flex-end',
      paddingBottom: getSize.h(20),
      paddingTop: insets.top + getSize.h(97 + 50),
      left: 0,
      right: 0,
      zIndex: 1,
      ...theme.shadow.small.ios,
      ...theme.shadow.small.android,
      backgroundColor: 'white',
    },
    tabContainer: {
      marginHorizontal: getSize.w(24 - 5),
      flexDirection: 'row',
    },
    tabItem: {
      flex: 1,
      marginHorizontal: getSize.w(5),
    },
    tabItemContainer: {
      paddingRight: 0,
      paddingHorizontal: 0,
    },
    tabItemLabel: {
      fontFamily: theme.fonts.sfPro.semiBold,
      textAlign: 'center',
    },
    tabNav: {
      position: 'absolute',
      zIndex: -1,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    tabScene: {
      backgroundColor: theme.colors.background,
    },
  });

  return (
    <Wrapper style={styles.wrapper}>
      <HeaderBg style={styles.headerBg} height={97} addSBHeight />
      <Touchable onPress={navigation.goBack} style={styles.backBtn}>
        <MaterialCommunityIcons
          name="chevron-left"
          size={getSize.f(34)}
          color={theme.colors.textContrast}
        />
      </Touchable>
      <Text variant="header" style={styles.headerTitle}>
        Contact List
      </Text>
      <SearchBar
        placeholder="Search user"
        wrapperStyle={styles.headerSearch}
        onChangeText={(value) => dispatch(editContactSearch(userId, value))}
        autoFocus={false}
      />
      <Tab.Navigator
        style={styles.tabNav}
        initialRouteName={initialTab}
        sceneContainerStyle={styles.tabScene}
        tabBar={({state}) => {
          return (
            <Paper style={styles.tabWrapper}>
              <View style={styles.tabContainer}>
                {CONTACT_TABS.map((item, index) => (
                  <Tag
                    value={item}
                    key={item}
                    noPunc
                    active={state.index === index}
                    wrapperStyle={styles.tabItem}
                    containerStyle={styles.tabItemContainer}
                    labelStyle={styles.tabItemLabel}
                    onPress={() => navigation.navigate(`${item}Tab`)}
                  />
                ))}
              </View>
            </Paper>
          );
        }}>
        {CONTACT_TABS.map((item) => (
          <Tab.Screen
            name={`${item}Tab`}
            key={item}
            component={UserList}
            initialParams={{tab: item.toLowerCase(), userId}}
          />
        ))}
      </Tab.Navigator>
    </Wrapper>
  );
};

export default ContactListScreen;
