import {useEffect, useState} from 'react';
import {AppState} from 'react-native';
import {useDispatch} from 'react-redux';

import {listChatRoom} from 'actions';

export default function useAppState() {
  const [appState, setAppState] = useState(AppState.currentState);

  const dispatch = useDispatch();

  function handleAppStateChange(nextAppState) {
    if (appState.match(/inactive|background/) && nextAppState === 'active') {
      // App has come to the foreground
      // dispatch(listChatRoom({page: 1, reset: true}));
    }
    setAppState(nextAppState);
  }

  useEffect(() => {
    const listener = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      listener.remove();
    };
  }, []);

  // return appState;
  return null;
}
