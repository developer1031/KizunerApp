import React, {useEffect} from 'react';
import {SafeAreaView, BackHandler} from 'react-native';

import {VideoPlayerMain} from 'components';
import Orientation from 'react-native-orientation-locker';
import {View} from 'react-native';

const VideoScreen = ({navigation, route}) => {
  const {selected} = route.params;

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', () => true);
    return () =>
      BackHandler.removeEventListener('hardwareBackPress', () => true);
  }, []);

  useEffect(() => {
    Orientation.lockToPortrait();
  }, []);

  return (
    <View style={{flex: 1, backgroundColor: 'black'}}>
      <SafeAreaView style={{flex: 1}}>
        {selected?.path && (
          <VideoPlayerMain
            controlAnimationTiming={450}
            paused={true}
            onBack={() => {
              Orientation.lockToPortrait();
              navigation.goBack();
            }}
            navigation={navigation}
            source={{uri: selected?.path}}
          />
        )}
      </SafeAreaView>

      {/* <Touchable onPress={navigation.goBack} style={styles.backBtn}>
        <MaterialCommunityIcons
          name="chevron-left"
          size={getSize.f(34)}
          color={theme.colors.primary}
        />
      </Touchable>
      <VideoComponent
        noBorder={true}
        isHideControlBottom={true}
        style={styles.video}
        video={video}
      /> */}
    </View>
  );
};

export default VideoScreen;
