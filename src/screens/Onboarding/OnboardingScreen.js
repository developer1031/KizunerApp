import React, {useEffect} from 'react';
import {StyleSheet, ImageBackground} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';

import NavigationService from 'navigation/service';
import {getSize} from 'utils/responsive';
import {Wrapper, AppIntroSlider, Text} from 'components';
import orangeLight from '../../theme/orangeLight';
import {createUUID} from 'utils/util';
import {
  getTutorialImages,
  toggleIsFirstLaunch,
  toggleIsSkipLauch,
  setNeedVerifyEmail,
} from 'actions';
import {View} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const OnboardingScreen = ({navigation, route}) => {
  const {isAuth, needVerifyEmail} = useSelector((state) => state.auth);
  const {tutorialImagesList} = useSelector((state) => state.trophy);
  const nav = useNavigation();
  useEffect(() => {
    dispatch(getTutorialImages());
  }, []);

  useEffect(() => {
    needVerifyEmail && nav.navigate('VerifyEmail');
  }, [needVerifyEmail]);

  const dispatch = useDispatch();

  const renderItem = ({item, index}) => {
    return (
      <ImageBackground
        key={createUUID()}
        style={styles.slide}
        source={{uri: item.image}}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingTop: getSize.h(185),
          }}>
          <Text numberOfLines={1} style={styles.text}>
            {item.title}
          </Text>
          <Text numberOfLines={4} style={styles.textDescription}>
            {item.description}
          </Text>
        </View>
      </ImageBackground>
    );
  };

  return (
    <Wrapper style={styles.wrapper}>
      <AppIntroSlider
        onSkip={() => {
          // NavigationService.navigate('MainTourScreen')

          dispatch(toggleIsFirstLaunch(true));
          dispatch(toggleIsSkipLauch(true));
          NavigationService.navigate('AppTab');
        }}
        showSkipButton
        activeDotStyle={styles.activeDot}
        dotStyle={styles.inactiveDot}
        renderItem={renderItem}
        data={tutorialImagesList}
        showPrevButton={true}
        onDone={() => {
          // NavigationService.navigate('MainTourScreen')

          dispatch(toggleIsFirstLaunch(true));
          NavigationService.navigate('AppTab');
        }}
      />
    </Wrapper>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: getSize.w(12),
  },
  text: {
    color: orangeLight.colors.primary,
    // marginTop: getSize.h(160),
    fontSize: getSize.f(20),
    fontFamily: orangeLight.fonts.sfPro.bold,
  },
  textDescription: {
    color: orangeLight.colors.primary,
    fontSize: getSize.f(16),
    fontFamily: orangeLight.fonts.sfPro.bold,
    marginTop: getSize.w(4),
    textAlign: 'center',
  },
  activeDot: {
    backgroundColor: orangeLight.colors.primary,
    width: getSize.w(25),
  },
  inactiveDot: {
    width: getSize.w(14),
    backgroundColor: orangeLight.colors.grayLight,
  },
});

export default OnboardingScreen;
