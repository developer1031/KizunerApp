import {StyleSheet} from 'react-native';
import {getSize} from 'utils/responsive';

export default StyleSheet.create({
  suggestionItem: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#fff',
    color: 'rgba(0, 0, 0, 0.1)',
    height: getSize.h(50),
    paddingHorizontal: getSize.w(20),
    borderBottomWidth: getSize.w(1),
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  text: {
    alignSelf: 'center',
    marginLeft: getSize.w(12),
  },
  title: {
    fontSize: getSize.f(16),
    color: 'rgba(0, 0, 0, 0.8)',
  },
  thumbnailWrapper: {
    width: getSize.w(35),
    height: getSize.height(35),
  },
  thumbnailChar: {
    fontSize: getSize.f(16),
  },
});
