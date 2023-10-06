'use strict';
var __extends =
  (this && this.__extends) ||
  (function() {
    var extendStatics = function(d, b) {
      extendStatics =
        Object.setPrototypeOf ||
        ({__proto__: []} instanceof Array &&
          function(d, b) {
            d.__proto__ = b;
          }) ||
        function(d, b) {
          for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        };
      return extendStatics(d, b);
    };
    return function(d, b) {
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype =
        b === null
          ? Object.create(b)
          : ((__.prototype = b.prototype), new __());
    };
  })();
var __assign =
  (this && this.__assign) ||
  function() {
    __assign =
      Object.assign ||
      function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
    return __assign.apply(this, arguments);
  };
exports.__esModule = true;
var React = require('react');
var react_native_1 = require('react-native');
var react_native_video_with_ads_1 = require('react-native-video');
var Player = /** @class */ (function(_super) {
  __extends(Player, _super);
  function Player(props) {
    var _this = _super.call(this, props) || this;
    _this.UNSAFE_componentWillReceiveProps = function(newProps) {
      if (newProps.urlAds && _this.props.urlAds != newProps.urlAds) {
        _this.video.requestAds(newProps.urlAds);
      }
    };
    _this.videoRef = function(ref) {
      var videoRef = _this.props.videoRef;
      _this.video = ref;
      videoRef && videoRef(ref);
    };
    _this.state = {
      isTimeOut: false,
    };
    _this.onLoadStartTime = null;
    _this._onLoad = _this._onLoad.bind(_this);
    _this._onLoadStart = _this._onLoadStart.bind(_this);
    _this._onErrorPlayer = _this._onErrorPlayer.bind(_this);
    _this._onBuffer = _this._onBuffer.bind(_this);
    _this._onProgress = _this._onProgress.bind(_this);
    _this._onSeek = _this._onSeek.bind(_this);
    return _this;
  }
  Player.prototype.componentDidMount = function() {
    if (this.props.urlAds && this.video.requestAds) {
      this.video.requestAds(this.props.urlAds);
    }
  };
  Player.prototype.componentWillUnmount = function() {
    this._clearnTimeOutTimer();
  };
  Player.prototype._onLoad = function(data) {
    var onLoadPlayer = this.props.onLoadPlayer;
    this._clearnTimeOutTimer();
    onLoadPlayer && onLoadPlayer(data);
  };
  Player.prototype._clearnTimeOutTimer = function() {
    this.onLoadStartTime = null;
    if (this.timeOutTimer) {
      clearInterval(this.timeOutTimer);
    }
  };
  Player.prototype._onLoadStart = function() {
    var _this = this;
    var _a = this.props,
      onLoadStartPlayer = _a.onLoadStartPlayer,
      onErrorPlayer = _a.onErrorPlayer;
    this.onLoadStartTime = new Date();
    this.setState({
      isTimeOut: false,
    });
    this.timeOutTimer = setInterval(function() {
      if (_this.state.isTimeOut) {
        return;
      }
      if (_this.onLoadStartTime) {
        var loadingTime =
          new Date().getTime() - _this.onLoadStartTime.getTime();
        var timeOut = _this.props.timeOut || 30000;
        if (loadingTime >= timeOut) {
          _this._clearnTimeOutTimer();
          if (onErrorPlayer) {
            onErrorPlayer(new Error('Loading video is time out!'));
          }
          _this.setState({
            isTimeOut: true,
          });
        }
      }
    }, 1000);
    onLoadStartPlayer && onLoadStartPlayer();
  };
  Player.prototype._onErrorPlayer = function(error) {
    var onErrorPlayer = this.props.onErrorPlayer;
    this._clearnTimeOutTimer();
    onErrorPlayer && onErrorPlayer(error);
  };
  Player.prototype._onBuffer = function(data) {
    var onBuffer = this.props.onBuffer;
    onBuffer && onBuffer(data);
  };
  Player.prototype._onProgress = function(data) {
    var onProgress = this.props.onProgress;
    if (onProgress) {
      onProgress(data);
    }
  };
  Player.prototype._onSeek = function(data) {
    var onSeeked = this.props.onSeeked;
    onSeeked && onSeeked(data);
  };
  Player.prototype.render = function() {
    var _a = this.props,
      uri = _a.uri,
      resizeMode = _a.resizeMode,
      paused = _a.paused,
      onAudioFocusChanged = _a.onAudioFocusChanged,
      onEndPlayer = _a.onEndPlayer,
      onAdsLoaded = _a.onAdsLoaded,
      onAdStarted = _a.onAdStarted,
      onAdsComplete = _a.onAdsComplete,
      onAllAdsComplete = _a.onAllAdsComplete,
      onAdError = _a.onAdError,
      style = _a.style,
      akamaiConfig = _a.akamaiConfig;
    var videoSource = __assign(__assign({}, akamaiConfig), {uri: uri});
    return React.createElement(react_native_video_with_ads_1['default'], {
      source: videoSource,
      ref: this.videoRef,
      playInBackground: false,
      repeat: true,
      controls: false,
      resizeMode: resizeMode,
      onProgress: this._onProgress,
      paused: paused,
      onLoad: this._onLoad,
      onLoadStart: this._onLoadStart,
      onEnd: onEndPlayer,
      onAudioFocusChanged: onAudioFocusChanged,
      onError: this._onErrorPlayer,
      style: [styles.player, style],
      onBuffer: this._onBuffer,
      onSeek: this._onSeek,
      onAdsLoaded: onAdsLoaded,
      onAdStarted: onAdStarted,
      onAdsComplete: onAdsComplete,
      onAllAdsComplete: onAllAdsComplete,
      onAdError: onAdError,
    });
  };
  return Player;
})(React.PureComponent);
var styles = react_native_1.StyleSheet.create({
  player: __assign({}, react_native_1.StyleSheet.absoluteFillObject),
});
exports['default'] = Player;
