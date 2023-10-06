import {
  TOGGLE_THEME,
  GET_GUIDE_VIDEOS,
  GET_CONFIGS,
  REPORT_CONTENT,
  CHECK_UNREAD_NOTIFICATION,
  GET_COUNTRY_LIST,
  GET_REWARD_SETTING,
  GET_TUTORIAL_IMAGES,
} from './types';
import {generateThunkAction} from './utilities';
import {showAlert} from './alert';

export function toggleTheme() {
  return {type: TOGGLE_THEME};
}

export const getGuideVideos = ({page}) =>
  generateThunkAction({
    actionType: GET_GUIDE_VIDEOS,
    apiOptions: {
      endpoint: '/guides',
      params: {
        per_page: 10,
        page,
      },
    },
    callback: {
      success: () => {},
      failure: () => {},
    },
  })();

export const getConfigs = () =>
  generateThunkAction({
    actionType: GET_CONFIGS,
    apiOptions: {
      endpoint: '/configs',
    },
  })();

export const reportContent = ({id, type, reason}, callback) =>
  generateThunkAction({
    actionType: REPORT_CONTENT,
    apiOptions: {
      endpoint: '/reports',
      method: 'POST',
      data: {
        reference_id: id,
        type,
        reason,
      },
    },
    callback: {
      success: (_, dispatch) => {
        dispatch(
          showAlert({
            title: 'Report success',
            type: 'success',
            body: 'We will review your form within 24 hours!',
          }),
        );
        callback && callback();
      },
    },
  })();

export const checkUnreadNotification = ({id}, callback) =>
  generateThunkAction({
    actionType: CHECK_UNREAD_NOTIFICATION,
    apiOptions: {
      endpoint: `/notifications/${id}/badge`,
      method: 'GET',
    },
    callback,
  })();

export const getCountryList = ({}, callback) =>
  generateThunkAction({
    actionType: GET_COUNTRY_LIST,
    apiOptions: {
      endpoint: '/country',
      method: 'GET',
    },
    callback,
  })();

export const getRewardSetting = () =>
  generateThunkAction({
    actionType: GET_REWARD_SETTING,
    apiOptions: {
      endpoint: '/setting/rewards',
      method: 'GET',
    },
  })();

export const getTutorialImages = () =>
  generateThunkAction({
    actionType: GET_TUTORIAL_IMAGES,
    apiOptions: {
      endpoint: '/tutorial_images',
      method: 'GET',
    },
  })();
