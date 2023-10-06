import {useEffect} from 'react';
import crashlytics from '@react-native-firebase/crashlytics';

import {useSelector} from 'react-redux';

export function setCrashlyticUser(user) {
  user?.id && crashlytics().setUserIdentifier(user?.id);
  user?.email && crashlytics().setUserEmail(user?.email);
  user?.name && crashlytics().setUserName(user?.name);
}

export default () => {
  const userInfo = useSelector(state => state.auth.userInfo);

  useEffect(() => {
    if (userInfo) {
      setCrashlyticUser(userInfo);
    }
  }, [userInfo]);

  return null;
};
