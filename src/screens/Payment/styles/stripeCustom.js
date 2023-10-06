import {StyleSheet, Dimensions} from 'react-native';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {getSize} from 'utils/responsive';

const {width, height} = Dimensions.get('window');

export const styles = StyleSheet.create({
  btnBack: {
    position: 'absolute',
    top: getStatusBarHeight() + getSize.h(20),
    left: getSize.w(24),
    zIndex: 10,
  },
  headerTitle: {
    top: getStatusBarHeight() + getSize.h(26),
    textAlign: 'center',
  },
  mainContainer: {
    paddingVertical: getSize.w(24),
    paddingHorizontal: getSize.w(24),
  },
  formWrapper: {
    paddingVertical: getSize.h(40),
    paddingHorizontal: getSize.w(24),
  },
  btnContainer: {
    paddingTop: getSize.h(24),
    paddingHorizontal: getSize.w(24),
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    shadowOpacity: 0.5,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowColor: '#000',
    shadowRadius: 5,
    elevation: 5,
  },
  phoneInputWrapper: {
    flexDirection: 'row',
  },
  countryInput: {
    minWidth: 100,
    borderBottomWidth: getSize.h(1),
  },
  countryWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  countryFlag: {
    width: getSize.w(28),
    height: getSize.h(20),
    borderRadius: getSize.h(2),
    resizeMode: 'contain',
    marginRight: getSize.w(5),
  },
  countryValue: {
    paddingVertical: getSize.h(Platform.OS === 'ios' ? 10 : 8),
    fontSize: getSize.f(16),
    letterSpacing: 1,
  },
  phoneWrapper: {
    marginLeft: 20,
    flexGrow: 1,
    width: width - getSize.w(48 * 2 + 20 + 100),
  },
  phoneInput: {
    overflow: 'hidden',
    flexGrow: 1,
    maxWidth: width / 2 + getSize.w(10) - getSize.w(48),
  },
  bodInterface: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 1,
    top: 0,
    left: 0,
  },
});
