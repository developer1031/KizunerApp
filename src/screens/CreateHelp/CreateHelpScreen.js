import React, {useRef} from 'react';
import {StyleSheet, View, Dimensions, Keyboard} from 'react-native';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {useSelector} from 'react-redux';

import {Wrapper, HeaderBg, Text, Touchable, Loading} from 'components';
import useTheme from 'theme';
import {getSize} from 'utils/responsive';
import FormOneTimeHelp from './FormOneTimeHelp';
import FormMultiTimesHelp from './FormMultiTimesHelp';
import FormCreateHelp from './FormCreateHelp';

const Tab = createMaterialTopTabNavigator();
const width = Dimensions.get('window').width;

const CreateHelpScreen = ({navigation, route}) => {
  const formOneRef = useRef();
  const formMulRef = useRef();
  const formRef = useRef();
  const refDraftBtn = useRef();
  const STATUS_BAR = getStatusBarHeight();
  const {onlyOneTime, callback, room_id} = route.params;
  const creating = useSelector((state) => state.feed.beingCreateHelp);
  const HEADER_HEIGHT = STATUS_BAR + 68;
  const theme = useTheme();

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
    headerSpace: {
      height: getSize.h(HEADER_HEIGHT),
    },
  });

  const lang = {
    title: 'Create Help',
    privateTitle: 'Private Help',
    cancel: 'Cancel',
    post: 'Post',
    oneTime: 'One-Time',
  };

  function onPressPost() {
    formRef?.current?.handleSubmit();
    // if (onlyOneTime || !route?.state?.index || route.state.index === 0) {
    //   formOneRef?.current?.handleSubmit()
    // } else {
    //   formMulRef?.current?.handleSubmit()
    // }
  }

  const onPressDraft = () => refDraftBtn.current?.onPressDraft();

  return (
    <Wrapper style={styles.wrapper}>
      <HeaderBg height={HEADER_HEIGHT} noBorder style={styles.headerBg} />
      <Text variant="header" style={styles.headerTitle}>
        {room_id ? lang.privateTitle : lang.title}
      </Text>
      <View style={styles.headerActions}>
        <Touchable onPress={navigation.goBack}>
          <Text style={styles.headerBtn}>{lang.cancel}</Text>
        </Touchable>
        <Touchable onPress={onPressDraft} disabled={creating}>
          <Text style={styles.headerBtn}>Draft</Text>
        </Touchable>
        {/* {creating ? (
          <Loading />
        ) : (
          <Touchable onPress={onPressPost} disabled={creating}>
            <Text style={styles.headerBtn}>{lang.post}</Text>
          </Touchable>
        )} */}
      </View>
      {/* <Tab.Navigator
        tabBar={({state}) => {
          if (onlyOneTime) {
            return <View style={styles.headerSpace} />
          }
          return (
            <View style={styles.tabWrap}>
              <Touchable
                onPress={() => {
                  Keyboard.dismiss()
                  navigation.navigate('One-Time')
                }}
                style={[
                  styles.tabItem,
                  state.index === 0 && styles.tabItemActive,
                ]}>
                <Text
                  style={[
                    styles.tabLabel,
                    state.index === 0 && styles.tabLabelActive,
                  ]}>
                  One-Time
                </Text>
              </Touchable>
              <Touchable
                onPress={() => {
                  Keyboard.dismiss()
                  navigation.navigate('Multi-Times')
                }}
                style={[
                  styles.tabItem,
                  state.index === 1 && styles.tabItemActive,
                ]}>
                <Text
                  style={[
                    styles.tabLabel,
                    state.index === 1 && styles.tabLabelActive,
                  ]}>
                  Multi-Times
                </Text>
              </Touchable>
            </View>
          )
        }}>
        <Tab.Screen
          name='One-Time'
          component={FormOneTimeHelp}
          initialParams={{formRef: formOneRef, callback, room_id}}
        />
        <Tab.Screen
          name='Multi-Times'
          component={FormMultiTimesHelp}
          initialParams={{formRef: formMulRef, callback}}
        />
      </Tab.Navigator> */}

      <Tab.Navigator tabBar={() => <View style={styles.headerSpace} />}>
        <Tab.Screen
          name="All"
          component={FormCreateHelp}
          initialParams={{formRef, callback, room_id, refDraftBtn}}
        />
      </Tab.Navigator>
    </Wrapper>
  );
};

export default CreateHelpScreen;
