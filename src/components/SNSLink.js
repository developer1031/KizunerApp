import React from 'react';
import {View, StyleSheet, Linking} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import Touchable from './Touchable';
import useTheme from 'theme';
import {getSize} from 'utils/responsive';
import orangeLight from '../theme/orangeLight';
import {EnumSNSLink} from 'utils/constants';

const SNSLink = ({service, link, wrapperStyle}) => {
  let linkOpen = '';
  switch (service) {
    case 'facebook':
      linkOpen = EnumSNSLink.FACEBOOK + link;
      break;
    case 'twitter':
      linkOpen = EnumSNSLink.TWITTER + link;
      break;
    case 'linkedin':
      linkOpen = EnumSNSLink.LINKEDIN + link;
      break;
    case 'instagram':
      linkOpen = EnumSNSLink.INSTAGRAM + link;
      break;
    default:
      break;
  }

  const theme = useTheme();
  return (
    <Touchable style={wrapperStyle} onPress={() => Linking.openURL(linkOpen)}>
      <View style={[styles.wrapper, styles[service]]}>
        <MaterialCommunityIcons
          size={getSize.f(15)}
          color={theme.colors.textContrast}
          name={service}
        />
      </View>
    </Touchable>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: getSize.h(26),
    height: getSize.h(26),
    borderRadius: getSize.h(26 / 2),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: orangeLight.colors.paper,
    ...orangeLight.shadow.small.ios,
    ...orangeLight.shadow.small.android,
  },
  facebook: {
    backgroundColor: '#1778F2',
  },
  twitter: {
    backgroundColor: '#4DC7F1',
  },
  linkedin: {
    backgroundColor: '#017EBB',
  },
  instagram: {
    backgroundColor: '#FF3C60',
  },
});

export default SNSLink;
