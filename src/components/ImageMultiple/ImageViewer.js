import {StyleSheet, Text, View} from 'react-native';
import React, {
  forwardRef,
  memo,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import {Modal} from 'react-native';
import {Dimensions} from 'react-native';
import {Button} from 'react-native';
import {gestureHandlerRootHOC} from 'react-native-gesture-handler';
import {ScrollView} from 'react-native';
import ImagePath from './ImagePath';
import Video from 'react-native-video';
import {isVideoType} from 'utils/fileTypes';
import {Image} from 'react-native';
import {TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {TouchableWithoutFeedback} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import {getSize} from 'utils/responsive';
import {orangeLight} from 'theme';

const {width, height} = Dimensions.get('screen');

const ImageViewer = forwardRef(({data}, ref) => {
  const [visible, setVisible] = useState(false);
  const refScrollView = useRef(null);

  const medias = Array.isArray(data) ? data : [data];

  const scrollTo = (index) => {
    setTimeout(() => {
      const scrollX = width * index;
      refScrollView.current?.scrollTo({x: scrollX, animated: true});
    }, 0);
  };
  const open = (index) => {
    // setCurrIndex(prev => (prev = index))
    setVisible((prev) => (prev = true));

    if (!index || (Array.isArray(data) && data.length < 2)) {
      return;
    }

    scrollTo(index);
  };
  const close = () => setVisible((prev) => (prev = false));

  const ImageViewerWithGestureHandler = useMemo(
    () =>
      gestureHandlerRootHOC(() => (
        <ScrollView
          ref={refScrollView}
          horizontal
          pagingEnabled
          bounces={false}
          removeClippedSubviews
          contentContainerStyle={{alignItems: 'center'}}>
          {medias.map((media) =>
            isVideoType(media.path) ? (
              <VideoCustom
                key={media.path.toString()}
                source={media.path}
                thumb={media.thumb}
              />
            ) : (
              <ImagePath
                key={media.path.toString()}
                source={media.path}
                style={styles.image}
                resizeMode="contain"
              />
            ),
          )}
        </ScrollView>
      )),
    [medias],
  );

  useImperativeHandle(
    ref,
    () => ({
      open,
      close,
      scrollTo,
    }),
    [open, scrollTo],
  );

  return (
    <Modal
      statusBarTranslucent={true}
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={close}>
      <View style={styles.background} />

      <View style={styles.close} onTouchEnd={close}>
        <Text style={{color: 'white', fontSize: 15}}>Close</Text>
      </View>

      <ImageViewerWithGestureHandler />
    </Modal>
  );
});

const VideoCustom = memo(({source, thumb}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [paused, setPaused] = useState(true);

  return (
    <>
      <Image
        source={{uri: thumb}}
        resizeMode="contain"
        style={[
          styles.image,
          {
            display: isLoading ? 'flex' : 'none',
          },
        ]}
      />

      <TouchableWithoutFeedback
        onPress={() => setPaused((prev) => (prev = !prev))}>
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <Video
            source={{uri: source}}
            paused={paused}
            removeClippedSubviews
            playInBackground={false}
            playWhenInactive={false}
            style={[
              styles.image,
              {
                display: isLoading ? 'none' : 'flex',
              },
            ]}
            resizeMode="contain"
            onLoadStart={() => setIsLoading(true)}
            onLoad={() => setIsLoading(false)}
          />

          {paused && (
            <Entypo
              name="controller-play"
              size={getSize.w(40)}
              color={orangeLight.colors.primary}
              style={{
                position: 'absolute',
              }}
            />
          )}
        </View>
      </TouchableWithoutFeedback>
    </>
  );
});

const styles = StyleSheet.create({
  background: {
    ...StyleSheet.absoluteFillObject,

    backgroundColor: '#000000dd',
  },
  image: {
    width,
    height,
  },
  close: {
    position: 'absolute',
    right: 0,
    top: 50,
    padding: 10,
    zIndex: 1,
  },
});

export default ImageViewer;
