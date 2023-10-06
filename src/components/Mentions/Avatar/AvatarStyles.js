import {StyleSheet} from 'react-native';
import {getSize} from 'utils/responsive';

export default StyleSheet.create({
  wrapper: {
    width: getSize.w(40),
    height: getSize.h(40),
    borderRadius: getSize.h(50),
    marginRight: getSize.w(5),
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    fontWeight: 'bold',
    fontSize: getSize.f(16),
    color: '#fff',
  },
});
