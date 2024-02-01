import {useEffect} from 'react';
import crashlytics from '@react-native-firebase/crashlytics';

import {useSelector} from 'react-redux';

export function setCrashlyticUser(user) {
  user?.email && crashlytics().setAttribute('email', user?.email);
  user?.name && crashlytics().setAttribute('name', user?.name);
}

export default () => {
  const userInfo = useSelector((state) => state.auth.userInfo);

  useEffect(() => {
    if (userInfo) {
      setCrashlyticUser(userInfo);
    }
  }, [userInfo]);

  return null;
};
