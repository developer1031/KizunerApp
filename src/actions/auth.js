import NavigationService from 'navigation/service';
import AsyncStorage from '@react-native-community/async-storage';
// import {LoginManager} from 'react-native-fbsdk-next';
import auth from '@react-native-firebase/auth';

import {GoogleSignin} from '@react-native-google-signin/google-signin';

import {generateThunkAction} from './utilities';
import {
  LOGIN,
  SIGNUP,
  LOGIN_SOCIAL,
  SEND_VERIFY_PHONE_CODE,
  VERIFY_PHONE,
  UPDATE_SKILLS,
  SKIP_FILLING_SKILL,
  UPDATE_USER_GENERAL,
  UPDATE_USER_AVATAR,
  UPDATE_USER_COVER,
  UPDATE_USER_IDENTIFY,
  UPDATE_USER_PASSWORD,
  UPDATE_USER_LOCATION,
  ADD_USER_SPECIALTIES,
  GET_USER_INFO,
  REMOVE_AVATAR,
  REMOVE_COVER,
  GET_DETAIL_USER,
  CLEAR_DETAIL_USER,
  LOGOUT,
  SEND_RESET_PW_CODE,
  VERIFY_RESET_PW_CODE,
  RESET_PASSWORD,
  VERIFY_EMAIL,
  SEND_VERIFY_EMAIL_CODE,
  ADD_USER_CATEGORIES,
  UPDATE_CATEGORIES,
  TOGGLE_IS_FIRST_LAUNCH,
  TOGGLE_IS_SKIP_LAUNCH,
  TOGGLE_IS_FIRST_POST,
  SET_SHORT_LOCATION,
  INVITE_CONTACT_LIST,
  NEED_VERIFY_EMAIL,
  SUPPORT_BY_EMAIL,
} from './types';
import {USER_TOKEN_KEY} from 'utils/constants';
import {showAlert} from './alert';
import {updateFcmToken} from './notification';
import fetchApi from 'utils/fetchApi';
import {getFcmToken} from 'utils/notificationService';
import {getRewardSetting} from './app';
import {fetchAddressForLocation} from 'utils/geolocationService';
import {hideModalize} from './modalize';

export const sendVerifyPhoneCode = (phone, callback) => {
  return async (dispatch) => {
    dispatch({type: SEND_VERIFY_PHONE_CODE.REQUEST});
    try {
      const confirmResult = await auth().signInWithPhoneNumber(phone);
      dispatch({type: SEND_VERIFY_PHONE_CODE.SUCCESS});
      if (callback) {
        callback();
      } else {
        NavigationService.navigate('VerifyPhone', {confirmResult});
      }
    } catch (error) {
      console.log(error);
      dispatch({type: SEND_VERIFY_PHONE_CODE.FAILURE, payload: error});
      dispatch(
        showAlert({
          title: 'Error',
          body: error.message,
          // body: error.message,
          type: 'error',
        }),
      );
    }
  };
};

export const verifyPhone = ({code, confirmResult, token}) => {
  return async (dispatch, getState) => {
    dispatch({type: VERIFY_PHONE.REQUEST});
    try {
      let idToken;
      if (token) {
        idToken = token;
      } else {
        await confirmResult.confirm(code);

        idToken = await auth().currentUser.getIdToken();
      }
      if (!idToken) {
        throw new Error('Verify failed: No id token found!');
      }
      const {status, data, message} = await fetchApi({
        method: 'POST',
        endpoint: '/user-phone-verify',
        data: {idToken},
      });
      if (status === 200) {
        dispatch({type: VERIFY_PHONE.SUCCESS});
        NavigationService.navigate('MyDetails');
        dispatch(
          showAlert({
            title: 'Success',
            type: 'success',
            body: 'Your phone verified successfully!',
          }),
        );
      } else {
        throw new Error(
          data?.data?.message ||
            data?.errors?.message ||
            data?.message ||
            message ||
            `Undefined error with status ${status}`,
        );
      }
    } catch (error) {
      console.log(error);
      dispatch({type: VERIFY_PHONE.FAILURE, payload: error});
      dispatch(
        showAlert({
          title: 'Error',
          body: __DEV__ ? error.message : 'Something went wrong!',
          type: 'error',
        }),
      );
    }
  };
};

export const sendVerifyEmailCode = (callback) =>
  generateThunkAction({
    actionType: SEND_VERIFY_EMAIL_CODE,
    apiOptions: {
      endpoint: '/users-email-verify',
      method: 'PATCH',
    },
    callback: {
      success: () => {
        if (callback) {
          callback();
        } else {
          NavigationService.navigate('VerifyEmail');
        }
      },
    },
  })();

export const verifyEmail = (pin) =>
  generateThunkAction({
    actionType: VERIFY_EMAIL,
    apiOptions: {
      endpoint: '/users-email-verify/confirm',
      method: 'PATCH',
      data: {pin},
    },
    callback: {
      success: (_, dispatch) => {
        NavigationService.navigate('MyDetails');
        dispatch(
          showAlert({
            title: 'Success',
            type: 'success',
            body: 'Your email verified successfully!',
          }),
        );
      },
    },
  })();

export const sendResetPwCode = (email, callback, callbackParam) =>
  generateThunkAction({
    actionType: SEND_RESET_PW_CODE,
    apiOptions: {
      endpoint: '/users/reset-password',
      method: 'POST',
      data: {email},
    },
    callback: {
      success: () => {
        if (callback) {
          callback();
        } else {
          NavigationService.navigate('VerifyResetCode', {
            email,
            callback: callbackParam,
          });
        }
      },
    },
  })();

export const verifyResetPwCode = (email, pin, callback) =>
  generateThunkAction({
    actionType: VERIFY_RESET_PW_CODE,
    apiOptions: {
      endpoint: '/users/reset-password/pin',
      method: 'POST',
      data: {email, pin},
    },
    callback: {
      success: (result) => {
        NavigationService.navigate('ResetPassword', {
          email,
          token: result?.data?.token,
          callback,
        });
      },
    },
  })();

export const resetPassword = (
  email,
  password,
  password_confirm,
  token,
  callback,
) =>
  generateThunkAction({
    actionType: RESET_PASSWORD,
    apiOptions: {
      endpoint: '/users/reset-password/update',
      method: 'POST',
      data: {email, password, password_confirm, token},
    },
    callback: {
      success: (_, dispatch) => {
        NavigationService.navigate('Login', {email});
        callback(email);
        dispatch(
          showAlert({
            title: 'Success',
            type: 'success',
            body: 'Reset password successfully, please login again!',
          }),
        );
      },
    },
  })();

export const getDetailUser = (userId, callback) =>
  generateThunkAction({
    actionType: GET_DETAIL_USER,
    apiOptions: {
      endpoint: `/users/${userId}`,
    },
    inputPayload: {userId},
    callback,
  })();

export const clearDetailUser = () => ({
  type: CLEAR_DETAIL_USER,
});

export const login = (data) => {
  return generateThunkAction({
    actionType: LOGIN,
    apiOptions: {
      method: 'POST',
      endpoint: '/users/sign-in',
      data,
    },
    preCallback: async (result) => {
      await AsyncStorage.setItem(USER_TOKEN_KEY, result?.data?.access_token);
    },
    callback: {
      success: async (result, dispatch) => {
        /**
         * Update device token
         */
        try {
          const fcmToken = await getFcmToken();
          dispatch(updateFcmToken({fcm_token: fcmToken}));
        } catch (error) {
          console.log(error);
        }
        dispatch(
          showAlert({
            title: 'Success',
            type: 'success',
            body: `Welcome back, ${result?.data?.self?.data?.name}!`,
          }),
        );
      },
    },
  })();
};

export const loginSocial = (provider, token, name, secret = null) =>
  generateThunkAction({
    actionType: LOGIN_SOCIAL,
    apiOptions: {
      method: 'POST',
      endpoint: '/users/social-sign-in',
      params: {provider},
      data: {token, name, secret},
    },
    preCallback: async (result) => {
      await AsyncStorage.setItem(USER_TOKEN_KEY, result?.data?.access_token);
    },
    callback: {
      success: async (result, dispatch) => {
        /**
         * Update device token
         */
        try {
          const fcmToken = await getFcmToken();
          dispatch(updateFcmToken({fcm_token: fcmToken}));
        } catch (error) {
          console.log('Error Login Social ', provider, error);
        }
        dispatch(
          showAlert({
            title: 'Success',
            type: 'success',
            body: `Welcome back, ${result?.data?.self?.data?.name}!`,
          }),
        );
        if (provider === 'facebook') {
          // LoginManager.logOut();
        } else if (provider === 'google') {
          await GoogleSignin.revokeAccess();
          await GoogleSignin.signOut();
        }
      },
    },
  })();

export const signUp = (data) =>
  generateThunkAction({
    actionType: SIGNUP,
    apiOptions: {
      method: 'POST',
      endpoint: '/users/sign-up',
      data,
    },
    preCallback: async (result) => {
      await AsyncStorage.setItem(USER_TOKEN_KEY, result?.data?.access_token);
    },
    callback: {
      success: async (result, dispatch) => {
        /**
         * Update device token
         */
        try {
          const fcmToken = await getFcmToken();
          dispatch(updateFcmToken({fcm_token: fcmToken}));
          dispatch(getRewardSetting());
        } catch (error) {
          console.log(error);
        }
        dispatch(
          showAlert({
            title: 'Success',
            type: 'success',
            body: `Welcome to Kizuner, ${result?.data?.self?.data?.name}!`,
          }),
        );
      },
    },
  })();

export const getUserInfo = () =>
  generateThunkAction({
    actionType: GET_USER_INFO,
    apiOptions: {
      endpoint: '/users',
    },
    callback: {
      success: async (result, dispatch) => {
        // if (result?.data?.resident?.address) {
        //   const location = Object.assign(result?.data?.resident, {
        //     latitude: result?.data?.resident.lat,
        //     longitude: result?.data?.resident.long,
        //   });
        //   const locationShort = await processCoords(location);
        //   dispatch(setShortLocation(locationShort?.short_name || null));
        // }

        dispatch(getRewardSetting());
      },
    },
  })();

export const removeAvatar = () =>
  generateThunkAction({
    actionType: REMOVE_AVATAR,
    apiOptions: {
      endpoint: '/users/media',
      method: 'DELETE',
      params: {
        type: 'user.avatar',
      },
    },
  })();

export const removeCover = () =>
  generateThunkAction({
    actionType: REMOVE_COVER,
    apiOptions: {
      endpoint: '/users/media',
      method: 'DELETE',
      params: {
        type: 'user.cover',
      },
    },
  })();

export const updateUserIdentify = (data) =>
  generateThunkAction({
    actionType: UPDATE_USER_IDENTIFY,
    apiOptions: {
      method: 'PUT',
      endpoint: '/users/identify',
      data,
    },
    callback: {
      success: async (result, dispatch) => {
        await AsyncStorage.setItem(USER_TOKEN_KEY, result?.data?.access_token);
        dispatch(
          showAlert({
            title: 'Success',
            type: 'success',
            body: 'Identify updated',
          }),
        );
      },
    },
  })();

export const updateUserPassword = (data, callback) =>
  generateThunkAction({
    actionType: UPDATE_USER_PASSWORD,
    apiOptions: {
      method: 'PUT',
      endpoint: '/users/auth',
      data,
    },
    callback: {
      success: async (result, dispatch) => {
        await AsyncStorage.setItem(USER_TOKEN_KEY, result?.data?.access_token);
        dispatch(
          showAlert({
            title: 'Success',
            type: 'success',
            body: 'Password updated',
          }),
        );
        callback.success();
      },
    },
  })();

export const updateUserGeneral = (data, callback) =>
  generateThunkAction({
    actionType: UPDATE_USER_GENERAL,
    apiOptions: {
      method: 'PUT',
      endpoint: '/users/general',
      data,
    },
    callback: {
      success: async (result, dispatch) => {
        // if (result?.data?.resident?.address) {
        //   const location = Object.assign(result?.data?.resident, {
        //     latitude: result?.data?.resident.lat,
        //     longitude: result?.data?.resident.long,
        //   });
        //   const locationShort = await processCoords(location);
        //   dispatch(setShortLocation(locationShort?.short_name || null));
        // }

        dispatch(
          showAlert({
            title: 'Success',
            type: 'success',
            body: 'Info updated',
          }),
        );
        callback && callback();
      },
    },
  })();

export const inviteContactList = (data, callback) =>
  generateThunkAction({
    actionType: INVITE_CONTACT_LIST,
    apiOptions: {
      method: 'POST',
      endpoint: '/users/invite-by-contact-list',
      data,
    },
    callback: {
      success: async (result, dispatch) => {
        callback && callback();
        dispatch(
          showAlert({
            title: 'Success',
            type: 'success',
            body: 'Send your friend succesfull!',
          }),
        );
        dispatch(hideModalize());
      },
    },
  })();

export const updateUserLocation = (data) =>
  generateThunkAction({
    actionType: UPDATE_USER_LOCATION,
    apiOptions: {
      method: 'PUT',
      endpoint: '/users/location',
      data,
    },
  })();

export const addUserSpecialties = (data, callback) =>
  generateThunkAction({
    actionType: ADD_USER_SPECIALTIES,
    apiOptions: {
      method: 'POST',
      endpoint: '/users/skills',
      data,
    },
    callback,
  })();

export const updateSkills = (data, callback) =>
  generateThunkAction({
    actionType: UPDATE_SKILLS,
    apiOptions: {
      method: 'PUT',
      endpoint: '/users/general',
      data,
    },
    callback: {
      success: (result, dispatch) => {
        callback?.success();
        dispatch(
          showAlert({
            title: 'Success',
            type: 'success',
            body: 'Specialties updated',
          }),
        );
      },
    },
  })();

export const addUserCategories = (data, callback) =>
  generateThunkAction({
    actionType: ADD_USER_CATEGORIES,
    apiOptions: {
      method: 'POST',
      endpoint: '/users/categories',
      data,
    },
    callback,
  })();

export const updateCategories = (data, callback) =>
  generateThunkAction({
    actionType: UPDATE_CATEGORIES,
    apiOptions: {
      method: 'PUT',
      endpoint: '/users/general',
      data,
    },
    callback: {
      success: (result, dispatch) => {
        callback?.success();
        dispatch(
          showAlert({
            title: 'Success',
            type: 'success',
            body: 'Categories updated',
          }),
        );
      },
    },
  })();

export const updateUserAvatar = (data) => {
  return generateThunkAction({
    actionType: UPDATE_USER_AVATAR,
    apiOptions: {
      method: 'POST',
      endpoint: '/upload/single',
      data,
    },
    callback: {
      success: (result, dispatch) => {
        dispatch(
          showAlert({
            title: 'Success',
            type: 'success',
            body: 'Avatar updated',
          }),
        );
      },
    },
  })();
};

export const updateUserCover = (data) => {
  return generateThunkAction({
    actionType: UPDATE_USER_COVER,
    apiOptions: {
      method: 'POST',
      endpoint: '/upload/single',
      data,
    },
    callback: {
      success: (result, dispatch) => {
        dispatch(
          showAlert({
            title: 'Success',
            type: 'success',
            body: 'Cover updated',
          }),
        );
      },
    },
  })();
};

export function mockLogin() {
  return async (dispatch) => {
    dispatch({type: LOGIN_SOCIAL.SUCCESS});
  };
}

export function skipFillingSkill() {
  NavigationService.navigate('AppTab');
  return {type: SKIP_FILLING_SKILL};
}

export const logout = (callback, noAlert) =>
  generateThunkAction({
    actionType: LOGOUT,
    apiOptions: {
      method: 'POST',
      endpoint: '/users/logout',
    },
    callback: {
      success: async (_, dispatch) => {
        AsyncStorage.removeItem(USER_TOKEN_KEY);
        AsyncStorage.getAllKeys().then((keys) =>
          AsyncStorage.multiRemove(keys),
        );

        // await appleAuth.performRequest({
        //   requestedOperation: appleAuth.Operation.LOGOUT,
        // });

        callback && callback();
        !noAlert &&
          dispatch(
            showAlert({
              title: 'Success',
              type: 'success',
              body: 'Logged out!',
            }),
          );
      },
      failure: (_, dispatch) => {
        AsyncStorage.removeItem(USER_TOKEN_KEY);
        callback && callback();
      },
    },
  })();

export const toggleIsFirstLaunch = (value) => {
  return (dispatch) => {
    dispatch({type: TOGGLE_IS_FIRST_LAUNCH, payload: value});
  };
};

export const toggleIsSkipLauch = (isSkip) => {
  return (dispatch) => {
    dispatch({type: TOGGLE_IS_SKIP_LAUNCH, payload: isSkip});
  };
};

export const toggleIsFirstPost = () => {
  return (dispatch) => {
    dispatch({type: TOGGLE_IS_FIRST_POST, payload: true});
  };
};

export const setShortLocation = (short) => {
  return {type: SET_SHORT_LOCATION, payload: short};
};

export const setNeedVerifyEmail = (val = true) => {
  return (dispatch) => {
    dispatch({type: NEED_VERIFY_EMAIL, payload: val});
  };
};

const processCoords = async (coords) => {
  try {
    const result = await fetchAddressForLocation(coords);
    const areaTemp = result?.address_components?.find(
      (item) =>
        item.types?.includes('administrative_area_level_2') ||
        item.types?.includes('administrative_area_level_1') ||
        item.types?.includes('country'),
    );
    return areaTemp;
  } catch (ex) {
    return;
  }
};

export const supportByEmail = (data) => {
  return generateThunkAction({
    actionType: SUPPORT_BY_EMAIL,
    apiOptions: {
      method: 'POST',
      endpoint: '/users/support',
      data,
    },
    callback: {
      success: (result, dispatch) => {
        NavigationService.goBack();
        dispatch(
          showAlert({
            title: 'Success',
            type: 'success',
            body: 'Send successfully!',
          }),
        );
      },
    },
  })();
};
