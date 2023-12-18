/* eslint-disable prettier/prettier */

import {generateThunkType} from './utilities';

export const TOGGLE_THEME = 'TOGGLE_THEME';
export const TOGGLE_IS_FIRST_LAUNCH = 'TOGGLE_IS_FIRST_LAUNCH';
export const TOGGLE_IS_SKIP_LAUNCH = 'TOGGLE_IS_SKIP_LAUNCH';
export const TOGGLE_IS_FIRST_POST = 'TOGGLE_IS_FIRST_POST';
export const TOGGLE_SHOW_TROPHY_MODAL = 'TOGGLE_SHOW_TROPHY_MODAL';

export const LOGIN = generateThunkType('LOGIN');
export const SIGNUP = generateThunkType('SIGNUP');
export const LOGIN_SOCIAL = generateThunkType('LOGIN_SOCIAL');
export const SEND_VERIFY_EMAIL_CODE = generateThunkType(
  'SEND_VERIFY_EMAIL_CODE',
);
export const VERIFY_EMAIL = generateThunkType('VERIFY_EMAIL');
export const SEND_VERIFY_PHONE_CODE = generateThunkType(
  'SEND_VERIFY_PHONE_CODE',
);
export const VERIFY_PHONE = generateThunkType('VERIFY_PHONE');
export const UPDATE_SKILLS = generateThunkType('UPDATE_SKILLS');
export const UPDATE_CATEGORIES = generateThunkType('UPDATE_CATEGORIES');

export const SKIP_FILLING_SKILL = 'SKIP_FILLING_SKILL';
export const SET_SHORT_LOCATION = 'SET_SHORT_LOCATION';

export const UPDATE_LOCATION = generateThunkType('UPDATE_LOCATION');
export const UPDATE_ADDRESS = generateThunkType('UPDATE_ADDRESS');
export const SHOW_ALERT = 'SHOW_ALERT';
export const HIDE_ALERT = 'HIDE_ALERT';
export const HIDE_ALL_ALERT = 'HIDE_ALL_ALERT';
export const SHOW_MODALIZE = 'SHOW_MODALIZE';
export const HIDE_MODALIZE = 'HIDE_MODALIZE';
export const SHOW_MODALIZE_ALL = 'SHOW_MODALIZE_ALL';
export const HIDE_MODALIZE_ALL = 'HIDE_MODALIZE_ALL';
export const LOGOUT = generateThunkType('LOGOUT');
export const UPDATE_USER_GENERAL = generateThunkType('UPDATE_USER_GENERAL');
export const UPDATE_USER_AVATAR = generateThunkType('UPDATE_USER_AVATAR');
export const UPDATE_USER_COVER = generateThunkType('UPDATE_USER_COVER');
export const UPDATE_USER_IDENTIFY = generateThunkType('UPDATE_USER_IDENTIFY');
export const UPDATE_USER_PASSWORD = generateThunkType('UPDATE_USER_PASSWORD');
export const UPDATE_USER_LOCATION = generateThunkType('UPDATE_USER_LOCATION');
export const UPLOAD_SINGLE_IMAGE = generateThunkType('UPLOAD_SINGLE_IMAGE');
export const UPLOAD_MULTI_MEDIA = generateThunkType('UPLOAD_MULTI_MEDIA');
export const LIST_SUGGESTED_SPECIALTIES = generateThunkType(
  'LIST_SUGGESTED_SPECIALTIES',
);
export const LIST_SUGGESTED_CATEGORIES = generateThunkType(
  'LIST_SUGGESTED_CATEGORIES',
);
export const SEARCH_SPECIALTY = generateThunkType('SEARCH_SPECIALTY');
export const SEARCH_CATEGORY = generateThunkType('SEARCH_CATEGORY');
export const INVITE_CONTACT_LIST = generateThunkType('INVITE_CONTACT_LIST');

export const ADD_USER_SPECIALTIES = generateThunkType('ADD_USER_SPECIALTIES');
export const ADD_USER_CATEGORIES = generateThunkType('ADD_USER_CATEGORIES');
export const CREATE_HANGOUT = generateThunkType('CREATE_HANGOUT');
export const CREATE_HELP = generateThunkType('CREATE_HELP');
export const GET_USER_INFO = generateThunkType('GET_USER_INFO');
export const GET_USER_HANGOUTS = generateThunkType('GET_USER_HANGOUTS');
export const GET_RECOMMEND_HANGOUTS = generateThunkType(
  'GET_RECOMMEND_HANGOUTS',
);
export const GET_NEARBY_HANGOUTS = generateThunkType('GET_NEARBY_HANGOUTS');
export const GET_MAP_HANGOUTS = generateThunkType('GET_MAP_HANGOUTS');
export const SEARCH_HANGOUTS = generateThunkType('SEARCH_HANGOUTS');
export const CREATE_OFFER = generateThunkType('CREATE_OFFER');
export const CREATE_OFFER_HELP = generateThunkType('CREATE_OFFER_HELP');

export const UPDATE_OFFER_STATUS = generateThunkType('UPDATE_OFFER_STATUS');
export const UPDATE_OFFER_STATUS_HELP = generateThunkType(
  'UPDATE_OFFER_STATUS_HELP',
);

export const TOGGLE_LIKE_HANGOUT = generateThunkType('TOGGLE_LIKE_HANGOUT');
export const TOGGLE_LIKE_HELP = generateThunkType('TOGGLE_LIKE_HELP');

export const CHANGE_HANGOUT_STATUS = generateThunkType('CHANGE_HANGOUT_STATUS');
export const CHANGE_HELP_STATUS = generateThunkType('CHANGE_HELP_STATUS');

export const GET_DETAIL_HANGOUT = generateThunkType('GET_DETAIL_HANGOUT');
export const GET_DETAIL_HELP = generateThunkType('GET_DETAIL_HELP');

export const REMOVE_AVATAR = generateThunkType('REMOVE_AVATAR');
export const REMOVE_COVER = generateThunkType('REMOVE_COVER');
export const GET_DETAIL_USER = generateThunkType('GET_DETAIL_USER');
export const CLEAR_DETAIL_USER = generateThunkType('CLEAR_DETAIL_USER');
export const GET_FRIEND_LIST = generateThunkType('GET_FRIEND_LIST');
export const GET_FOLLOWING_LIST = generateThunkType('GET_FOLLOWING_LIST');
export const GET_FOLLOWER_LIST = generateThunkType('GET_FOLLOWER_LIST');
export const SEND_FRIEND_REQUEST = generateThunkType('SEND_FRIEND_REQUEST');
export const ACCEPT_FRIEND_REQUEST = generateThunkType('ACCEPT_FRIEND_REQUEST');
export const REJECT_FRIEND_REQUEST = generateThunkType('REJECT_FRIEND_REQUEST');
export const REMOVE_FRIEND_REQUEST = generateThunkType('REMOVE_FRIEND_REQUEST');
export const GET_FRIEND_REQUEST_LIST = generateThunkType(
  'GET_FRIEND_REQUEST_LIST',
);
export const UNFRIEND = generateThunkType('UNFRIEND');
export const FOLLOW = generateThunkType('FOLLOW');
export const UNFOLLOW = generateThunkType('UNFOLLOW');
export const BLOCK_USER = generateThunkType('BLOCK_USER');
export const UNBLOCK_USER = generateThunkType('UNBLOCK_USER');
export const GET_BLOCK_LIST = generateThunkType('GET_BLOCK_LIST');
export const GET_GUIDE_VIDEOS = generateThunkType('GET_GUIDE_VIDEOS');
export const GET_COUNTRY_LIST = generateThunkType('GET_COUNTRY_LIST');
export const GET_REWARD_SETTING = generateThunkType('GET_REWARD_SETTING');

export const SEND_RESET_PW_CODE = generateThunkType('SEND_RESET_PW_CODE');
export const VERIFY_RESET_PW_CODE = generateThunkType('VERIFY_RESET_PW_CODE');
export const RESET_PASSWORD = generateThunkType('RESET_PASSWORD');
export const CREATE_STATUS = generateThunkType('CREATE_STATUS');
export const GET_SELF_FEED = generateThunkType('GET_SELF_FEED');
export const GET_NEWS_FEED = generateThunkType('GET_NEWS_FEED');
export const GET_USER_FEED = generateThunkType('GET_USER_FEED');
export const UPDATE_HANGOUT = generateThunkType('UPDATE_HANGOUT');
export const DELETE_HANGOUT = generateThunkType('DELETE_HANGOUT');
export const UPDATE_HELP = generateThunkType('UPDATE_HELP');
export const DELETE_HELP = generateThunkType('DELETE_HELP');
export const UPDATE_STATUS = generateThunkType('UPDATE_STATUS');
export const DELETE_STATUS = generateThunkType('DELETE_STATUS');
export const GET_COMMENT_LIST = generateThunkType('GET_COMMENT_LIST');
export const POST_COMMENT = generateThunkType('POST_COMMENT');
export const EDIT_COMMENT = generateThunkType('EDIT_COMMENT');
export const DELETE_COMMENT = generateThunkType('DELETE_COMMENT');
export const NEW_COMMENT_FROM_SOCKET = 'NEW_COMMENT_FROM_SOCKET';
export const NEW_FEED_FROM_SOCKET = 'NEW_FEED_FROM_SOCKET';
export const LIST_CHAT_ROOM = generateThunkType('LIST_CHAT_ROOM');
export const LIST_CHAT_ROOM_PUBLIC = generateThunkType('LIST_CHAT_ROOM_PUBLIC');

export const CREATE_CHAT_ROOM = generateThunkType('CREATE_CHAT_ROOM');
export const CREATE_CHAT_ROOM_BOT = generateThunkType('CREATE_CHAT_ROOM_BOT');
export const CREATE_CHAT_ROOM_RELATED_USER = generateThunkType(
  'CREATE_CHAT_ROOM_RELATED_USER',
);
export const UPDATE_CHAT_ROOM_NAME = generateThunkType('UPDATE_CHAT_ROOM_NAME');
export const DELETE_CHAT_ROOM = generateThunkType('DELETE_CHAT_ROOM');
export const ADD_MEMBER_TO_CHAT = generateThunkType('ADD_MEMBER_TO_CHAT');
export const ADD_MEMBER_TO_CHAT_EXPLORE = generateThunkType(
  'ADD_MEMBER_TO_CHAT_EXPLORE',
);

export const REMOVE_MEMBER_FROM_CHAT = generateThunkType(
  'REMOVE_MEMBER_FROM_CHAT',
);
export const FTS_ALL = generateThunkType('FTS_ALL');
export const FTS_USERS = generateThunkType('FTS_USERS');
export const FTS_HANGOUTS = generateThunkType('FTS_HANGOUTS');
export const FTS_HELP = generateThunkType('FTS_HELP');
export const FTS_STATUSES = generateThunkType('FTS_STATUSES');
export const SET_FTS_QUERY = 'SET_FTS_QUERY';
export const CLEAR_SEARCH_RESULT = 'CLEAR_SEARCH_RESULT';
export const SET_FTS_FILTER = 'SET_FTS_FILTER';
export const JOIN_CHAT_ROOM = 'JOIN_CHAT_ROOM';
export const JOIN_CHAT_ROOM_EXPLORE = 'JOIN_CHAT_ROOM_EXPLORE';

export const LEAVE_CHAT_ROOM = 'LEAVE_CHAT_ROOM';
export const GET_ROOM_MESSAGES = generateThunkType('GET_ROOM_MESSAGES');
export const SEND_MESSAGE = generateThunkType('SEND_MESSAGE');
export const DELETE_MESSAGE = generateThunkType('DELETE_MESSAGE');
export const UPLOAD_MESSAGE_IMAGE = generateThunkType('UPLOAD_MESSAGE_IMAGE');
export const UPLOAD_MESSAGE_VIDEO = generateThunkType('UPLOAD_MESSAGE_VIDEO');
export const NEW_MESSAGE_FROM_SOCKET = 'NEW_MESSAGE_FROM_SOCKET';
export const TOGGLE_LIKE_STATUS = generateThunkType('TOGGLE_LIKE_STATUS');
export const GET_DETAIL_STATUS = generateThunkType('GET_DETAIL_STATUS');
export const GET_CURRENT_WALLET = generateThunkType('GET_CURRENT_WALLET');
export const GET_KIZUNA_PACKAGES = generateThunkType('GET_KIZUNA_PACKAGES');
export const GET_PAYMENT_CARDS = generateThunkType('GET_PAYMENT_CARDS');
export const GET_CARD_PAYMENT_SECRET = generateThunkType(
  'GET_CARD_PAYMENT_SECRET',
);
export const ADD_PAYMENT_CARD = generateThunkType('ADD_PAYMENT_CARD');
export const REMOVE_PAYMENT_CARD = generateThunkType('REMOVE_PAYMENT_CARD');
export const PURCHASE_PACKAGE = generateThunkType('PURCHASE_PACKAGE');
export const GET_TRANSACTION_HISTORY = generateThunkType(
  'GET_TRANSACTION_HISTORY',
);
export const TRANSFER_KIZUNA = generateThunkType('TRANSFER_KIZUNA');
export const POST_RATING = generateThunkType('POST_RATING');
export const UPDATE_RATING = generateThunkType('UPDATE_RATING');
export const DELETE_RATING = generateThunkType('DELETE_RATING');
export const GET_USER_RATINGS = generateThunkType('GET_USER_RATINGS');
export const UPDATE_FCM_TOKEN = generateThunkType('UPDATE_FCM_TOKEN');
export const UPDATE_NOTI_SETTING = generateThunkType('UPDATE_NOTI_SETTING');
export const UPDATE_EMAIL_SETTING = generateThunkType('UPDATE_EMAIL_SETTING');
export const GET_NOTI_SETTING = generateThunkType('GET_NOTI_SETTING');
export const GET_EMAIL_SETTING = generateThunkType('GET_EMAIL_SETTING');
export const GET_NOTI_LIST = generateThunkType('GET_NOTI_LIST');
export const GET_NOTI_COUNT = generateThunkType('GET_NOTI_COUNT');
export const NOTI_FRIEND_ACCEPTED = 'NOTI_FRIEND_ACCEPTED';
export const NOTI_NEW_FOLLOW = 'NOTI_NEW_FOLLOW';
export const JOIN_CHAT_ROOM_BY_ID = generateThunkType('JOIN_CHAT_ROOM_BY_ID');
export const JOIN_CHAT_ROOM_BY_ID_EXPLORE = generateThunkType(
  'JOIN_CHAT_ROOM_BY_ID_EXPLORE',
);

export const LIST_LEADERBOARD_GLOBAL = generateThunkType(
  'LIST_LEADERBOARD_GLOBAL',
);

export const LIST_LEADERBOARD_REGIONAL = generateThunkType(
  'LIST_LEADERBOARD_REGIONAL',
);

export const LIST_LEADERBOARD_COUNTRY = generateThunkType(
  'LIST_LEADERBOARD_COUNTRY',
);

export const LIST_LEADERBOARD_CAST = generateThunkType('LIST_LEADERBOARD_CAST');

export const LIST_LEADERBOARD_GUEST = generateThunkType(
  'LIST_LEADERBOARD_GUEST',
);

export const LIST_LEADERBOARD_REQUESTER = generateThunkType(
  'LIST_LEADERBOARD_REQUESTER',
);

export const LIST_LEADERBOARD_HELPER = generateThunkType(
  'LIST_LEADERBOARD_HELPER',
);

export const READ_NOTI = generateThunkType('READ_NOTI');
export const DELETE_NOTI = generateThunkType('DELETE_NOTI');
export const GET_CAST_OFFER_LIST = generateThunkType('GET_CAST_OFFER_LIST');
export const GET_CAST_OFFER_LIST_HELP = generateThunkType(
  'GET_CAST_OFFER_LIST_HELP',
);
export const GET_GUEST_OFFER_LIST_HELP = generateThunkType(
  'GET_GUEST_OFFER_LIST_HELP',
);
export const GET_GUEST_OFFER_LIST = generateThunkType('GET_GUEST_OFFER_LIST');
export const GET_USER_LIKE_LIST = generateThunkType('GET_USER_LIKE_LIST');
export const SEEN_CHAT_ROOM = generateThunkType('SEEN_CHAT_ROOM');
export const SEEN_CHAT_ROOM_EXPLORE = generateThunkType(
  'SEEN_CHAT_ROOM_EXPLORE',
);

export const GET_CONFIGS = generateThunkType('GET_CONFIGS');
export const REPORT_CONTENT = generateThunkType('REPORT_CONTENT');
export const EDIT_CONTACT_SEARCH = 'EDIT_CONTACT_SEARCH';
export const CHECK_UNREAD_NOTIFICATION = generateThunkType(
  'CHECK_UNREAD_NOTIFICATION',
);
export const RELOAD_DRAFT_MESSAGE_BY_ROOM_ID =
  'RELOAD_DRAFT_MESSAGE_BY_ROOM_ID';

export const GET_TUTORIAL_IMAGES = generateThunkType('GET_TUTORIAL_IMAGES');

export const SUPPORT_BY_EMAIL = generateThunkType('SUPPORT_BY_EMAIL');
export const NOTIFICATION_SHARE_POST = generateThunkType(
  'NOTIFICATION_SHARE_POST',
);
export const NEED_VERIFY_EMAIL = generateThunkType('NEED_VERIFY_EMAIL');
export const CONNECT_STRIPE = generateThunkType('CONNECT_STRIPE');
export const GET_STRIPE_CUSTOM_ACCOUNT = generateThunkType(
  'GET_STRIPE_CUSTOM_ACCOUNT',
);
export const GET_NOW_PAYMENTS_CURRENCIES = generateThunkType(
  'GET_NOW_PAYMENTS_CURRENCIES',
);
export const GET_NOW_PAYMENTS_MIN_AMOUNT = generateThunkType(
  'GET_NOW_PAYMENTS_MIN_AMOUNT',
);
export const GET_NOW_PAYMENTS_ESTIMATE = generateThunkType(
  'GET_NOW_PAYMENTS_ESTIMATE',
);
export const GET_PAYMENT_CRYPTO_CARDS = generateThunkType(
  'GET_PAYMENT_CRYPTO_CARDS',
);
export const POST_PAYMENT_CRYPTO_CARD = generateThunkType(
  'POST_PAYMENT_CRYPTO_CARD',
);
export const DELETE_PAYMENT_CRYPTO_CARD = generateThunkType(
  'DELETE_PAYMENT_CRYPTO_CARD',
);
export const GET_CURRENT_TIME = generateThunkType('GET_CURRENT_TIME');

export const SET_UNSEEN_SINGE = generateThunkType('SET_UNSEEN_SINGE');
export const SET_UNSEEN_GROUP = generateThunkType('SET_UNSEEN_GROUP');
export const GET_BADGE_CHAT_SINGLE = generateThunkType('GET_BADGE_CHAT_SINGLE');
export const GET_BADGE_CHAT_GROUP = generateThunkType('GET_BADGE_CHAT_GROUP');
export const UPLOAD_STRIPE_IDENTITY = generateThunkType(
  'UPLOAD_STRIPE_IDENTITY',
);
export const GET_WALLET_STRIPE_STATUS = generateThunkType(
  'GET_WALLET_STRIPE_STATUS',
);
export const PAYOUT_STRIPE = generateThunkType('PAYOUT_STRIPE');
