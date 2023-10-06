import * as React from 'react';
import {StyleSheet, Platform} from 'react-native';
import Video from 'react-native-video';

export interface IPlayerProps {
  uri: string;
  resizeMode?: string;
  paused?: boolean;
  urlAds?: string;
  style?: any;
  timeOut?: number;
  videoRef?: any;
  akamaiConfig?: any;
  onLoadStartPlayer?: () => void;
  onLoadPlayer: (data: any) => void;

  onEndPlayer: () => void;
  onErrorPlayer?: (error?: any) => void;

  onAudioFocusChanged?: () => void;
  onSeek?: (data: any) => void;
  onProgress?: (data: any) => void;
  onBuffer?: (data: any) => void;
  onSeeked?: (data: any) => void;
}

interface IPlayerState {
  isTimeOut: boolean;
}

class Player extends React.PureComponent<IPlayerProps, IPlayerState> {
  private video: any;
  private onLoadStartTime: any;
  private timeOutTimer: any;

  constructor(props: IPlayerProps) {
    super(props);
    this.state = {
      isTimeOut: false,
    };

    this.onLoadStartTime = null;

    this._onLoad = this._onLoad.bind(this);
    this._onLoadStart = this._onLoadStart.bind(this);
    this._onErrorPlayer = this._onErrorPlayer.bind(this);
    this._onBuffer = this._onBuffer.bind(this);
    this._onProgress = this._onProgress.bind(this);
    this._onSeek = this._onSeek.bind(this);
  }

  componentDidMount() {
    // if (this.props.urlAds && this.video.requestAds) {
    //   this.video.requestAds(this.props.urlAds);
    // }
  }

  UNSAFE_componentWillReceiveProps = (newProps: IPlayerProps) => {
    // if (newProps.urlAds && this.props.urlAds != newProps.urlAds) {
    //   this.video.requestAds(newProps.urlAds);
    // }
  };

  componentWillUnmount() {
    this._clearnTimeOutTimer();
  }

  _onLoad(data: any) {
    const {onLoadPlayer} = this.props;
    // this._clearnTimeOutTimer();
    onLoadPlayer && onLoadPlayer(data);
  }

  _clearnTimeOutTimer() {
    this.onLoadStartTime = null;

    if (this.timeOutTimer) {
      clearInterval(this.timeOutTimer);
    }
  }

  _onLoadStart() {
    const {onLoadStartPlayer, onErrorPlayer} = this.props;
    // this.onLoadStartTime = new Date();
    // this.setState({
    //   isTimeOut: false,
    // });
    // this.timeOutTimer = setInterval(() => {
    //   if (this.state.isTimeOut) {
    //     return;
    //   }
    //   if (this.onLoadStartTime) {
    //     const loadingTime =
    //       new Date().getTime() - this.onLoadStartTime.getTime();
    //     const timeOut = 1000;
    //     if (loadingTime >= timeOut) {
    //       this._clearnTimeOutTimer();
    //       if (onErrorPlayer) {
    //         onErrorPlayer(new Error('Loading video is time out!'));
    //       }
    //       this.setState({
    //         isTimeOut: true,
    //       });
    //     }
    //   }
    // }, 1000);
    onLoadStartPlayer && onLoadStartPlayer();
  }

  _onErrorPlayer(error: any) {
    return;
    const {onErrorPlayer} = this.props;
    this._clearnTimeOutTimer();
    onErrorPlayer && onErrorPlayer(error);
  }

  _onBuffer(data: any) {
    const {onBuffer} = this.props;
    onBuffer && onBuffer(data);
  }

  _onProgress(data: any) {
    const {onProgress} = this.props;
    if (onProgress) {
      onProgress(data);
    }
  }

  _onSeek(data: any) {
    const {onSeeked} = this.props;
    onSeeked && onSeeked(data);
  }

  videoRef = (ref: any) => {
    const {videoRef} = this.props;
    this.video = ref;
    videoRef && videoRef(ref);
  };

  render() {
    const {
      uri,
      resizeMode,
      paused,
      onAudioFocusChanged,
      onEndPlayer,
      style,
    } = this.props;
    return (
      <React.Fragment>
        <Video
          source={{
            uri,
          }}
          ref={this.videoRef}
          playInBackground={false}
          repeat={true}
          controls={false}
          resizeMode={resizeMode}
          onProgress={this._onProgress}
          paused={paused}
          onLoad={this._onLoad}
          onLoadStart={this._onLoadStart}
          onEnd={onEndPlayer}
          onAudioFocusChanged={onAudioFocusChanged}
          onError={this._onErrorPlayer}
          style={[styles.player, style]}
          onBuffer={this._onBuffer}
          //onSeek={this._onSeek}
          // bufferConfig={{
          //   minBufferMs: 15000,
          //   maxBufferMs: 50000,
          //   bufferForPlaybackMs: 2500,
          //   bufferForPlaybackAfterRebufferMs: 5000,
          // }}
        />
      </React.Fragment>
    );
  }
}

const styles = StyleSheet.create({
  player: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default Player;
