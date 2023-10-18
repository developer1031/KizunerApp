import * as React from 'react';
import {Animated, StyleSheet, AppState} from 'react-native';

import PlayControl from './player-control';
import Player from './player';

import ImageButton from './image-button';
import {images} from './images';
import {getSize} from 'utils/responsive';

const _ = require('lodash');

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

export interface IVideoPlayerStates {
  videoPlayerLoading: boolean;
}

export interface IVideoPlayerProps {
  recommendationId?: string;
  fromStartSource: string;
  subRefVideo: string;
  akamaiConfigPath: string;
  currentUserId: string;
  currentProfileId: string;
  paused: boolean;
  playerData: any;
  playerError: any;
  videoAdsPositions: any;
  currentTimeClock: number;
  isSliding: boolean;
  transactionId: string;
  duration: number;
  videoAdsCurrentPosition: string;
  style: any;
  title: string;
  isFavorite: boolean;
  playerHeightAnimation: any;
  videoPlayerMode: any;
  nextVideoList: any;
  hidePreviousButton: boolean;
  hideNextButton: boolean;
  resizeMode: any;
  requestingVideo: boolean;
  currentTime: number;
  playableDuration: number;
  videoAdsUrl: string;
  videoAdsPlaying: boolean;
  videoAdsLoading: boolean;

  getAppInfoResult?: any;

  liveStreamEventLoading?: any;
  liveStreamEventData?: any;
  liveStreamEventError?: any;
  isLiveStream?: boolean;

  onPressAddFavorite: () => void;
  onPressRemoveFavorite: () => void;

  onFullScreenButtonPress: () => void;
  onBackButtonPress: () => void;

  onNextButtonPress: () => void;
  onPreviousButtonPress: () => void;
  onItemPress: () => void;

  setVideoAdsUrl: (url: string, videoAds: any) => void;
  removeVideoAds: (data: any) => void;
  updateCurrentTimeClock: (time: number) => void;
  seekToTime: (currentTime: number, playableDuration: number) => void;
  slidingVideo: (isSliding: boolean, time?: number) => void;
  changePausedStatus: (paused: boolean) => void;

  onVideoPlayerEnded: () => void;
  onVideoPlayerLoaded: (event: any) => void;
  onVideoPlayerError: (event: any) => void;

  videoPlayerAdsStart: () => void;
  videoPlayerAdsEnd: () => void;
  videoPlayerError: (error: any, videoUri: any, shouldRetry: boolean) => void;
  videoPlayerLoaded: (event: any) => void;
  videoPlayerStartLoad: () => void;
  videoPlayerChangeLoadingStatus: (loading: boolean) => void;
  videoPlayerEnded: () => void;
  resetDataVideoPlayer: () => void;

  onAdsComplete: (event: any) => void;
  onAdsLoaded: (event: any) => void;
  updateVideoAdsTimeoutStatus: (status: boolean) => void;

  logVideoStart: (
    videoID: string,
    fromStartSource: string,
    source: string,
    supplier: string,
    profileID: string,
  ) => void;
  logUpdateViewVideo: (
    transactionID: string,
    nSec: number,
    percent: number,
    profileID: string,
    videoID: string,
  ) => void;
  onLiveStreamToolBarPress?: (item: any) => void;

  isHideControlBottom: boolean;
}

class VideoPlayer extends React.Component<
  IVideoPlayerProps,
  IVideoPlayerStates
> {
  private video: any;
  constructor(props: IVideoPlayerProps) {
    super(props);
    this.videoRef = this.videoRef.bind(this);
    this.handlePlayButtonPress = this.handlePlayButtonPress.bind(this);
    this.handleVideoProgress = this.handleVideoProgress.bind(this);
    this.handleVideoPlayerStartLoad =
      this.handleVideoPlayerStartLoad.bind(this);
    this.handleVideoPlayerEnded = this.handleVideoPlayerEnded.bind(this);
    this.handleVideoLoaded = this.handleVideoLoaded.bind(this);
    this.handleVideoPlayerError = this.handleVideoPlayerError.bind(this);
    this.handleVideoBuffer = this.handleVideoBuffer.bind(this);
    this.handleVideoSeeked = this.handleVideoSeeked.bind(this);

    this.handleAppStateChange = this.handleAppStateChange.bind(this);
    this.state = {
      videoPlayerLoading: false,
    };
  }

  videoRef(ref: any) {
    this.video = ref;
  }

  getAdsBackButtonStyle() {
    const {videoPlayerMode} = this.props;
    return [
      {position: 'absolute'},
      videoPlayerMode === VideoPlayerMode.Landscape.Fullscreen
        ? {
            top: getSize.h(4),
            left: getSize.h(4),
          }
        : {
            top: getSize.w(4),
            left: getSize.w(4),
          },
    ];
  }

  getVideoUri() {
    const {playerData} = this.props;
    return playerData.sourceLink || '';
  }

  getLastPlayedTime(videoData: any) {
    const {videoInfo = {}} = videoData;
    const {lastPlayedTime} = videoInfo;
    return lastPlayedTime > 0 ? lastPlayedTime : 0;
  }

  playerSeekToTime(time: number) {
    if (this.video) {
      this.video.seek(time);
    }
  }

  handleAppStateChange(nextAppState: any) {
    const {changePausedStatus} = this.props;
    if (nextAppState.match(/inactive|background/)) {
      changePausedStatus(true);
    }
  }

  handleVideoBuffer() {
    // const {videoPlayerChangeLoadingStatus, paused} = this.props;
    // if (!paused) {
    //   videoPlayerChangeLoadingStatus(true);
    // }
  }

  handlePlayButtonPress() {
    const {changePausedStatus, paused} = this.props;
    changePausedStatus(!paused);
  }

  handleVideoPlayerStartLoad() {
    this.setState({
      videoPlayerLoading: true,
    });
    // const {playerData, videoPlayerStartLoad} = this.props;
    // //const lastPlayedTime = this.getLastPlayedTime(playerData);
    // videoPlayerStartLoad && videoPlayerStartLoad();
  }

  handleVideoLoaded(event: any) {
    const {duration} = event;
    this.setState({
      videoPlayerLoading: false,
    });
  }

  handleVideoPlayerError(error: any) {
    return;
  }

  handleVideoProgress(progress: any) {}

  handleVideoSeeked(data: any) {
    const {seekTime} = data;
    const {slidingVideo} = this.props;
    slidingVideo(false, seekTime);
  }

  handleVideoPlayerEnded() {
    // this.setState({
    //   videoPlayerLoading: false,
    // });
    const {
      onVideoPlayerEnded,
      videoAdsPositions,
      changePausedStatus,
      videoPlayerEnded,
    } = this.props;
    videoPlayerEnded && videoPlayerEnded();
    let videoAds = _.find(videoAdsPositions, function (obj) {
      return obj.position === 'postroll';
    });
    if (videoAds) {
      this.handleSetVideoAds(videoAds);
    } else {
      // changePausedStatus(true);
      onVideoPlayerEnded && onVideoPlayerEnded();
    }
  }

  // Handle video ads event
  handleSetVideoAds = async (videoAds: any) => {};

  componentDidMount() {
    AppState.addEventListener('change', this.handleAppStateChange);
  }

  componentWillUnmount() {}

  render() {
    const {
      style,

      onPressAddFavorite,
      onPressRemoveFavorite,

      playerHeightAnimation,
      onFullScreenButtonPress,
      onBackButtonPress,
      videoPlayerMode,

      onNextButtonPress,
      onPreviousButtonPress,
      onItemPress,

      resizeMode,
      requestingVideo,
      duration,
      currentTime,
      paused,
      playableDuration,
      isHideControlBottom,
      onLiveStreamToolBarPress,
    } = this.props;
    const videoUri = this.getVideoUri();
    //'https://source.kizuner.com/assets/Skype_Video.mp4'; //
    const adsButtonStyle = this.getAdsBackButtonStyle();
    return (
      <Animated.View
        style={[styles.container, style, {height: playerHeightAnimation}]}>
        {!!videoUri && (
          <Player
            resizeMode={resizeMode}
            videoRef={this.videoRef}
            paused={paused}
            uri={videoUri}
            onLoadStartPlayer={this.handleVideoPlayerStartLoad}
            onLoadPlayer={this.handleVideoLoaded}
            onProgress={this.handleVideoProgress}
            onBuffer={this.handleVideoBuffer}
            onEndPlayer={this.handleVideoPlayerEnded}
            onErrorPlayer={
              this.handleVideoPlayerError && this.handleVideoPlayerError
            }
            // onSeeked={this.handleVideoSeeked}
          />
        )}
        <PlayControl
          paused={paused}
          currentTime={currentTime}
          duration={duration}
          playableDuration={playableDuration}
          loading={this.state.videoPlayerLoading}
          onPressAddFavorite={onPressAddFavorite}
          onPressRemoveFavorite={onPressRemoveFavorite}
          videoPlayerMode={videoPlayerMode}
          style={styles.playControl}
          onFullScreenButtonPress={onFullScreenButtonPress}
          onBackButtonPress={onBackButtonPress}
          onNextButtonPress={onNextButtonPress}
          onPreviousButtonPress={onPreviousButtonPress}
          onPlayButtonPress={this.handlePlayButtonPress}
          onItemPress={onItemPress}
          onLiveStreamToolBarPress={onLiveStreamToolBarPress}
          isHideControlBottom={isHideControlBottom}
        />
        {onBackButtonPress && (
          <ImageButton
            style={adsButtonStyle}
            image={images.video.backIcon}
            tintColor={'black'}
            onPress={onBackButtonPress}
          />
        )}
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    width: '100%',
  },
  playControl: {
    flex: 1,
  },
  playerErrorContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playerError: {
    color: 'white',
    marginHorizontal: getSize.w(30),
    textAlign: 'center',
  },
});

export default VideoPlayer;
