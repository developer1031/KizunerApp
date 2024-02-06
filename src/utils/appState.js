import {useEffect, useState, useRef} from 'react';
import {AppState} from 'react-native';
import {useDispatch} from 'react-redux';

import {listChatRoom} from 'actions';

export default function useAppState() {
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  // const dispatch = useDispatch();

  function handleAppStateChange(nextAppState) {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      // App has come to the foreground
      // dispatch(listChatRoom({page: 1, reset: true}));
    }
    appState.current = nextAppState;
    setAppStateVisible(appState.current);
  }

  useEffect(() => {
    const listener = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      listener.remove();
    };
  }, []);

  return appStateVisible;
}
