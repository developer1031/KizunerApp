import * as React from 'react';
import {
  Animated,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import {getSize} from 'utils/responsive';
import {images} from './images';
import ImageButton from './image-button';
import {isIPhoneX} from 'react-native-status-bar-height';

import orangeLight from '../../theme/orangeLight';

const CENTER_BUTTON_SIZE = 22;
const PLAY_BUTTON_SIZE = CENTER_BUTTON_SIZE * 1.2;

const CENTER_BUTTON_FULLSCREEN_SIZE = CENTER_BUTTON_SIZE * 1.5;
const PLAY_BUTTON_FULLSCREEN_SIZE = CENTER_BUTTON_FULLSCREEN_SIZE * 1.2;

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

const ControlButton = (props) => {
  const {tintColor, image, style, ...otherProps} = props;

  return (
    <TouchableOpacity
      hitSlop={{
        top: getSize.h(6),
        left: getSize.h(6),
        bottom: getSize.h(6),
        right: getSize.h(6),
      }}
      style={[styles.centerButton, style]}
      {...otherProps}>
      <Image
        style={[styles.centerButtonImage, {tintColor}]}
        resizeMode={'contain'}
        source={image}
      />
    </TouchableOpacity>
  );
};

class PlayerControl extends React.Component {
  constructor(props) {
    super(props);
    const opacityAnimation = new Animated.Value(0);
    this.state = {
      opacityAnimation,
      hideControl: true,
    };

    this.handleBackgroundControlPress =
      this.handleBackgroundControlPress.bind(this);
    this.handleAnimationChangeValue =
      this.handleAnimationChangeValue.bind(this);
    this.handleFullscreenButtonPress =
      this.handleFullscreenButtonPress.bind(this);
    opacityAnimation.addListener(this.handleAnimationChangeValue);
  }

  isLandscapeMode() {
    const {videoPlayerMode} = this.props;
    return videoPlayerMode === VideoPlayerMode.Landscape.Fullscreen;
  }

  getFullScreenImage() {
    const {videoPlayerMode} = this.props;
    return videoPlayerMode === VideoPlayerMode.Landscape.Fullscreen ||
      videoPlayerMode === VideoPlayerMode.Portrait.Fullscreen
      ? images.video.player.existFullScreen
      : images.video.player.fullscreen;
  }

  handleFullscreenButtonPress() {
    const {onFullScreenButtonPress} = this.props;
    this.animationHideControl(() => {
      onFullScreenButtonPress && onFullScreenButtonPress();
    });
  }

  clearAnimationTimeout() {
    clearTimeout(this.animationTimeout);
    this.animationTimeout = null;
  }

  handleAnimationChangeValue({value}) {
    if (value !== 0) {
      this.setState({hideControl: false});
    } else {
      this.setState({hideControl: true});
    }
  }

  handleBackgroundControlPress() {
    const {opacityAnimation} = this.state;
    this.clearAnimationTimeout();
    if (opacityAnimation._value === 0) {
      this.animationShowControl();
    } else {
      this.animationHideControl();
    }
  }

  animationShowControl() {
    const {opacityAnimation} = this.state;
    const self = this;
    Animated.timing(opacityAnimation, {toValue: 1, duration: 300}).start(() => {
      self.animationTimeout = setTimeout(() => {
        self.animationHideControl();
      }, 3000);
    });
  }

  animationHideControl(finished = () => {}) {
    const {opacityAnimation} = this.state;
    Animated.timing(opacityAnimation, {toValue: 0, duration: 300}).start(
      finished,
    );
  }

  componentWillUnmount() {
    const {opacityAnimation} = this.state;
    opacityAnimation.removeAllListeners();
  }

  renderTopControl() {
    const {style, onBackButtonPress, videoPlayerMode} = this.props;
    const topPadding = this.isLandscapeMode()
      ? {
          paddingHorizontal: getSize.w(10),
          paddingTop: getSize.w(10),
        }
      : {};

    return (
      <View
        style={[styles.topContainer, topPadding, {marginTop: getSize.w(40)}]}>
        {/* <ImageButton
          style={styles.backButton}
          image={images.video.backIcon}
          tintColor={style.tintColor}
          onPress={onBackButtonPress}
        /> */}
      </View>
    );
  }

  renderCenterControl() {
    const {style, onPlayButtonPress, loading, paused} = this.props;
    const playButtonStyle = [styles.playButton];
    if (this.isLandscapeMode()) {
      playButtonStyle.push(styles.playButtonFullScreen);
    }

    return (
      <View style={styles.centerContainer}>
        <View style={styles.centerControlContainer}>
          {loading ? (
            <View style={playButtonStyle} />
          ) : (
            <ControlButton
              style={playButtonStyle}
              image={
                paused
                  ? images.video.player.playBtn
                  : images.video.player.pauseBtn
              }
              onPress={onPlayButtonPress}
            />
          )}
        </View>
      </View>
    );
  }

  getPaddingBottomHeight = () => {
    const {videoPlayerMode} = this.props;
    if (videoPlayerMode === VideoPlayerMode.Portrait.Fullscreen) {
      if (isIPhoneX()) {
        return 40;
      }
      if (Platform.OS === 'android') {
        return getSize.w(40);
      }
    }
    return getSize.w(10);
  };

  renderBottomControl() {
    const {duration, currentTime, style, videoPlayerMode} = this.props;
    const bottomPadding = this.isLandscapeMode()
      ? {
          paddingHorizontal: getSize.w(20),
        }
      : {
          paddingHorizontal: getSize.w(10),
          paddingBottom: this.getPaddingBottomHeight(),
        };
    return (
      <View style={[styles.bottomContainer, bottomPadding]}>
        <ImageButton
          style={styles.fullscreenButton}
          onPress={this.handleFullscreenButtonPress}
          image={this.getFullScreenImage()}
          tintColor={style.tintColor}
        />
      </View>
    );
  }

  render() {
    const {style, loading, paused, isHideControlBottom, adsPlaying} =
      this.props;
    const {opacityAnimation, hideControl} = this.state;
    const opacity = paused ? 1 : opacityAnimation;
    const {
      playerBackground1,
      playerBackground2,
      playerBackground3,
      playerBackground4,
    } = style;
    return (
      <View style={[styles.container, style]}>
        {loading && (
          <ActivityIndicator
            style={styles.loading}
            color={orangeLight.colors.primary}
            size={'large'}
          />
        )}
        <Animated.View style={[styles.opacityContainer, {opacity}]}>
          <TouchableOpacity
            activeOpacity={1.0}
            style={styles.touchareaBackground}
            onPress={this.handleBackgroundControlPress}>
            {this.renderTopControl()}
            {!adsPlaying && this.renderCenterControl()}
            {!isHideControlBottom && this.renderBottomControl()}

            {!paused && hideControl && (
              <TouchableOpacity
                style={styles.hiddenButton}
                onPress={this.handleBackgroundControlPress}
              />
            )}
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {},
  opacityContainer: {
    flex: 1,
  },
  loading: {
    ...StyleSheet.absoluteFillObject,
  },
  linearGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  touchareaBackground: {
    flex: 1,
  },
  horizontalList: {
    flexGrow: 0,
    marginLeft: getSize.w(20),
    marginBottom: getSize.w(20),
  },
  hiddenButton: {
    ...StyleSheet.absoluteFillObject,
  },

  imageButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: getSize.w(22),
    height: getSize.w(22),
  },

  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerControlContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  centerButton: {
    height: getSize.w(CENTER_BUTTON_SIZE),
    width: getSize.w(CENTER_BUTTON_SIZE),
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerButtonImage: {
    width: '100%',
    height: '100%',
  },
  playButton: {
    height: getSize.w(PLAY_BUTTON_SIZE),
    width: getSize.w(PLAY_BUTTON_SIZE),
    marginHorizontal: getSize.w(50),
  },
  centerButtonFullScreen: {
    height: getSize.w(CENTER_BUTTON_FULLSCREEN_SIZE),
    width: getSize.w(CENTER_BUTTON_FULLSCREEN_SIZE),
  },
  playButtonFullScreen: {
    height: getSize.w(PLAY_BUTTON_FULLSCREEN_SIZE),
    width: getSize.w(PLAY_BUTTON_FULLSCREEN_SIZE),
    marginHorizontal: getSize.w(100),
  },

  topContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  topCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: getSize.w(10),
  },
  backButton: {
    padding: getSize.w(10),
  },
  topRightContainer: {
    flexDirection: 'row',
    paddingRight: getSize.w(12),
  },

  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: getSize.w(10),
  },
  sliderContainer: {
    flex: 1,
  },
  slider: {
    flex: 1,
    height: getSize.w(20),
  },
  track: {
    height: 2,
    backgroundColor: orangeLight.colors.bgOverlay,
  },

  thumbSlider: {
    width: getSize.w(10),
    height: getSize.w(10),
    backgroundColor: orangeLight.colors.bgOverlay,
    borderRadius: getSize.w(20) / 2,
  },
  sliderThumbSize: {width: getSize.w(20), height: getSize.w(20)},
  timeText: {
    marginHorizontal: getSize.w(10),
  },
  fullscreenButton: {
    padding: 6,
  },
  sliderBarContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
  },
  sliderBar: {
    height: 2,
    backgroundColor: orangeLight.colors.shadow,
  },
  seekableBar: {
    height: 2,
  },
  liveStreamContent: {
    position: 'absolute',
    left: getSize.w(20),
    bottom: getSize.w(20),
  },
  toolbarItem: {
    marginLeft: getSize.w(30),
  },
  liveStreamToolBar: {
    justifyContent: 'flex-end',
    margin: getSize.w(20),
  },
});

export default PlayerControl;
