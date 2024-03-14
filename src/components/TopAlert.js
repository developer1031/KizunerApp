import React, {useRef, useEffect} from 'react';
import {StyleSheet} from 'react-native';
import DropdownAlert from 'react-native-dropdownalert';
import {useSelector, useDispatch} from 'react-redux';

import {hideAlert} from 'actions';
import useTheme from 'theme';
import {getSize} from 'utils/responsive';
import NavigationService from 'navigation/service';
import orangeLight from '../theme/orangeLight';

const TopAlert = () => {
  const theme = useTheme();
  const alertRef = useRef(null);
  const dispatch = useDispatch();
  const {alert} = useSelector((state) => state.alert);

  useEffect(() => {
    if (alert) {
      alertRef.current.alertWithType(
        alert.type || 'info',
        alert.title,
        alert.body,
        alert.data,
        4000,
      );
      setTimeout(() => dispatch(hideAlert()), 4000);
    }
  }, [alert]);

  const handleTap = ({payload}) => {
    switch (payload?.type) {
      default:
        return;
    }
  };

  return (
    <DropdownAlert
      ref={alertRef}
      errorColor={'rgb(255,95,109)'}
      successColor={'rgb(255,95,109)'}
      // successColor={'#198754'}
      zIndex={999999}
      elevation={10}
      translucent
      inactiveStatusBarBackgroundColor="transparent"
      defaultContainer={styles.container}
      titleStyle={styles.title}
      messageStyle={styles.message}
      onTap={handleTap}
      titleTextProps={{allowFontScaling: false}}
      messageTextProps={{allowFontScaling: false}}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: getSize.w(15),
    paddingVertical: getSize.h(10),
  },
  logo: {
    width: getSize.h(30),
    height: getSize.h(30),
    resizeMode: 'contain',
    marginTop: getSize.h(10),
  },
  title: {
    fontFamily: orangeLight.fonts.sfPro.medium,
    color: orangeLight.colors.textContrast,
    fontSize: getSize.f(16),
    marginLeft: getSize.w(10),
  },
  message: {
    fontFamily: orangeLight.fonts.sfPro.regular,
    color: orangeLight.colors.textContrast,
    fontSize: getSize.f(14),
    marginLeft: getSize.w(10),
  },
});

export default TopAlert;
