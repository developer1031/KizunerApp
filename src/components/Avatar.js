import React, {useState} from 'react';
import {StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Placeholder, PlaceholderMedia, Fade} from 'rn-placeholder';
import FastImage from 'react-native-fast-image';

import useTheme from 'theme';
import {getSize} from 'utils/responsive';
import {ImageViewer, Touchable} from 'components';

const Avatar = ({
  source,
  size,
  style,
  noShadow,
  zoomable,
  data,
  loading,
  renderExtra,
  onPress,
  group,
  gray,
  slop,
}) => {
  const theme = useTheme();
  const [showImageView, setShowImageView] = useState(false);

  let SIZE = 68;
  if (size === 'small') {
    SIZE = 35;
  } else if (size === 'large') {
    SIZE = 120;
  } else if (size === 'badge') {
    SIZE = 95;
  } else if (size === 'header') {
    SIZE = 40;
  } else if (size === 'medium') {
    SIZE = 60;
  } else if (size === 'trophy') {
    SIZE = 60;
  } else if (size === 'message') {
    SIZE = 58;
  } else if (size === 'hangoutMessage') {
    SIZE = 34;
  }

  let WRAPPER_SIZE = getSize.h(SIZE);
  if (size === 'large' || size === 'badge') {
    WRAPPER_SIZE = getSize.h(SIZE + 10);
  } else if (size === 'trophy') {
    WRAPPER_SIZE = getSize.h(SIZE + 4);
  }

  const shadowStyle = noShadow
    ? {}
    : {
        ...theme.shadow.small.ios,
        ...theme.shadow.small.android,
      };

  const styles = StyleSheet.create({
    wrapper: {
      height: WRAPPER_SIZE,
      width: WRAPPER_SIZE,
      borderRadius: WRAPPER_SIZE / 2,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.paper,
      ...shadowStyle,
    },
    overlay: {
      position: 'absolute',
      height: getSize.h(SIZE),
      width: getSize.h(SIZE),
      borderRadius: getSize.h(SIZE / 2),
      justifyContent: 'center',
      alignItems: 'center',
    },
    avatar: {
      height: getSize.h(SIZE),
      width: getSize.h(SIZE),
      borderRadius: getSize.h(SIZE / 2),
    },
  });

  if (loading) {
    return (
      <Placeholder Animation={Fade}>
        <PlaceholderMedia style={styles.wrapper} />
      </Placeholder>
    );
  }

  let avatarSource;
  if (source?.uri) {
    avatarSource = source.uri ? {uri: source.uri} : {uri: ''};
  } else {
    avatarSource = {uri: data?.thumb || ''};
  }

  let coverSource;
  if (source?.uri) {
    coverSource = source.uri ? {uri: source.uri} : {uri: ''};
  } else {
    coverSource = {uri: data?.path || ''};
  }

  return (
    <>
      <Touchable
        onPress={() =>
          onPress
            ? onPress()
            : Boolean(coverSource?.uri) && setShowImageView(true)
        }
        slop={slop}
        disabled={!zoomable && !onPress}
        activeOpacity={0.9}
        style={[styles.wrapper, style]}>
        <LinearGradient
          style={styles.overlay}
          colors={
            gray
              ? [theme.colors.grayLight, theme.colors.grayLight]
              : theme.colors.gradient
          }
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}>
          <AntDesign
            color={theme.colors.textContrast}
            size={SIZE / 2.5}
            name={group ? 'team' : 'user'}
          />
        </LinearGradient>
        {Boolean(avatarSource?.uri) && (
          <FastImage source={avatarSource} style={styles.avatar} />
        )}
        {renderExtra && renderExtra()}
      </Touchable>
      <ImageViewer
        open={showImageView}
        onClose={() => setShowImageView(false)}
        image={coverSource}
      />
    </>
  );
};

export default Avatar;
