import React from 'react';
import {StyleSheet, View} from 'react-native';
import YouTube from 'react-native-youtube';
import {useIsFocused} from '@react-navigation/native';

import {GOOGLE_API_KEY} from 'utils/constants';
import {Wrapper, HeaderSearch} from 'components';
import {getSize} from 'utils/responsive';

const GuideVideoScreen = ({route}) => {
  const {videoId, label} = route.params;
  const isFocused = useIsFocused();
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#000',
    },
    youtube: {
      alignSelf: 'stretch',
      height: getSize.h(300),
    },
  });

  return (
    <Wrapper>
      <HeaderSearch placeholder={label} />
      <View style={styles.container}>
        {isFocused && (
          <YouTube
            apiKey={GOOGLE_API_KEY}
            videoId={videoId || 'KVZ-P-ZI6W4'}
            play
            style={styles.youtube}
            origin="http://www.youtube.com"
          />
        )}
      </View>
    </Wrapper>
  );
};

export default GuideVideoScreen;
