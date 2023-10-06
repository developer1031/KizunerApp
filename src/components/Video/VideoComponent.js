import React, {useState, useRef, useEffect} from 'react';
import {TouchableOpacity, View, Dimensions} from 'react-native';
import {StyleSheet, Animated, StatusBar} from 'react-native';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/MaterialIcons';

import useTheme from 'theme';
import {getSize} from 'utils/responsive';
import VideoPlayer from './video-player';
import {Platform} from 'react-native';

import {
  hideNavigationBar,
  showNavigationBar,
} from 'react-native-navigation-bar-color';

import Orientation from 'react-native-orientation-locker';
import useAppState from 'utils/appState';

import orangeLight from '../../theme/orangeLight';

const WINDOW_HEIGHT = Dimensions.get('window').height;
const SCREEN_HEIGHT = Dimensions.get('screen').height;
const WINDOW_WIDTH = Dimensions.get('window').width;

const VideoPlayerMode = {
  Portrait: {
    Small: 'Portrait.Small',
    Normal: 'Portrait.Normal',
    Fullscreen: 'Portrait.Fullscreen',
  },
  Landscape: {
    Fullscreen: 'Landscape.Fullscreen',
  },
};

const VideoPlayerRatio = {
  Vertical: {
    Small: 1,
    Normal: 4 / 3,
  },
  Horizontal: {
    Normal: 9 / 16,
  },
};

const VideoType = {
  Vertical: 'Vertical',
  Horizontal: 'Horizontal',
};

const OrientationType = {
  Portrait: 'PORTRAIT',
  LandscapeLeft: 'LANDSCAPE-LEFT',
  LandscapeRight: 'LANDSCAPE-RIGHT',
  Landscape: 'LANDSCAPE',
  PortraitUpsidedown: 'PORTRAIT-UPSIDEDOWN',
  Unknown: 'UNKNOWN',
};

const isLandscapeOrientation = (orientation) => {
  return (
    orientation === OrientationType.LandscapeLeft ||
    orientation === OrientationType.LandscapeRight
  );
};

const getPlayerHeight = (videoPlayerMode, videoType) => {
  switch (videoPlayerMode) {
    case VideoPlayerMode.Portrait.Small:
      return VideoPlayerRatio.Vertical.Small * WINDOW_WIDTH;
    case VideoPlayerMode.Portrait.Normal:
      const videoRatio =
        videoType === VideoType.Horizontal
          ? VideoPlayerRatio.Horizontal.Normal
          : VideoPlayerRatio.Vertical.Normal;
      return WINDOW_WIDTH * videoRatio;
    case VideoPlayerMode.Portrait.Fullscreen:
      return Platform.OS === 'android' ? SCREEN_HEIGHT : WINDOW_HEIGHT;
    case VideoPlayerMode.Landscape.Fullscreen:
      return WINDOW_WIDTH;
    default:
      break;
  }
};

const AnimatedVideo = Animated.createAnimatedComponent(Video);

const VideoComponent = ({
  video,
  noBorder,
  style,
  onPress,
  resizeMode,
  styleVideo,
  repeat,
  rate,
  playButtonStyle,
  playArrowStyle,
  onHideControls,
  onShowControls,
  onStart,
  autoplay,
  onVideoProgress,
  controls,
  onSeeked,
  isHideControlBottom,
  pausedProps,
}) => {
  const theme = useTheme();
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const [isStarted, setIsStarted] = useState(autoplay);
  const [isShowPause, setIsShowPause] = useState(false);
  const [paused, setPaused] = useState(pausedProps ?? true);
  const [videoPlayerMode, setVideoPlayerMode] = useState(
    VideoPlayerMode.Portrait.Normal,
  );
  const [videoType, setVideoType] = useState(VideoType.Vertical);
  const [playerHeightAnimation, setPlayerHeightAnimation] = useState(
    new Animated.Value(getPlayerHeight(videoPlayerMode, videoType)),
  );

  const appState = useAppState();

  useEffect(() => {
    setPaused(true);
  }, [appState]);

  const styles = StyleSheet.create({
    background: {
      top: 0,
      borderBottomLeftRadius: noBorder ? 0 : getSize.h(30),
      borderBottomRightRadius: noBorder ? 0 : getSize.h(30),
    },
  });

  useEffect(() => {
    // Orientation.addOrientationListener(handleOrientationChange);
    // Orientation.addDeviceOrientationListener(onDeviceOrientationDidChange);
    // return () => {
    //   StatusBar.setHidden(false, 'fade');
    //   Orientation.getOrientation(orientation => {
    //     if (orientation !== OrientationType.Portrait) {

    //     }
    //   });
    //   Orientation.removeOrientationListener(handleOrientationChange);
    //   Orientation.removeDeviceOrientationListener(onDeviceOrientationDidChange);
    //   showNavigationBar();
    // };
    Orientation.lockToPortrait();
  }, []);

  function handleOrientationChange(orientation) {
    if (isLandscapeOrientation(orientation)) {
      if (videoPlayerMode !== VideoPlayerMode.Landscape.Fullscreen) {
        changeVideoPlayerMode(VideoPlayerMode.Landscape.Fullscreen, '');
      }
    } else {
      if (videoPlayerMode !== VideoPlayerMode.Portrait.Normal) {
        changeVideoPlayerMode(VideoPlayerMode.Portrait.Normal, '');
      }
    }
  }

  const handleVideoSeek = (time) => {};

  const onSeek = () => {};

  const onStartPress = () => {
    if (onStart) onStart();
    if (!isPlaying) {
      setIsPlaying(true);
      setIsStarted(true);
      setTimeout(() => {
        setIsShowPause(true);
      }, 200);
    } else {
      setIsPlaying(false);
      setIsStarted(false);
    }
  };

  const renderStartButton = () => {
    if (!isPlaying) {
      return (
        <View style={stylesMain.contextPlayButton}>
          <TouchableOpacity
            style={[stylesMain.playButton, playButtonStyle]}
            onPress={onStartPress}>
            <Icon
              style={[stylesMain.playArrow, playArrowStyle]}
              name="play-arrow"
              size={getSize.w(36)}
            />
          </TouchableOpacity>
        </View>
      );
    }

    return (
      isShowPause && (
        <View style={[stylesMain.contextPlayButton]}>
          <TouchableOpacity
            style={[
              stylesMain.playButton,
              playButtonStyle,
              isShowPause ? stylesMain.transparent : {},
            ]}
            onPress={onStartPress}>
            <Icon
              style={[
                stylesMain.playArrow,
                playArrowStyle,
                isShowPause ? stylesMain.transparent : {},
              ]}
              name="pause"
              size={getSize.w(36)}
            />
          </TouchableOpacity>
        </View>
      )
    );
  };

  function handleFullScreenButtonPress() {
    setPaused(true);
    onPress();
    // if (videoType == VideoType.Vertical) {
    //   if (videoPlayerMode === VideoPlayerMode.Portrait.Fullscreen) {
    //     if (Platform.OS === 'android') {
    //       StatusBar.setHidden(false, 'fade');
    //       showNavigationBar();
    //     }
    //     InteractionManager.runAfterInteractions(() => {
    //       changeVideoPlayerMode(VideoPlayerMode.Portrait.Normal, '');
    //     });
    //   } else {
    //     if (Platform.OS === 'android') {
    //       StatusBar.setHidden(true, 'fade');
    //       hideNavigationBar();
    //     }
    //     InteractionManager.runAfterInteractions(() => {
    //       changeVideoPlayerMode(VideoPlayerMode.Portrait.Fullscreen, '');
    //     });
    //   }
    // } else {
    //   if (videoPlayerMode === VideoPlayerMode.Portrait.Fullscreen) {
    //     changeVideoPlayerMode(VideoPlayerMode.Portrait.Normal, '');
    //   } else {
    //     if (videoPlayerMode === VideoPlayerMode.Landscape.Fullscreen) {
    //       changeVideoPlayerMode(
    //         VideoPlayerMode.Portrait.Normal,
    //         OrientationType.Portrait,
    //       );
    //     } else {
    //       changeVideoPlayerMode(
    //         VideoPlayerMode.Landscape.Fullscreen,
    //         OrientationType.Landscape,
    //       );
    //     }
    //   }
    // }
  }

  function changeVideoPlayerMode(videoPlayerMode, orientation) {
    // setVideoPlayerMode(videoPlayerMode);
    // switch (orientation) {
    //   case OrientationType.Portrait:
    //     Orientation.lockToPortrait();
    //     StatusBar.setHidden(false, 'fade');
    //     showNavigationBar();
    //     break;
    //   case OrientationType.LandscapeLeft:
    //     Orientation.lockToLandscapeLeft();
    //     StatusBar.setHidden(true, 'fade');
    //     hideNavigationBar();
    //   case OrientationType.LandscapeRight:
    //     Orientation.lockToLandscapeRight();
    //     StatusBar.setHidden(true, 'fade');
    //     hideNavigationBar();
    //   case OrientationType.Landscape:
    //     Orientation.lockToLandscape();
    //     StatusBar.setHidden(true, 'fade');
    //     hideNavigationBar();
    //   default:
    //     break;
    // }
  }

  function changePausedStatus() {
    setPaused(!paused);
  }

  function changeDeviceOrientation(autoRotate, deviceOrientation) {
    if (autoRotate) {
      switch (deviceOrientation) {
        case OrientationType.Portrait:
          changeVideoPlayerMode(
            VideoPlayerMode.Portrait.Normal,
            OrientationType.Portrait,
          );
          break;
        case OrientationType.LandscapeLeft:
          if (
            videoType === VideoType.Horizontal ||
            videoPlayerMode === VideoPlayerMode.Portrait.Fullscreen
          ) {
            Orientation.getOrientation((orientation) => {
              if (orientation !== OrientationType.LandscapeLeft) {
                changeVideoPlayerMode(
                  VideoPlayerMode.Landscape.Fullscreen,
                  OrientationType.LandscapeLeft,
                );
              }
            });
          }
          break;
        case OrientationType.LandscapeRight:
          if (
            videoType === VideoType.Horizontal ||
            videoPlayerMode === VideoPlayerMode.Portrait.Fullscreen
          ) {
            Orientation.getOrientation((orientation) => {
              if (orientation !== OrientationType.LandscapeRight) {
                changeVideoPlayerMode(
                  VideoPlayerMode.Landscape.Fullscreen,
                  OrientationType.LandscapeRight,
                );
              }
            });
          }
          break;
        default:
          break;
      }
    }
  }

  function onDeviceOrientationDidChange(orientation) {
    if (
      videoType === VideoType.Horizontal ||
      videoPlayerMode === VideoPlayerMode.Landscape.Fullscreen ||
      videoPlayerMode === VideoPlayerMode.Portrait.Fullscreen
    ) {
      Orientation.getAutoRotateState((autoRotate) => {
        changeDeviceOrientation(autoRotate, orientation);
      });
    }
  }

  const isMounted = useRef(true); // Initial value isMounted = true

  useEffect(() => {
    return () => {
      // ComponentWillUnmount in Class Component
      isMounted.current = false;
    };
  }, []);

  //Note on iOS, controls are always shown when in fullscreen mode.
  return (
    <TouchableOpacity
      ref={isMounted}
      style={[styles.background, style]}
      onPress={onPress}
      activeOpacity={1}>
      <VideoPlayer
        playerData={{
          sourceLink: video.uri,
        }}
        changePausedStatus={changePausedStatus}
        paused={paused}
        onFullScreenButtonPress={handleFullScreenButtonPress}
        style={stylesMain.container}
        resizeMode={'strech'}
        isHideControlBottom={isHideControlBottom}
      />
    </TouchableOpacity>
  );
};

const stylesMain = StyleSheet.create({
  videoContext: {
    width: '100%',
    height: '100%',
  },
  playButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    width: getSize.h(46),
    height: getSize.h(46),
    borderRadius: getSize.h(23),
    justifyContent: 'center',
    alignItems: 'center',
  },
  playArrow: {
    color: orangeLight.colors.primary,
  },
  contextPlayButton: {
    position: 'absolute',
    zIndex: 1000,
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  transparent: {
    backgroundColor: 'transparent',
    color: 'transparent',
  },
  container: {
    flex: 1,
  },
});

export default VideoComponent;
