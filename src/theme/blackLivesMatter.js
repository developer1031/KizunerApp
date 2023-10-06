import {Platform} from 'react-native';
import mapStyle from './mapStyle.json';

const colors = {
  primary: '#6C6C6C',
  secondary: '#9B9B9B',
  text: '#323232',
  tagTxt: 'rgb(74,74,74)',
  text1: '#6C6C6C',
  text2: '#9B9B9B',
  textContrast: '#FFFFFF',
  inputLabel: '#9B9B9B',
  grayLight: '#DCDCDC',
  disabled: '#DCDCDC',
  tagBg: '#F0F0F0',
  tagBgActive: '#9B9B9B',
  gradient: ['#6C6C6C', '#9B9B9B'],
  shadow: 'rgba(0,0,0,0.1)',
  background: '#FAFAFA',
  paper: '#FFFFFF',
  bgOverlay: 'rgba(0,0,0,0)',
  grayDark: 'rgba(0,0,0,0.6)',
  googleBtn: '#F0F0F0',
  facebookBtn: '#9B9B9B',
  appleBtn: '#000000',
  error: '#FF6667',
  userMarkerOverlay1: 'rgba(255,100,100,0.2)',
  userMarkerOverlay2: 'rgba(255,100,100,0.01)',
  markerBg: 'rgb(74,74,74)',
  divider: 'rgb(240,240,240)',
  offerStatus: {
    waiting: 'rgb(255,170,100)',
    rejected: 'rgb(255,100,100)',
    accepted: 'rgb(0,202,157)',
    approved: 'rgb(0,202,157)',
    cancelled: 'rgb(38,49,95)',
    completed: 'rgb(74,144,226)',
  },
  offered: 'rgb(0, 202, 157)',
  capacityBg: 'rgba(255,100,100, 0.05)',
};

const shadow = {
  small: {
    android: {
      elevation: 2,
    },
    ios: {
      shadowColor: colors.shadow,
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowRadius: 2,
      shadowOpacity: Platform.OS === 'ios' ? 1 : 0.2,
    },
  },
  large: {
    android: {
      elevation: 3,
    },
    ios: {
      shadowColor: colors.shadow,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowRadius: 15,
      shadowOpacity: Platform.OS === 'ios' ? 1 : 0.2,
    },
  },
  bottomTab: {
    android: {
      elevation: 4,
    },
    ios: {
      shadowColor: colors.shadow,
      shadowOffset: {
        width: 0,
        height: 0,
      },
      shadowRadius: 20,
      shadowOpacity: 0.3,
    },
  },
  postItem: {
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowRadius: 3,
    shadowOpacity: Platform.OS === 'ios' ? 1 : 0.1,
  },
};

const fonts = {
  sfPro: {
    bold: Platform.OS === 'android' ? 'SF-Pro-Text-Bold' : 'SFProText-Bold',
    semiBold:
      Platform.OS === 'android' ? 'SF-Pro-Text-Semibold' : 'SFProText-Semibold',
    medium:
      Platform.OS === 'android' ? 'SF-Pro-Text-Medium' : 'SFProText-Medium',
    regular:
      Platform.OS === 'android' ? 'SF-Pro-Text-Regular' : 'SFProText-Regular',
  },
};

export default {colors, shadow, fonts, mapStyle};
