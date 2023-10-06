"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var lodash_1 = require("lodash");
var React = require("react");
var react_native_1 = require("react-native");
var player_control_1 = require("./player-control");
var player_1 = require("./player");
var image_button_1 = require("./image-button");
var images_1 = require("./images");
var responsive_1 = require("~utils/responsive");
var VideoPlayerMode = {
    Portrait: {
        Small: 'Portrait.Small',
        Normal: 'Portrait.Normal',
        Fullscreen: 'Portrait.Fullscreen'
    },
    Landscape: {
        Fullscreen: 'Landscape.Fullscreen'
    }
};
var VideoPlayer = /** @class */ (function (_super) {
    __extends(VideoPlayer, _super);
    function VideoPlayer(props) {
        var _this = _super.call(this, props) || this;
        // Handle video ads event
        _this.handleSetVideoAds = function (videoAds) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/];
        }); }); };
        _this.videoRef = _this.videoRef.bind(_this);
        _this.handlePlayButtonPress = _this.handlePlayButtonPress.bind(_this);
        _this.handleVideoProgress = _this.handleVideoProgress.bind(_this);
        _this.handleVideoPlayerStartLoad = _this.handleVideoPlayerStartLoad.bind(_this);
        _this.handleVideoPlayerEnded = _this.handleVideoPlayerEnded.bind(_this);
        _this.handleVideoLoaded = _this.handleVideoLoaded.bind(_this);
        _this.handleVideoPlayerError = _this.handleVideoPlayerError.bind(_this);
        _this.handleVideoBuffer = _this.handleVideoBuffer.bind(_this);
        _this.handleVideoSeeked = _this.handleVideoSeeked.bind(_this);
        _this.handleAppStateChange = _this.handleAppStateChange.bind(_this);
        return _this;
    }
    VideoPlayer.prototype.videoRef = function (ref) {
        this.video = ref;
    };
    VideoPlayer.prototype.getAdsBackButtonStyle = function () {
        var videoPlayerMode = this.props.videoPlayerMode;
        return [
            { position: 'absolute' },
            videoPlayerMode === VideoPlayerMode.Landscape.Fullscreen
                ? {
                    top: responsive_1.getSize.h(4),
                    left: responsive_1.getSize.h(4)
                }
                : {
                    top: responsive_1.getSize.w(4),
                    left: responsive_1.getSize.w(4)
                },
        ];
    };
    VideoPlayer.prototype.getVideoUri = function () {
        var playerData = this.props.playerData;
        return playerData.sourceLink || '';
    };
    VideoPlayer.prototype.getLastPlayedTime = function (videoData) {
        var _a = videoData.videoInfo, videoInfo = _a === void 0 ? {} : _a;
        var lastPlayedTime = videoInfo.lastPlayedTime;
        return lastPlayedTime > 0 ? lastPlayedTime : 0;
    };
    VideoPlayer.prototype.playerSeekToTime = function (time) {
        if (this.video) {
            this.video.seek(time);
        }
    };
    VideoPlayer.prototype.handleAppStateChange = function (nextAppState) {
        var changePausedStatus = this.props.changePausedStatus;
        if (nextAppState.match(/inactive|background/)) {
            changePausedStatus(true);
        }
    };
    VideoPlayer.prototype.handleVideoBuffer = function () {
        // const {videoPlayerChangeLoadingStatus, paused} = this.props;
        // if (!paused) {
        //   videoPlayerChangeLoadingStatus(true);
        // }
    };
    VideoPlayer.prototype.handlePlayButtonPress = function () {
        var _a = this.props, changePausedStatus = _a.changePausedStatus, paused = _a.paused;
        changePausedStatus(!paused);
    };
    VideoPlayer.prototype.handleVideoPlayerStartLoad = function () {
        var _a = this.props, playerData = _a.playerData, fromStartSource = _a.fromStartSource, videoPlayerStartLoad = _a.videoPlayerStartLoad, isLiveStream = _a.isLiveStream, recommendationId = _a.recommendationId;
        var id = playerData.id;
        var lastPlayedTime = this.getLastPlayedTime(playerData);
        //videoPlayerStartLoad();
    };
    VideoPlayer.prototype.handleVideoLoaded = function (event) {
        var _a = this.props, onVideoPlayerLoaded = _a.onVideoPlayerLoaded, videoPlayerLoaded = _a.videoPlayerLoaded, playerData = _a.playerData, videoAdsPositions = _a.videoAdsPositions, changePausedStatus = _a.changePausedStatus, logVideoStart = _a.logVideoStart, currentProfileId = _a.currentProfileId, isLiveStream = _a.isLiveStream;
        var duration = event.duration;
        // ! Log video auto play
        var id = playerData.id;
        var _b = this.props, subRefVideo = _b.subRefVideo, fromStartSource = _b.fromStartSource;
        onVideoPlayerLoaded && onVideoPlayerLoaded(event);
    };
    VideoPlayer.prototype.handleVideoPlayerError = function (error) {
        // const {onVideoPlayerError, videoPlayerError, isLiveStream} = this.props;
        // const videoUri = this.getVideoUri();
        // videoPlayerError(error, videoUri, !isLiveStream);
        // onVideoPlayerError && onVideoPlayerError(error);
        return;
    };
    VideoPlayer.prototype.handleVideoProgress = function (progress) {
        var _a = this.props, updateCurrentTimeClock = _a.updateCurrentTimeClock, seekToTime = _a.seekToTime, videoPlayerChangeLoadingStatus = _a.videoPlayerChangeLoadingStatus;
        var currentTime = progress.currentTime;
    };
    VideoPlayer.prototype.handleVideoSeeked = function (data) {
        var seekTime = data.seekTime;
        var slidingVideo = this.props.slidingVideo;
        slidingVideo(false, seekTime);
    };
    VideoPlayer.prototype.handleVideoPlayerEnded = function () {
        var _a = this.props, onVideoPlayerEnded = _a.onVideoPlayerEnded, videoAdsPositions = _a.videoAdsPositions, changePausedStatus = _a.changePausedStatus, videoPlayerEnded = _a.videoPlayerEnded;
        videoPlayerEnded && videoPlayerEnded();
        var videoAds = lodash_1["default"].find(videoAdsPositions, function (obj) {
            return obj.position === 'postroll';
        });
        if (videoAds) {
            this.handleSetVideoAds(videoAds);
        }
        else {
            // changePausedStatus(true);
            onVideoPlayerEnded && onVideoPlayerEnded();
        }
    };
    VideoPlayer.prototype.componentDidMount = function () {
        react_native_1.AppState.addEventListener('change', this.handleAppStateChange);
    };
    VideoPlayer.prototype.componentWillUnmount = function () { };
    VideoPlayer.prototype.render = function () {
        var _a = this.props, style = _a.style, onPressAddFavorite = _a.onPressAddFavorite, onPressRemoveFavorite = _a.onPressRemoveFavorite, playerHeightAnimation = _a.playerHeightAnimation, onFullScreenButtonPress = _a.onFullScreenButtonPress, onBackButtonPress = _a.onBackButtonPress, videoPlayerMode = _a.videoPlayerMode, onNextButtonPress = _a.onNextButtonPress, onPreviousButtonPress = _a.onPreviousButtonPress, onItemPress = _a.onItemPress, resizeMode = _a.resizeMode, requestingVideo = _a.requestingVideo, duration = _a.duration, currentTime = _a.currentTime, paused = _a.paused, playableDuration = _a.playableDuration, videoPlayerLoading = _a.videoPlayerLoading, videoAdsUrl = _a.videoAdsUrl, videoAdsPlaying = _a.videoAdsPlaying, videoAdsLoading = _a.videoAdsLoading, isHideControlBottom = _a.isHideControlBottom, onLiveStreamToolBarPress = _a.onLiveStreamToolBarPress;
        var videoUri = this.getVideoUri();
        var adsButtonStyle = this.getAdsBackButtonStyle();
        return (React.createElement(react_native_1.Animated.View, { style: [styles.container, style, { height: playerHeightAnimation }] },
            !!videoUri && (React.createElement(player_1["default"], { resizeMode: resizeMode, videoRef: this.videoRef, paused: paused, uri: videoUri, onLoadStartPlayer: this.handleVideoPlayerStartLoad, onLoadPlayer: this.handleVideoLoaded, onProgress: this.handleVideoProgress, onBuffer: this.handleVideoBuffer, onEndPlayer: this.handleVideoPlayerEnded, onErrorPlayer: this.handleVideoPlayerError && this.handleVideoPlayerError, onSeeked: this.handleVideoSeeked, urlAds: videoAdsUrl })),
            !videoAdsPlaying && (React.createElement(player_control_1["default"], { paused: paused, currentTime: currentTime, duration: duration, playableDuration: playableDuration, loading: requestingVideo || videoPlayerLoading || videoAdsLoading, onPressAddFavorite: onPressAddFavorite, onPressRemoveFavorite: onPressRemoveFavorite, videoPlayerMode: videoPlayerMode, style: styles.playControl, onFullScreenButtonPress: onFullScreenButtonPress, onBackButtonPress: onBackButtonPress, onNextButtonPress: onNextButtonPress, onPreviousButtonPress: onPreviousButtonPress, onPlayButtonPress: this.handlePlayButtonPress, onItemPress: onItemPress, onLiveStreamToolBarPress: onLiveStreamToolBarPress, isHideControlBottom: isHideControlBottom })),
            videoAdsPlaying && (React.createElement(image_button_1["default"], { style: adsButtonStyle, image: images_1.images.video.backIcon, tintColor: 'black', onPress: onBackButtonPress }))));
    };
    return VideoPlayer;
}(React.Component));
var styles = react_native_1.StyleSheet.create({
    container: {
        backgroundColor: 'rgb(255,100,100)',
        width: '100%'
    },
    playControl: {
        flex: 1
    },
    playerErrorContainer: __assign(__assign({}, react_native_1.StyleSheet.absoluteFillObject), { justifyContent: 'center', alignItems: 'center' }),
    playerError: {
        color: 'white',
        marginHorizontal: responsive_1.getSize.w(30),
        textAlign: 'center'
    }
});
exports["default"] = VideoPlayer;
