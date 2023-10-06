import React from 'react';
import {StyleSheet} from 'react-native';
import FastImage from 'react-native-fast-image';

import {getSize} from 'utils/responsive';
import { Icons } from 'utils/icon';

export const CREDIT_CARDS = {
  alipay: Icons.ic_alipaySrc,
  amex: Icons.ic_amexSrc,
  'american-express': Icons.ic_amexSrc,
  diners: Icons.ic_dinersSrc,
  'diners-club': Icons.ic_dinersSrc,
  discover: Icons.ic_discoverSrc,
  discovery: Icons.ic_discoverSrc,
  elo: Icons.ic_eloSrc,
  hiper: Icons.ic_hiperSrc,
  hipercard: Icons.ic_hipercardSrc,
  jcb: Icons.ic_jcbSrc,
  maestro: Icons.ic_maestroSrc,
  mastercard: Icons.ic_mastercardSrc,
  mir: Icons.ic_mirSrc,
  paypal: Icons.ic_paypalSrc,
  unionpay: Icons.ic_unionpaySrc,
  visa: Icons.ic_visaSrc,
};

const CreditCardIcon = ({name, size}) => {
  const styles = StyleSheet.create({
    ccIcon: {
      width: getSize.f(size),
      height: getSize.f(size),
    },
  });
  if (!CREDIT_CARDS[name]) {
    return null;
  }
  return (
    <FastImage
      source={CREDIT_CARDS[name]}
      style={styles.ccIcon}
      resizeMode="contain"
    />
  );
};

export default CreditCardIcon;
