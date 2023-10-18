import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  LayoutAnimation,
  Image,
  TouchableOpacity,
} from 'react-native';
import {
  GiftedChat,
  InputToolbar,
  Send,
  Bubble,
  Avatar,
  Day,
  MessageImage,
} from 'react-native-gifted-chat';
import Feather from 'react-native-vector-icons/Feather';
import FastImage from 'react-native-fast-image';

import useTheme from 'theme';
import {
  Text,
  Touchable,
  HangoutMessage,
  VideoViewer,
  HelpMessage,
  UserMessage,
} from 'components';
import {getSize} from 'utils/responsive';
import NavigationService from 'navigation/service';
import orangeLight from '../theme/orangeLight';
import {images} from './Video/images';
import {Dimensions} from 'react-native';
import {Icons} from 'utils/icon';

const textStyle = {
  fontSize: 16,
  lineHeight: 20,
  marginTop: 5,
  marginBottom: 5,
  marginLeft: 10,
  marginRight: 10,
};
const stylesTextChat = {
  left: StyleSheet.create({
    container: {},
    text: {
      color: 'black',
      ...textStyle,
    },
    link: {
      color: 'black',
      textDecorationLine: 'underline',
    },
  }),
  right: StyleSheet.create({
    container: {},
    text: {
      color: 'white',
      ...textStyle,
    },
    link: {
      color: 'white',
      textDecorationLine: 'underline',
    },
  }),
};
const MessageImageCustom = ({imageProps}) => {
  const [measure, setMeasure] = useState({width: 1, height: 1});

  const maxWidth = Dimensions.get('window').width * 0.6;

  useEffect(() => {
    Image.getSize(imageProps.currentMessage.image, (width, height) => {
      setMeasure({width, height});
    });
  }, []);

  return (
    <MessageImage
      {...imageProps}
      imageStyle={{
        // resizeMode: 'contain',
        borderRadius: getSize.h(18),
        width: maxWidth,
        height: maxWidth * (measure.height / measure.width),
      }}
    />
  );
};

const GiftestChat = ({
  loading,
  sending,
  showTranslate,
  onTakePhoto,
  onSelectPhoto,
  onSelectEmoji,
  navigateVideoScreen,
  setMessage,
  message,
  setShowEmojiPicker,
  ...props
}) => {
  const [showActions, setShowActions] = useState(true);
  const [showVideoView, setShowVideoView] = useState(false);
  const [selected, setSelected] = useState({});
  const theme = useTheme();

  function handleShowActions() {
    LayoutAnimation.configureNext(
      LayoutAnimation.create(100, 'easeInEaseOut', 'opacity'),
    );
    setShowActions(true);
  }

  function handleHideActions() {
    LayoutAnimation.configureNext(
      LayoutAnimation.create(100, 'easeInEaseOut', 'opacity'),
    );
    setShowEmojiPicker(false);
    setShowActions(false);
  }

  const styles = StyleSheet.create({
    actionBtn: {
      height: getSize.h(64),
      width: getSize.w(24),
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: getSize.w(showActions ? 15 : 5),
      left: getSize.w(showActions ? 0 : -5),
    },
  });

  const renderMessageVideo = (props) => {
    return (
      <TouchableOpacity
        onPress={() => {
          // setSelected({
          //   path: props?.currentMessage?.video,
          // });
          // setShowVideoView(true);
          NavigationService.push('VideoScreen', {
            selected: {
              path: props?.currentMessage?.video,
            },
          });
        }}>
        <View style={stylesMain.contextVideo}>
          <FastImage
            style={{width: '100%', height: '100%', borderRadius: 20}}
            source={{
              uri: props?.currentMessage?.thumb,
            }}
          />
          <View
            hitSlop={{
              top: getSize.h(6),
              left: getSize.h(6),
              bottom: getSize.h(6),
              right: getSize.h(6),
            }}
            style={stylesMain.absolute}>
            <Image
              style={[{width: getSize.w(22), height: getSize.w(22)}]}
              resizeMode={'contain'}
              source={images.video.player.playBtn}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  function renderBubble(bubbleProps) {
    return (
      <Bubble
        {...bubbleProps}
        wrapperStyle={{
          right: {
            backgroundColor:
              bubbleProps?.currentMessage?.hangout ||
              bubbleProps?.currentMessage?.help
                ? 'transparent'
                : theme.colors.secondary,
            borderRadius: getSize.h(20),
          },
          left: {
            backgroundColor:
              bubbleProps?.currentMessage?.hangout ||
              bubbleProps?.currentMessage?.help
                ? 'transparent'
                : theme.colors.tagBg,
            marginLeft: getSize.w(10),
            borderRadius: getSize.h(20),
          },
        }}
        imageStyle={{
          borderRadius: getSize.h(18),
        }}
        textStyle={{
          right: {
            fontFamily: theme.fonts.sfPro.regular,
            color: theme.colors.textContrast,
            fontSize: getSize.f(15),
            paddingHorizontal: getSize.w(10),
            paddingVertical: getSize.h(6),
          },
          left: {
            fontFamily: theme.fonts.sfPro.regular,
            color: theme.colors.text,
            fontSize: getSize.f(15),
            paddingHorizontal: getSize.w(10),
            paddingVertical: getSize.h(6),
          },
        }}
        textProps={{allowFontScaling: false}}
        renderMessageVideo={renderMessageVideo}
      />
    );
  }

  function renderMessageText(messageTextProps) {
    return (
      <Text
        style={{
          fontSize: 16,
          lineHeight: 20,
          marginTop: 5,
          marginBottom: 5,
          marginLeft: 10,
          marginRight: 10,
        }}>
        {messageTextProps?.currentMessage?.text}
      </Text>
    );
  }

  const renderMessageImage = (imageProps) => {
    return <MessageImageCustom imageProps={imageProps} />;
  };

  return (
    <View style={stylesMain.wrapper}>
      <GiftedChat
        text={message}
        onInputTextChanged={(value) => setMessage(value)}
        locale="vi"
        dateFormat="LL"
        keyboardShouldPersistTaps="handled"
        alwaysShowSend
        placeholder={showActions ? 'Aa' : 'Type a message...'}
        renderAvatarOnTop
        multiline
        textInputStyle={stylesMain.textInput}
        // maxComposerHeight={getSize.h(44)}
        minComposerHeight={getSize.h(44)}
        minInputToolbarHeight={getSize.h(64)}
        renderCustomView={({currentMessage}) => {
          if (currentMessage?.relatedUser?.id) {
            return <UserMessage data={currentMessage.relatedUser} />;
          }
          if (currentMessage.help) {
            return <HelpMessage data={currentMessage.help} />;
          }
          if (currentMessage.hangout) {
            return <HangoutMessage data={currentMessage.hangout} />;
          }
          return null;
        }}
        listViewProps={{
          contentContainerStyle: stylesMain.contentContainerStyle,
        }}
        textInputProps={{
          onTouchStart: handleHideActions,
          onBlur: handleShowActions,
          allowFontScaling: false,
        }}
        renderActions={() => (
          <View style={stylesMain.actionWrap}>
            {showActions ? (
              <>
                {onTakePhoto && (
                  <Touchable onPress={onTakePhoto} style={styles.actionBtn}>
                    <Feather
                      color={theme.colors.primary}
                      size={getSize.w(24)}
                      name="camera"
                    />
                  </Touchable>
                )}
                {onSelectPhoto && (
                  <Touchable onPress={onSelectPhoto} style={styles.actionBtn}>
                    <Feather
                      color={theme.colors.primary}
                      size={getSize.w(24)}
                      name="image"
                    />
                  </Touchable>
                )}
                {onSelectEmoji && (
                  <Touchable onPress={onSelectEmoji} style={styles.actionBtn}>
                    <Feather
                      color={theme.colors.primary}
                      size={getSize.w(24)}
                      name="smile"
                    />
                  </Touchable>
                )}
              </>
            ) : (
              <Touchable onPress={handleShowActions} style={styles.actionBtn}>
                <Feather
                  color={theme.colors.primary}
                  size={getSize.w(28)}
                  name="chevron-right"
                />
              </Touchable>
            )}
          </View>
        )}
        renderInputToolbar={(toolbarProps) => (
          <InputToolbar
            {...toolbarProps}
            containerStyle={stylesMain.inputContainer}
          />
        )}
        renderSend={(sendProps) => (
          <Send {...sendProps} containerStyle={stylesMain.sendWrapper}>
            <FastImage source={Icons.ic_send} style={[stylesMain.sendIcon]} />
          </Send>
        )}
        renderChatEmpty={() =>
          loading ? (
            <View style={{transform: [{scaleY: -1}]}}>
              <Text variant="caption" style={stylesMain.bottomMessage}>
                Loading messages...
              </Text>
            </View>
          ) : (
            <View style={{transform: [{scaleY: -1}]}}>
              <Text variant="caption" style={stylesMain.bottomMessage}>
                Let's start the conversation!
              </Text>
            </View>
          )
        }
        renderDay={(dayProps) => (
          <Day
            {...dayProps}
            textProps={{allowFontScaling: false}}
            textStyle={stylesMain.date}
          />
        )}
        renderAvatar={(avatarProps) => (
          <Avatar
            {...avatarProps}
            containerStyle={{
              left: {
                marginRight: -6,
              },
            }}
            imageStyle={{
              left: {
                height: 42,
                backgroundColor: theme.colors.secondary,
                width: 42,
                borderRadius: 21,
              },
              right: {
                height: 42,
                backgroundColor: theme.colors.secondary,
                width: 42,
                borderRadius: 21,
              },
            }}
          />
        )}
        onPressAvatar={(user) =>
          NavigationService.push('UserProfile', {
            userId: user._id,
          })
        }
        renderTime={() => null}
        renderBubble={renderBubble}
        renderMessageImage={renderMessageImage}
        {...props}
      />

      <VideoViewer
        open={showVideoView}
        onClose={() => setShowVideoView(false)}
        selected={selected}
      />
    </View>
  );
};

const stylesMain = StyleSheet.create({
  wrapper: {flex: 1},
  textInput: {
    fontFamily: orangeLight.fonts.sfPro.regular,
    backgroundColor: '#F7F7F7',
    paddingHorizontal: getSize.w(20),
    fontSize: getSize.f(15),
    lineHeight: getSize.h(20),
    color: orangeLight.colors.text,
    // height: getSize.h(44),
    borderRadius: getSize.h(44 / 2),
    textAlignVertical: 'center',
    marginTop: getSize.h(10),
    paddingTop: getSize.h(10),
    paddingBottom: getSize.h(10),
    marginBottom: getSize.h(10),
    marginLeft: 0,
  },
  inputContainer: {
    borderTopWidth: 0,
    // height: getSize.h(64),
    shadowRadius: 5,
    paddingHorizontal: getSize.w(24),
    shadowOffset: {
      width: 0,
      height: -5,
    },
    shadowColor: orangeLight.colors.shadow,
    shadowOpacity: 0.3,
    elevation: 20,
    backgroundColor: orangeLight.colors.paper,
  },
  sendWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: getSize.h(64),
    backgroundColor: orangeLight.colors.paper,
  },
  sendIcon: {
    marginLeft: getSize.w(15),
    height: getSize.h(28),
    width: getSize.h(28),
    resizeMode: 'contain',
    overflow: 'visible',
  },
  actionWrap: {
    height: getSize.h(64),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  contentContainerStyle: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    paddingTop: 10,
  },
  date: {
    fontFamily: orangeLight.fonts.sfPro.medium,
    fontSize: getSize.f(12),
    color: orangeLight.colors.text2,
    textTransform: 'uppercase',
  },
  disabled: {
    opacity: 0.5,
  },
  bottomMessage: {
    textAlign: 'center',
    marginBottom: getSize.h(15),
  },
  videoItem: {
    width: '100%',
    height: getSize.h(80),
  },
  styleVideo: {
    borderRadius: getSize.h(5),
  },
  absolute: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    position: 'absolute',
    zIndex: 1000,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contextVideo: {
    width: 150,
    height: 100,
    borderRadius: 20,
    margin: 3,
    resizeMode: 'cover',
    backgroundColor: '#F0ECED',
  },
});

export default GiftestChat;
