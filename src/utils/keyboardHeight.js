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
    Keyboard.addListener('keyboardDidShow', onKeyboardDidShow);
    Keyboard.addListener('keyboardDidHide', onKeyboardDidHide);
    return () => {
      Keyboard.removeListener('keyboardDidShow', onKeyboardDidShow);
      Keyboard.removeListener('keyboardDidHide', onKeyboardDidHide);
    };
  }, []);

  return keyboardHeight;
};

export default useKeyboardHeight;
