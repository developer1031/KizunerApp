import React, {useRef} from 'react';
import {StyleSheet, View} from 'react-native';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {useSelector} from 'react-redux';

import {Wrapper, HeaderBg, Text, Touchable, Loading} from 'components';
import useTheme from 'theme';
import {getSize} from 'utils/responsive';
import FormOneTimeHelp from './FormOneTimeHelp';
import FormMultiTimesHelp from './FormMultiTimesHelp';

const Tab = createMaterialTopTabNavigator();

const EditHelpScreen = ({navigation, route}) => {
  const formOneRef = useRef();
  const formMulRef = useRef();
  const STATUS_BAR = getStatusBarHeight();
  const {help} = route.params;
  const beingUpdateHelp = useSelector((state) => state.feed.beingUpdateHelp);
  const HEADER_HEIGHT = 68;
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
    headerSpace: {
      height: getSize.h(HEADER_HEIGHT),
    },
  });

  const lang = {
    title: 'Edit Help',
    cancel: 'Cancel',
    save: 'Save',
  };

  function onPressSave() {
    if (help.type === 1) {
      formOneRef?.current?.handleSubmit();
    } else {
      formMulRef?.current?.handleSubmit();
    }
  }

  const updating = beingUpdateHelp.find((i) => help.id === i);

  return (
    <Wrapper style={styles.wrapper}>
      <HeaderBg
        height={HEADER_HEIGHT}
        addSBHeight
        noBorder
        style={styles.headerBg}
      />
      <Text variant="header" style={styles.headerTitle}>
        {lang.title}
      </Text>
      <View style={styles.headerActions}>
        <Touchable onPress={navigation.goBack}>
          <Text style={styles.headerBtn}>{lang.cancel}</Text>
        </Touchable>
        {updating ? (
          <Loading />
        ) : (
          <Touchable onPress={onPressSave} disabled={updating}>
            <Text style={styles.headerBtn}>{lang.save}</Text>
          </Touchable>
        )}
      </View>
      <Tab.Navigator
        style={{marginTop: STATUS_BAR + getSize.h(HEADER_HEIGHT)}}
        initialRouteName={
          help.type === 1
            ? 'One-Time'
            : help.type === 2
            ? 'Multi-Times'
            : 'One-Time'
        }
        tabBar={() => null}
        backBehavior="none"
        swipeEnabled={false}>
        <Tab.Screen
          name="One-Time"
          component={FormOneTimeHelp}
          initialParams={{
            formRef: formOneRef,
            formType: 'edit',
            initialValues: help,
          }}
        />
        <Tab.Screen
          name="Multi-Times"
          component={FormMultiTimesHelp}
          initialParams={{
            formRef: formMulRef,
            formType: 'edit',
            initialValues: help,
          }}
        />
      </Tab.Navigator>
    </Wrapper>
  );
};

export default EditHelpScreen;
