import React, {useRef, useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  Keyboard,
  BackHandler,
} from 'react-native';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {useSelector} from 'react-redux';

//import {TourGuideProvider} from 'rn-tourguide';

import {Wrapper, HeaderBg, Text, Touchable, Loading} from 'components';
import useTheme from 'theme';
import {getSize} from 'utils/responsive';
import TourGuildPostHangoutScreen from './TourGuildPostHangoutScreen';
import {useTourGuideController} from 'rn-tourguide';
import NavigationService from 'navigation/service';

const Tab = createMaterialTopTabNavigator();
const width = Dimensions.get('window').width;
const STATUS_BAR = getStatusBarHeight();
const HEADER_HEIGHT = STATUS_BAR + 68;

const MainTourScreen = ({navigation, route}, props) => {
  const formOneRef = useRef();
  const formMulRef = useRef();
  const onlyOneTime = true;
  const callback = () => {};
  const room_id = '';
  const creating = useSelector((state) => state.feed.beingCreateHangout);
  const theme = useTheme();
  const {canStart, start, stop, eventEmitter} = useTourGuideController();
  const [isWorking, setIsWorking] = useState(false);
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
    title: 'Create Hangout',
    privateTitle: 'Private Hangout',
    cancel: 'Cancel',
    post: 'Post',
    oneTime: 'One-Time',
    multiTimes: 'Multi-Times',
  };

  useEffect(() => {
    // props?.start && props?.start();
  }, []);

  const handleOnStart = () => {
    setIsWorking(true);
  };
  const handleOnStop = () => {
    setIsWorking(false);
  };
  const handleOnStepChange = () => {};

  React.useEffect(() => {
    eventEmitter?.on('start', handleOnStart);
    eventEmitter?.on('stop', handleOnStop);
    eventEmitter?.on('stepChange', handleOnStepChange);

    return () => {
      eventEmitter?.off('start', handleOnStart);
      eventEmitter?.off('stop', handleOnStop);
      eventEmitter?.off('stepChange', handleOnStepChange);
    };
  }, []);

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', () => true);
    return () =>
      BackHandler.removeEventListener('hardwareBackPress', () => true);
  }, []);

  function onPressPost() {
    if (onlyOneTime || !route?.state?.index || route.state.index === 0) {
      if (isWorking) return;
      formOneRef?.current?.handleSubmit();
    } else {
      formMulRef?.current?.handleSubmit();
    }
  }

  //{...{tooltipComponent: TooltipComponent}}
  return (
    <Wrapper style={styles.wrapper}>
      <HeaderBg height={HEADER_HEIGHT} noBorder style={styles.headerBg} />
      <Text variant="header" style={styles.headerTitle}>
        {room_id ? lang.privateTitle : lang.title}
      </Text>
      <View style={styles.headerActions}>
        <Touchable>
          <Text style={styles.headerBtn}>{lang.cancel}</Text>
        </Touchable>
        {creating ? (
          <Loading />
        ) : (
          <Touchable onPress={onPressPost} disabled={creating}>
            <Text style={styles.headerBtn}>{lang.post}</Text>
          </Touchable>
        )}
      </View>
      <Tab.Navigator
        tabBar={({state}) => {
          return (
            <View style={styles.tabWrap}>
              <Touchable
                onPress={() => {
                  Keyboard.dismiss();
                  navigation.navigate('One-Time');
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
                  if (isWorking) return;
                  Keyboard.dismiss();
                  navigation.navigate('Multi-Times');
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
          );
        }}>
        <Tab.Screen
          name="One-Time"
          component={TourGuildPostHangoutScreen}
          initialParams={{formRef: formOneRef, callback, room_id}}
        />
      </Tab.Navigator>
    </Wrapper>
  );
};

// const TooltipComponent = ({
//   isFirstStep,
//   isLastStep,
//   handleNext,
//   handlePrev,
//   handleStop,
//   currentStep,
//   labels,
// }) => {
//   const theme = useTheme();
//   const styles = StyleSheet.create({
//     wrapper: {flex: 1},
//     headerBg: {zIndex: 1},
//     headerTitle: {
//       top: STATUS_BAR + getSize.h(26),
//       textAlign: 'center',
//       left: 0,
//       right: 0,
//       position: 'absolute',
//       zIndex: 1,
//     },
//     headerActions: {
//       position: 'absolute',
//       top: STATUS_BAR + getSize.h(25),
//       left: getSize.w(24),
//       right: getSize.w(24),
//       flexDirection: 'row',
//       justifyContent: 'space-between',
//       alignItems: 'center',
//       zIndex: 1,
//     },
//     headerBtn: {
//       fontSize: getSize.f(16),
//       fontFamily: theme.fonts.sfPro.medium,
//       color: theme.colors.textContrast,
//     },
//     tabWrap: {
//       flexDirection: 'row',
//       paddingVertical: getSize.h(20),
//       paddingHorizontal: getSize.w(24),
//       alignItems: 'center',
//       justifyContent: 'space-between',
//       backgroundColor: theme.colors.paper,
//       marginTop: getSize.h(HEADER_HEIGHT),
//       ...theme.shadow.large.ios,
//       ...theme.shadow.large.android,
//     },
//     tabItem: {
//       height: getSize.h(38),
//       borderRadius: getSize.h(38 / 2),
//       backgroundColor: theme.colors.tagBg,
//       justifyContent: 'center',
//       alignItems: 'center',
//       width: width / 2 - getSize.w(24 + 10),
//     },
//     tabItemActive: {
//       backgroundColor: theme.colors.secondary,
//     },
//     tabLabel: {
//       fontFamily: theme.fonts.sfPro.medium,
//       color: theme.colors.text,
//     },
//     tabLabelActive: {
//       fontFamily: theme.fonts.sfPro.semiBold,
//       color: theme.colors.textContrast,
//     },
//     headerSpace: {
//       height: getSize.h(HEADER_HEIGHT),
//     },
//   });

//   return (
//     <View
//       style={{
//         borderRadius: 16,
//         paddingTop: 24,
//         alignItems: 'center',
//         justifyContent: 'center',
//         paddingBottom: 16,
//         width: '80%',
//         backgroundColor: '#ffffffef',
//       }}>
//       <View style={styles.tooltipContainer}>
//         <Text testID="stepDescription" style={styles.tooltipText}>
//           {currentStep && currentStep.text}
//         </Text>
//       </View>
//       <View style={[styles.bottomBar]}>
//         {!isLastStep ? (
//           <Touchable onPress={handleStop}>
//             <Text>{labels?.skip || 'Skip'}</Text>
//           </Touchable>
//         ) : null}
//         {!isFirstStep ? (
//           <Touchable onPress={handlePrev}>
//             <Text>{labels?.previous || 'Previous'}</Text>
//           </Touchable>
//         ) : null}
//         {!isLastStep ? (
//           <Touchable onPress={handleNext}>
//             <Text>{labels?.next || 'Next'}</Text>
//           </Touchable>
//         ) : (
//           <Touchable onPress={handleStop}>
//             <Text>{labels?.finish || 'Finish'}</Text>
//           </Touchable>
//         )}
//       </View>
//     </View>
//   );
// };

export default MainTourScreen;
