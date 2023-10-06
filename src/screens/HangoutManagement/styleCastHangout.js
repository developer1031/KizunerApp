import {StyleSheet} from 'react-native';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {getSize} from 'utils/responsive';

export const style = StyleSheet.create({
  wrapper: {flex: 1},
  scrollWrap: {
    flex: 1,
    zIndex: -1,
  },
  scrollCon: {
    paddingTop: getSize.h(20),
    paddingHorizontal: getSize.w(24),
  },
  filterBtn: {
    height: getSize.h(48),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: getStatusBarHeight() + getSize.h(30),
    paddingHorizontal: getSize.w(20),
    marginHorizontal: getSize.w(24),
  },
  filterLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterText: {
    marginLeft: getSize.w(14),
  },
  filterPopup: {
    left: getSize.w(24),
    right: getSize.w(24),
    top: getStatusBarHeight() + getSize.h(130),
    position: 'absolute',
    zIndex: 1,
  },
  filterItem: {
    paddingHorizontal: getSize.w(20),
    height: getSize.h(48),
    justifyContent: 'center',
  },
  filterItemDivider: {
    height: getSize.h(1),
    marginHorizontal: getSize.w(24),
  },
  filterItemText: {
    textTransform: 'uppercase',
  },
  headerAppName: {
    fontSize: getSize.f(18),
  },
  backBtn: {
    position: 'absolute',
    top: getStatusBarHeight() + getSize.h(20),
    left: getSize.w(24),
    zIndex: 20,
  },
  headerTitle: {
    top: getStatusBarHeight() + getSize.h(26),
    textAlign: 'center',
  },
  titleText: {
    lineHeight: getSize.f(23),
    fontSize: getSize.f(15),
    marginBottom: getSize.h(10),
  },
  bodyText: {
    fontSize: getSize.f(15),
    marginBottom: getSize.h(10),
    lineHeight: getSize.f(23),
  },
  seperator: {
    height: getSize.h(20),
  },
  headerWrap: {zIndex: 10},
});
