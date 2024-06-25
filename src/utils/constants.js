export const PERSIST_KEY = '@kizuner/persist-key';
export const USER_TOKEN_KEY = '@kizuner/user-token-key';

// prod
// export const SHARE_URL = 'https://share.kizuner.com';
// export const SOCKET_HOST = 'https://source.kizuner.com/';
// export const API_URL = 'https://source.kizuner.com/api';
// export const STRIPE_KEY = 'pk_live_G7vpDABPNy85jL0JspOMOzg400mI6nFSan';

// staging
export const SHARE_URL = 'https://kizuner-share.inapps.technology';
export const SOCKET_HOST = 'https://kizuner-st.inapps.technology/';
export const API_URL = 'https://kizuner-st.inapps.technology/api';
export const STRIPE_KEY = 'pk_test_b9I41rv7fJZDnHyRxMILK5En00uDwq7mBN';

// localhost
// export const API_URL = 'http://192.168.110.58:8000/api';

export const CONTACT_US = 'https://kizuner.com/contact-us/';

export const AUTOCOMPLETE_URL =
  'https://maps.googleapis.com/maps/api/place/autocomplete/json';
export const REVRSE_GEO_CODE_URL =
  'https://maps.googleapis.com/maps/api/geocode/json';
export const GOOGLE_API_KEY = 'AIzaSyACJ2b7aQZWFfNCO_XOHdRyAJDNDOLGqcM';
export const PLACE_DETAIL_URL =
  'https://maps.googleapis.com/maps/api/place/details/json';
export const TIMEZONE_API_URL =
  'https://maps.googleapis.com/maps/api/timezone/json';

export const TWITTER_AUTH_URL = 'https://twitter.com/i/oauth2/authorize';
export const TWITTER_CONSUMER_KEY = 'QVVlTlZBeThDS2xid0N0X05VUW86MTpjaQ';

export const GoogleStoreUrl =
  'https://play.google.com/store/apps/details?id=com.kizuner';
export const AppleStoreUrl = 'https://apps.apple.com/us/app/id' + AppStoreID;
export const BundleID = 'com.kizuner';
export const AppStoreID = '1524617131';
export const PageLink = 'https://kizuner.page.link';
export const GCPStorageLink =
  'https://storage.googleapis.com/kizuner-storage-live/';

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
  // {
  //   label: 'Both',
  //   value: 'both',
  // },
  {
    label: 'Credit',
    value: 'credit',
  },
  {
    label: 'Crypto',
    value: 'crypto',
  },
];

export const TYPE_POST = [
  {
    label: 'Both',
    value: 'all',
  },
  {
    label: 'One-Time',
    value: 1,
  },
  {
    label: 'Multi-Times',
    value: 2,
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
