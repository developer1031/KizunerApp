import Config from 'react-native-config';

export const PERSIST_KEY = '@kizuner/persist-key';
export const USER_TOKEN_KEY = '@kizuner/user-token-key';

// develop mode 1
// export const API_URL = 'https://kizuner-st.inapps.technology/api';
// export const SHARE_URL = 'https://kizuner-share.inapps.technology';

// develop mode 2
// export const API_URL = 'https://kizuner-dev.fabaserver.xyz/api';
// export const API_URL = 'https://kizuner-staging.fabaserver.xyz/api'

// export const API_URL = 'http://112.197.38.147:8000/api'
// export const API_URL = 'http://192.168.1.46:8000/api'
// export const API_URL = 'http://112.197.38.147:8000/api'
export const SHARE_URL = 'https://share.kizuner.com';

// develop mode 3
// export const API_URL = 'http://192.168.1.33/api';
// export const SHARE_URL = 'https://share.kizuner.com'

// production mode
export const API_URL = 'https://source.kizuner.com/api';
// export const SHARE_URL = 'https://share.kizuner.com'

export const STRIPE_KEY = 'pk_test_b9I41rv7fJZDnHyRxMILK5En00uDwq7mBN'; // production
// export const STRIPE_KEY =
//   'pk_test_51MxpAIDPc9eYj4xLMl8jkYcrXMVaQz93y0klFSUFMtNmDmsgJiyl8TkmPuZMqmIOnookkcuJOel3Vs5mwIQBML9000wffTBPFW' // dev

// export const STRIPE_KEY = 'pk_test_ASmUDHC4Cj6DJyA5edHny7VJ'
//export const STRIPE_KEY = 'pk_live_G7vpDABPNy85jL0JspOMOzg400mI6nFSan';

export const AUTOCOMPLETE_URL =
  'https://maps.googleapis.com/maps/api/place/autocomplete/json';
export const REVRSE_GEO_CODE_URL =
  'https://maps.googleapis.com/maps/api/geocode/json';
export const GOOGLE_API_KEY = 'AIzaSyACJ2b7aQZWFfNCO_XOHdRyAJDNDOLGqcM';
export const PLACE_DETAIL_URL =
  'https://maps.googleapis.com/maps/api/place/details/json';
export const TIMEZONE_API_URL =
  'https://maps.googleapis.com/maps/api/timezone/json';

export const SOCKET_HOST = 'https://kizuner-st.inapps.technology/';
//export const SOCKET_HOST = 'https://source.kizuner.com/';

export const CONTACT_US = 'https://kizuner.com/contact-us/';

export const GENDERS = [
  {
    label: 'Male',
    value: 1,
  },
  {
    label: 'Female',
    value: 2,
  },
  {
    label: 'Other',
    value: 3,
  },
];

export const PAYMENT_METHOD = [
  {
    label: 'Both',
    value: 1,
  },
  {
    label: 'Credit',
    value: 2,
  },
  {
    label: 'Crypto',
    value: 3,
  },
];

export const TYPE_POST = [
  {
    label: 'Both',
    value: 1,
  },
  {
    label: 'One-Time',
    value: 2,
  },
  {
    label: 'Multi-Times',
    value: 3,
  },
];

export const FRIENDSHIP = {
  GUEST: 'guest',
  REQUESTED: 'requested',
  PENDING: 'pending',
  FRIEND: 'friend',
};

export const NOTIFICATION_TYPES = [
  'hangout-liked',
  'global',
  'new-review',
  'review-reminder',
  'new-offer',
  'offer-accepted',
  'offer-reminder',
  'hangout-comment',
  'status-liked',
  'friend-request',
  'friend-accepted',
  'new-follow',
  'new-transfer',
];

export const EnumHangoutStatus = {
  NO_TIME: 'no_time',
  ONLINE: 'online',
  COMBINE: 'combine',
};

export const EnumHangoutMultiTimesStatus = {
  NO_TIME: 'no_time',
  COMBINE: 'combine',
};

export const EnumSNSLink = {
  FACEBOOK: 'https://www.facebook.com/',
  TWITTER: 'https://twitter.com/',
  LINKEDIN: 'https://www.linkedin.com/in/',
  INSTAGRAM: 'https://www.instagram.com/',
};

export const EnumAsyncStorage = {
  DRAFT_HANGOUT_TITLE: 'DRAFT_HANGOUT_TITLE',
  DRAFT_HELP_TITLE: 'DRAFT_HELP_TITLE',
  DRAFT_HANGOUT: 'DRAFT_HANGOUT',
  DRAFT_HELP: 'DRAFT_HELP',
};

const enumPaymentStatus = {
  UNPAID: 'unpaid',
  PAID: 'paid',
  TRANSFERRING: 'transferring',
  TRANSFERRED: 'transferred',
  REFUNDING: 'refunding',
  REFUNDED: 'refunded',
};

export const Enum = {
  PAYMENT_STATUS: enumPaymentStatus,
};
