import {StyleSheet, Platform} from 'react-native';
import {getStatusBarHeight} from 'react-native-status-bar-height';

import {getSize} from 'utils/responsive';

import orangeLight from '../../theme/orangeLight';
const HEADER_HEIGHT = 89;
export const styles = StyleSheet.create({
  wrapper: {flex: 1},

  scrollContainer: {
    paddingBottom: getSize.h(20),
    paddingTop:
      Platform.OS === 'android'
        ? getStatusBarHeight() + getSize.h(HEADER_HEIGHT + 125)
        : 0,
  },

  statusFilter: {
    position: 'absolute',
    left: 0,
    right: 0,
    justifyContent: 'flex-end',
    paddingBottom: getSize.h(20),
    marginBottom: getSize.h(20),
    paddingTop: getStatusBarHeight() + getSize.h(HEADER_HEIGHT + 45),
    zIndex: 1,
  },

  actionWrap: {
    position: 'absolute',
    left: getSize.w(24),
    right: getSize.w(24),
    top: getStatusBarHeight() + getSize.h(HEADER_HEIGHT) - getSize.h(48 / 2),
    zIndex: 3,
    elevation: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },

  hasNewFeedWrap: {
    backgroundColor: orangeLight.colors.primary,
    height: getSize.h(38),
    borderRadius: getSize.h(38 / 2),
    paddingHorizontal: getSize.w(15),
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    zIndex: 20,
    ...orangeLight.shadow.small.ios,
    ...orangeLight.shadow.small.android,
  },
});
