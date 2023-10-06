import {StyleSheet} from 'react-native';
import {getSize} from 'utils/responsive';

export default StyleSheet.create({
  buttonContainer: {
    width: getSize.w(80),
    height: getSize.h(80),
    borderRadius: getSize.w(40),
    backgroundColor: '#D91E18',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 5,
    borderColor: 'white',
  },
  circleInside: {
    width: getSize.w(60),
    height: getSize.h(60),
    borderRadius: getSize.w(30),
    backgroundColor: '#D91E18',
  },
  buttonStopContainer: {
    backgroundColor: 'transparent',
  },
  buttonStop: {
    backgroundColor: '#D91E18',
    width: getSize.w(40),
    height: getSize.h(40),
    borderRadius: 3,
  },
});
