import {generateThunkAction} from './utilities';

import {
  POST_COMMENT,
  EDIT_COMMENT,
  DELETE_COMMENT,
  GET_COMMENT_LIST,
  NEW_COMMENT_FROM_SOCKET,
} from './types';
import {showAlert} from './alert';

const COMMENT_PERPAGE = 10;

export const newCommentFromSocket = data => ({
  type: NEW_COMMENT_FROM_SOCKET,
  payload: {
    id: data.reference_id,
    type: data.type,
    comment: {
      id: data.comment.id,
      body: data.comment.body,
      user: {data: data.user},
      updated_at: new Date(),
    },
  },
});

export const getCommentList = ({id, type, page = 1}) =>
  generateThunkAction({
    actionType: GET_COMMENT_LIST,
    inputPayload: {id},
    apiOptions: {
      endpoint: `/comments/${id}`,
      params: {
        per_page: COMMENT_PERPAGE,
        page,
        type,
      },
    },
  })();

export const postComment = ({id, type, body}, callback) =>
  generateThunkAction({
    actionType: POST_COMMENT,
    inputPayload: {id},
    apiOptions: {
      endpoint: '/comments',
      method: 'POST',
      data: {
        reference_id: id,
        body,
      },
      params: {
        type,
      },
    },
    callback: {
      success: () => {
        callback && callback();
      },
    },
  })();

export const editComment = ({id, body, hangoutId}, callback) =>
  generateThunkAction({
    actionType: EDIT_COMMENT,
    apiOptions: {
      endpoint: `/comments/${id}`,
      method: 'PUT',
      data: {
        body,
      },
    },
    inputPayload: {id, hangoutId},
    callback: {
      success: (_, dispatch) => {
        callback && callback();
        dispatch(
          showAlert({
            title: 'Success',
            type: 'success',
            body: 'Comment edited!',
          }),
        );
      },
    },
  })();

export const deleteComment = ({id, hangoutId}) =>
  generateThunkAction({
    actionType: DELETE_COMMENT,
    apiOptions: {
      endpoint: `/comments/${id}`,
      method: 'DELETE',
    },
    inputPayload: {id, hangoutId},
    callback: {
      success: (_, dispatch) => {
        dispatch(
          showAlert({
            title: 'Success',
            type: 'success',
            body: 'Comment deleted!',
          }),
        );
      },
    },
  })();
