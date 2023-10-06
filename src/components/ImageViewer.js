import React from 'react';
import {StyleSheet} from 'react-native';
import {IconButton} from 'react-native-paper';
// import RNImageViewer from 'react-native-image-zoom-viewer';
import Modal from 'react-native-modal';
import {getStatusBarHeight} from 'react-native-status-bar-height';

import {getSize} from 'utils/responsive';
import useTheme from 'theme';
import orangeLight from '../theme/orangeLight';

const ImageViewer = ({open, onClose, image}) => {
  const theme = useTheme();

  return (
    <Modal
      style={styles.wrapper}
      hasBackdrop={false}
      isVisible={open}
      onDismiss={onClose}>
      <>
        {/* <RNImageViewer
          onCancel={onClose}
          imageUrls={[{url: image?.uri, props: {source: image}}]}
        /> */}
        <IconButton
          icon="close"
          color={theme.colors.textContrast}
          size={30}
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
    backgroundColor: orangeLight.colors.primary,
  },
  closeBtn: {
    position: 'absolute',
    top: getStatusBarHeight(),
    right: getSize.h(15),
  },
});

export default ImageViewer;
