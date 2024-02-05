import React, {useRef} from 'react';
import {StyleSheet, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {useSelector} from 'react-redux';

import {Wrapper, HeaderBg, Text, Touchable, Loading} from 'components';
import useTheme from 'theme';
import {getSize} from 'utils/responsive';
import FormMultiTimesHangout from './FormMultiTimesHangout';
import FormOneTimeHangout from './FormOneTimeHangout';

const Tab = createMaterialTopTabNavigator();

const EditHangoutScreen = ({navigation, route}) => {
  const formOneRef = useRef();
  const formMulRef = useRef();
  const formRef = useRef();
  const insets = useSafeAreaInsets();

  const STATUS_BAR = insets.top;
  const {hangout} = route.params;
  const beingUpdateHangout = useSelector(
    (state) => state.feed.beingUpdateHangout,
  );
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
  });

  const lang = {
    title: 'Edit Hangout',
    cancel: 'Cancel',
    save: 'Save',
  };

  function onPressSave() {
    if (hangout.type === 1) {
      formOneRef?.current?.handleSubmit();
    } else {
      formMulRef?.current?.handleSubmit();
    }

    formRef?.current?.handleSubmit();
  }

  const updating = beingUpdateHangout.find((i) => hangout.id === i);

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
        initialRouteName={hangout.type === 1 ? 'One-Time' : 'Multi-Times'}
        tabBar={() => null}
        backBehavior="none"
        swipeEnabled={false}>
        <Tab.Screen
          name="One-Time"
          component={FormOneTimeHangout}
          initialParams={{
            formRef: formOneRef,
            formType: 'edit',
            initialValues: hangout,
          }}
        />
        <Tab.Screen
          name="Multi-Times"
          component={FormMultiTimesHangout}
          initialParams={{
            formRef: formMulRef,
            formType: 'edit',
            initialValues: hangout,
          }}
        />
      </Tab.Navigator>
    </Wrapper>
  );
};

export default EditHangoutScreen;
