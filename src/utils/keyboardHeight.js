import {useEffect, useState} from 'react';
import {Keyboard, LayoutAnimation} from 'react-native';

const useKeyboardHeight = () => {
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  function layoutAnimated() {
    LayoutAnimation.configureNext(
      LayoutAnimation.create(200, 'easeInEaseOut', 'scaleX'),
    );
  }

  function onKeyboardDidShow(e) {
    layoutAnimated();
    setKeyboardHeight(e.endCoordinates.height);
  }

  function onKeyboardDidHide() {
    layoutAnimated();
    setKeyboardHeight(0);
  }

  useEffect(() => {
    const showListener = Keyboard.addListener(
      'keyboardDidShow',
      onKeyboardDidShow,
    );
    const hideListener = Keyboard.addListener(
      'keyboardDidHide',
      onKeyboardDidHide,
    );
    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, []);

  return keyboardHeight;
};

export default useKeyboardHeight;
