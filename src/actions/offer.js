import {generateThunkAction} from './utilities';

import {
  GET_GUEST_OFFER_LIST,
  GET_CAST_OFFER_LIST,
  CREATE_OFFER,
  UPDATE_OFFER_STATUS,
  CREATE_OFFER_HELP,
  UPDATE_OFFER_STATUS_HELP,
  GET_CAST_OFFER_LIST_HELP,
  GET_GUEST_OFFER_LIST_HELP,
  GET_CURRENT_TIME,
} from './types';
import {showAlert} from './alert';

export const getGuestOfferList = ({status, page = 1}, callback) =>
  generateThunkAction({
    actionType: GET_GUEST_OFFER_LIST,
    apiOptions: {
      endpoint: status ? `/user-guests/${status}` : '/user-guests',
      params: {
        per_page: 8,
        page,
      },
    },
    callback,
  })();

export const getCastOfferList = ({status, page = 1}, callback) =>
  generateThunkAction({
    actionType: GET_CAST_OFFER_LIST,
    apiOptions: {
      endpoint: status ? `/user-casts/${status}` : '/user-casts',
      params: {
        per_page: 8,
        page,
      },
    },
    callback,
  })();

export const getCastOfferListHelp = ({status, page = 1}, callback) =>
  generateThunkAction({
    actionType: GET_CAST_OFFER_LIST_HELP,
    apiOptions: {
      endpoint: status ? `/helps/user-casts/${status}` : '/helps/user-casts',
      params: {
        per_page: 8,
        page,
      },
    },
    callback,
  })();

export const getGuestOfferListHelp = ({status, page = 1}, callback) =>
  generateThunkAction({
    actionType: GET_GUEST_OFFER_LIST_HELP,
    apiOptions: {
      endpoint: status ? `/helps/user-guest/${status}` : '/helps/user-guest',
      params: {
        per_page: 8,
        page,
      },
    },
    callback,
  })();

export const updateOfferStatus = (
  {
    id,
    status,
    hangoutId,
    userId,
    is_within_time = null,
    is_able_contact = null,

    subject_reject = null,
    message_reject = null,
    media_evidence = null,
    media_id = null,

    payment_method = '',
    card_id = '',
    currency = '',
    cryptoId = '',
  },
  callback,
) =>
  generateThunkAction({
    actionType: UPDATE_OFFER_STATUS,
    apiOptions: {
      method: 'PATCH',
      endpoint: `/hangouts/offer/${id}`,
      data: {
        status,
        subject_reject,
        message_reject,
        media_evidence,
        media_id,
        is_within_time,
        is_able_contact,
        payment_method,
        card_id,
        currency,
        cryptoId,
      },
    },
    inputPayload: {id, status, hangoutId, userId},
    callback,
  })();

export const createOffer = (
  {hangoutId, userId, payment_method, card_id, currency, cryptoId},
  callback,
) =>
  generateThunkAction({
    actionType: CREATE_OFFER,
    apiOptions: {
      method: 'POST',
      endpoint: '/hangouts/offer',
      data: {
        hangout_id: hangoutId,
        payment_method,
        card_id,
        currency,
        refund_crypto_wallet_id: cryptoId,
      },
    },
    inputPayload: {hangoutId, userId},
    callback: {
      success: (result, dispatch) => {
        dispatch(
          showAlert({
            title: 'Your hangout offer sent!',
            type: 'success',
            body: 'Please waiting for cast to review.',
          }),
        );
        callback && callback(result);
      },
    },
  })();

export const updateOfferStatusHelp = (
  {
    id,
    status,
    helpId,
    userId,
    is_within_time = null,
    is_able_contact = null,
    media_evidence = null,
    media_id = null,
  },
  callback,
) =>
  generateThunkAction({
    actionType: UPDATE_OFFER_STATUS_HELP,
    apiOptions: {
      method: 'PATCH',
      endpoint: `/helps/offer/${id}`,
      data: {status, is_within_time, is_able_contact, media_evidence, media_id},
    },
    inputPayload: {id, status, helpId, userId},
    callback,
  })();

export const createOfferHelp = ({helpId, userId, cryptoId}, callback) =>
  generateThunkAction({
    actionType: CREATE_OFFER_HELP,
    apiOptions: {
      method: 'POST',
      endpoint: '/helps/offer',
      data: {help_id: helpId, crypto_wallet_id: cryptoId},
    },
    inputPayload: {helpId, userId},
    callback: {
      success: (result, dispatch) => {
        dispatch(
          showAlert({
            title: 'Your help offer sent!',
            type: 'success',
            body: 'Please waiting for requester to review.',
          }),
        );
        callback && callback();
      },
    },
  })();
export const getCurrentTime = (callback) => {
  return generateThunkAction({
    actionType: GET_CURRENT_TIME,
    apiOptions: {
      method: 'GET',
      endpoint: '/helps/getCurrentTime',
    },
    callback,
  })();
};
