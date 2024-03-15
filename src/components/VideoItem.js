import React, {useCallback, useEffect} from 'react';
import {StyleSheet, View, ImageBackground, Dimensions} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Placeholder, PlaceholderMedia, Fade} from 'rn-placeholder';
// import axios from 'axios';
// import moment from 'moment';

import useTheme from 'theme';
import {getSize} from 'utils/responsive';
import {Touchable, Text} from 'components';
import {getYoutubeId} from 'utils/mixed';
// import {GOOGLE_API_KEY} from 'utils/constants';

const width = Dimensions.get('window').width;

const CARD_HEIGHT = getSize.h(168);

export const VideoPlaceholder = () => {
  const styles = StyleSheet.create({
    video: {
      width: width - getSize.w(24 * 2),
      height: CARD_HEIGHT,
      borderRadius: getSize.h(10),
      overflow: 'hidden',
      marginHorizontal: getSize.h(5),
      marginVertical: getSize.w(5),
    },
  });

  return (
    <Placeholder Animation={Fade}>
      <PlaceholderMedia style={styles.video} />
    </Placeholder>
  );
};

const VideoItem = ({wrapperStyle, subWrapper, data}) => {
  const theme = useTheme();
  const navigation = useNavigation();

  const styles = StyleSheet.create({
    overflow: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0,0,0,0.3)',
    },
    wrapper: {
      width: width - getSize.w(24 * 2),
    },
    contentVideo: {
      height: CARD_HEIGHT,
      width: '100%',
      // paddingHorizontal: getSize.w(63),
      borderRadius: getSize.h(10),
      ...theme.shadow.small.ios,
      ...theme.shadow.small.android,
      backgroundColor: theme.colors.grayLight,
      overflow: 'hidden',
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      fontSize: getSize.f(18),
      lineHeight: getSize.h(20),
      fontFamily: theme.fonts.sfPro.bold,
      paddingHorizontal: getSize.w(8),
    },
    category: {
      fontFamily: theme.fonts.sfPro.bold,
      textAlign: 'center',
      marginRight: 8,
    },
    timeWrap: {
      position: 'absolute',
      height: getSize.h(21),
      borderRadius: getSize.h(21 / 2),
      paddingHorizontal: getSize.w(8),
      right: getSize.w(10),
      bottom: getSize.h(10),
      backgroundColor: theme.colors.grayDark,
      justifyContent: 'center',
      alignItems: 'center',
    },
    cateWrap: {
      paddingHorizontal: getSize.w(8),
      alignItems: 'center',
      flexDirection: 'row',
      marginVertical: 4,
    },
    timeText: {
      fontSize: getSize.f(10),
      color: theme.colors.textContrast,
    },
  });

  const onNavigate = useCallback(() => {
    navigation.navigate('GuideVideo', {
      videoId: getYoutubeId(data.url),
      label: data.text,
    });
  }, []);

  return (
    <Touchable
      onPress={onNavigate}
      style={[wrapperStyle, styles.wrapper]}
      activeOpacity={1}>
      <ImageBackground
        source={{
          uri: data.cover,
        }}
        style={[styles.contentVideo, subWrapper]}>
        <View style={styles.overflow} />

        <View style={styles.timeWrap}>
          <Text style={styles.timeText}>{data.duration}</Text>
        </View>
      </ImageBackground>

      <View style={styles.cateWrap}>
        {data?.categories?.map((category, i) => (
          <Text key={i} numberOfLines={1} style={styles.category}>
            {'#'}
            {category?.name}
          </Text>
        ))}
      </View>
      <Text style={styles.title}>{data.text}</Text>
    </Touchable>
  );
};

export default VideoItem;

// const [duration, setDuration] = useState(null);

// const processDuration = d =>
//   moment
//     .duration(d)
//     .format('h:mm:ss')
//     .padStart(4, '0:0');

// const getVideoDuration = async () => {
//   try {
//     const result = await axios.get(
//       `https://www.googleapis.com/youtube/v3/videos?id=${getYoutubeId(
//         data.url,
//       )}&part=contentDetails&key=${GOOGLE_API_KEY}`,
//     );
//     const videoDuration = processDuration(
//       result?.data?.items?.[0]?.contentDetails?.duration,
//     );
//     if (videoDuration) {
//       setDuration(videoDuration);
//     }
//   } catch (error) {
//     console.log(error.message);
//   }
// };

// useEffect(() => {
//   getVideoDuration();
// }, []);
