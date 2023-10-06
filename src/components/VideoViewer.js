import React from 'react';
import {StyleSheet} from 'react-native';
import Modal from 'react-native-modal';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {IconButton} from 'react-native-paper';

import {getSize} from 'utils/responsive';
import useTheme from 'theme';
import orangeLight from '../theme/orangeLight';

import NavigationService from 'navigation/service';

import {VideoComponent, VideoPlayerMain} from 'components';
import {Platform} from 'react-native';

const VideoViewer = ({open, onClose, selected}) => {
  const theme = useTheme();

  function onFullScreen() {
    onClose && onClose();
    NavigationService.push('VideoScreen', {
      video: {
        uri: selected?.path,
      },
    });
  }

  return (
    <Modal
      style={styles.wrapper}
      hasBackdrop={false}
      isVisible={open}
      onDismiss={onClose}>
      <>
        {selected?.path && (
          <VideoComponent
            video={{uri: selected?.path}}
            style={styles.video}
            isHideControlBottom={true}
            onPress={onFullScreen}
          />
        )}
        <IconButton
          icon="close"
          color={theme.colors.primary}
          size={getSize.w(32)}
          style={styles.closeBtn}
          onPress={onClose}
        />
      </>
    </Modal>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    ...StyleSheet.absoluteFillObject,
    margin: 0,
    backgroundColor: '#000001',
  },
  closeBtn: {
    position: 'absolute',
    ...Platform.select({
      ios: {
        top: getStatusBarHeight() - getSize.h(20),
        right: getSize.h(10),
      },
      android: {
        top: getStatusBarHeight() - getSize.h(30),
        right: getSize.h(6),
      },
    }),
    zIndex: 10000000,
  },
  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    resizeMode: 'cover',
    backgroundColor: orangeLight.colors.background,
    ...Platform.select({
      ios: {
        marginVertical: getSize.h(65),
      },
      android: {
        marginVertical: getSize.h(50),
      },
    }),
  },
});

export default VideoViewer;
