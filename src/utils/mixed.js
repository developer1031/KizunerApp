import {PhoneNumberUtil} from 'google-libphonenumber';

export const getHangoutStatus = (st) => {
  if (st === 'complete' || st === 'completed') {
    return 'completed';
  }
  if (st === 'pending' || st === 'waiting' || st === 'queuing') {
    return 'waiting';
  }
  if (st === 'cancel') {
    return 'cancelled';
  }
  if (st === 'started') {
    return 'started';
  }
  if (st === 'reject' || st === 'rejected') {
    return 'rejected';
  }
  if (st === 'approved') {
    return 'approved';
  }

  if (st === 'bought' || st === 'buy') {
    return 'bought';
  }

  if (st === 'paid') {
    return 'paid';
  }
  if (st === 'unpaid') {
    return 'unpaid';
  }
  if (st === 'cast_cancelled') {
    return 'cancelled';
  }
  if (st === 'helper_cancelled') {
    return 'cancelled';
  }
  if (st === 'helper_started') {
    return 'started';
  }

  if (st === 'guest_started') {
    return 'started';
  }
  if (st === 'guest_declined' || st === 'declined') {
    return 'declined';
  }
  if (st === 'cast_cancelled') {
    return 'cancelled';
  }

  if (st === 'transferring') {
    return 'transferring';
  }
  if (st === 'transferred') {
    return 'transferred';
  }
  if (st === 'refunding') {
    return 'refunding';
  }
  if (st === 'refunded') {
    return 'refunded';
  }

  return `${st}ed`;
};

export function getYoutubeId(url) {
  var regExp =
    /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  var match = url.match(regExp);
  return match && match[7].length === 11 ? match[7] : false;
}

export function parsePhoneNumber(str) {
  const phoneUtil = PhoneNumberUtil.getInstance();
  try {
    if (str) {
      const number = phoneUtil.parse(str, '');
      const country = phoneUtil.getRegionCodeForNumber(number);
      const phoneNumber = str.replace('+' + number.getCountryCode(), '');
      return {
        country,
        phoneNumber,
        error: null,
      };
    } else {
      throw new Error('phone empty');
    }
  } catch (error) {
    return {
      country: '',
      phoneNumber: '',
      error: error.message,
    };
  }
}

export const getPaymentString = (paymentMethod) => {
  const stripeString = 'Credit';
  const nowString = 'Crypto';
  const payStr = ' Payment';

  if (paymentMethod === 'credit') {
    return stripeString + payStr;
  }
  if (paymentMethod === 'crypto') {
    return nowString + payStr;
  }
  if (paymentMethod === 'both') {
    return `${stripeString} & ${nowString}` + payStr;
  }

  return '';
};
