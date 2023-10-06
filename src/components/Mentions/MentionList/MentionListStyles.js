import {StyleSheet} from 'react-native';
import {getSize} from 'utils/responsive';

export default StyleSheet.create({
  container: {
    // flex:1,
    maxHeight: getSize.h(300),
  },
  suggestionsPanelStyle: {},
  loaderContainer: {},
  mentionsListContainer: {
    height: getSize.h(100),
  },
});
