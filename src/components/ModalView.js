import React, {useEffect, useState} from 'react';
import {TouchableOpacity, Animated, Easing, Dimensions} from 'react-native';
import Modal from 'react-native-modal';

const ModalView = (props) => {
  const {
    isOpen,
    toggleFunc,
    easing,
    animationTime,
    width,
    height,
    modalColor,
    backdropColor,
    modalRadius,
    modalStyle,
    isFullScreen,
    onShow,
    onClose,
    children,
  } = props;

  const screenHeight = Dimensions.get('window').height;
  const [modalAnimatedValue, setModalAnimatedValue] = useState(
    new Animated.Value(0),
  );
  const [outerAnimatedValue, setOuterAnimatedValue] = useState(
    new Animated.Value(0),
  );

  const toValues = () => {
    if (isOpen) {
      return 0;
    } else {
      return screenHeight;
    }
  };

  const runAnimation = () => {
    Animated.parallel([
      Animated.timing(modalAnimatedValue, {
        toValue: toValues(),
        duration: animationTime,
        easing: Easing[easing],
        useNativeDriver: false,
      }),
      Animated.timing(outerAnimatedValue, {
        toValue: toValues(),
        duration: 0,
        easing: Easing[easing],
        useNativeDriver: false,
      }),
    ]).start();
  };

  useEffect(() => {
    runAnimation();

    if (isOpen) {
      onShow();
    }
  }, [isOpen]);

  return (
    isOpen && (
      <Animated.View
        style={{
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
        }}>
        <TouchableOpacity
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: backdropColor,
            transform: [{translateY: outerAnimatedValue}],
          }}
          onPress={() => {
            toggleFunc();
            onClose();
          }}
        />

        <Animated.View
          style={[
            {
              width: isFullScreen ? '100%' : `${width}%`,
              position: 'absolute',
              backgroundColor: modalColor,
              borderRadius: modalRadius,
              transform: [{translateY: modalAnimatedValue}],
            },
            height !== null && !isFullScreen && {height: height},
            isFullScreen && {height: '100%', borderRadius: 0},
            modalStyle,
          ]}>
          {children}
        </Animated.View>
      </Animated.View>
    )
  );
};

Modal.defaultProps = {
  easing: 'linear',
  animationTime: 500,
  width: 80,
  height: null,
  modalColor: 'white',
  backdropColor: 'rgba(0, 0, 0, 0.8)',
  modalRadius: 15,
  modalStyle: null,
  isFullScreen: false,
  onShow: () => {},
  onClose: () => {},
};

// Modal.propTypes = {
//   isOpen: PropTypes.bool.isRequired,
//   toggleFunc: PropTypes.func.isRequired,
//   easing: PropTypes.string,
//   animationTime: PropTypes.number,
//   width: PropTypes.number,
//   height: PropTypes.number,
//   modalColor: PropTypes.string,
//   backdropColor: PropTypes.string,
//   modalRadius: PropTypes.number,
//   modalStyle: PropTypes.string,
//   isFullScreen: PropTypes.bool,
//   onShow: PropTypes.func,
//   onClose: PropTypes.func,
// };

export default ModalView;
