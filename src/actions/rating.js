import {generateThunkAction} from './utilities';

import {
  POST_RATING,
  UPDATE_RATING,
  DELETE_RATING,
  GET_USER_RATINGS,
} from './types';

import {showAlert} from './alert';

export const getUserRating = ({id, page = 1}) =>
  generateThunkAction({
    actionType: GET_USER_RATINGS,
    inputPayload: {id},
    apiOptions: {
      endpoint: `/ratings/users/${id}`,
      params: {
        per_page: 10,
        page,
      },
    },
  })();

export const postRating = ({offer_id, rate, comment, user_id}, callback) =>
  generateThunkAction({
    actionType: POST_RATING,
    inputPayload: {offer_id},
    apiOptions: {
      endpoint: '/ratings',
      method: 'POST',
      data: {
        offer_id,
        rate,
        comment,
        user_id,
      },
    },
    callback: {
      success: (_, dispatch) => {
        callback && callback();
      },
    },
  })();

export const updateRating = ({id, rate, comment}, callback) =>
  generateThunkAction({
    actionType: UPDATE_RATING,
    inputPayload: {id},
    apiOptions: {
      endpoint: `/ratings/${id}`,
      method: 'PUT',
      data: {
        rate,
        comment,
      },
    },
    callback: {
      success: (_, dispatch) => {
        dispatch(
          showAlert({
            type: 'success',
            title: 'Success',
            body: 'Rating updated!',
          }),
        );
        callback && callback();
      },
    },
  })();

export const deleteRating = ({id}, callback) =>
  generateThunkAction({
    actionType: DELETE_RATING,
    inputPayload: {id},
    apiOptions: {
      endpoint: `/ratings/${id}`,
      method: 'DELETE',
    },
    callback: {
      success: (_, dispatch) => {
        dispatch(
          showAlert({
            type: 'success',
            title: 'Success',
            body: 'Rating deleted!',
          }),
        );
        callback && callback();
      },
    },
  })();
