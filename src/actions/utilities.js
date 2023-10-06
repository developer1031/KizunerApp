import fetchApi from 'utils/fetchApi';
import {showAlert} from './alert';
import {logout, toggleIsFirstLaunch} from './auth';

export function generateThunkType(type) {
  return {
    REQUEST: `${type}_REQUEST`,
    SUCCESS: `${type}_SUCCESS`,
    FAILURE: `${type}_FAILURE`,
  };
}

export function generateThunkAction({
  actionType = generateThunkType('ACTION'),
  callback,
  preCallback,
  inputPayload,
  apiOptions = {
    endpoint: '/',
    method: 'GET',
    data: null,
  },
  acceptStatus = [200, 201],
}) {
  return () => {
    return async (dispatch, getState) => {
      dispatch({
        type: actionType.REQUEST,
        payload: {...apiOptions, inputPayload},
      });
      try {
        const result = await fetchApi(apiOptions);
        // console.log('🚀 ~ file: utilities.js:33 ~ return ~ result:', result);
        const {status, data, message} = result;
        console.log('🚀 ~ file: utilities.js:35 ~ return ~ data:', data);

        const {url, headers, method, params, data: body} = result.config;
        console.log('================== curl ==================');
        console.log(method + ' - ' + url);
        console.log(headers);
        console.log(params);
        console.log(body);
        console.log('================== response');
        console.log(data);

        if (acceptStatus.includes(status)) {
          if (data?.data?.errors?.message) {
            dispatch(
              showAlert({
                title: 'Error',
                body: data?.data?.errors?.message,
                type: 'error',
              }),
            );
            return;
          }

          preCallback && (await preCallback(data));
          dispatch({
            type: actionType.SUCCESS,
            payload: {
              ...data,
              inputPayload: inputPayload || apiOptions.data,
            },
          });
          callback?.success(data, dispatch);
        } else {
          const isAuth = getState().auth.isAuth;
          if (
            (status === 401 || data?.message === 'Unauthenticated.') &&
            isAuth
          ) {
            // Perform logout action
            dispatch(toggleIsFirstLaunch(false));
            dispatch(
              logout(
                () =>
                  dispatch(
                    showAlert({
                      title: 'Error',
                      body: 'Session expired, please sign in again!',
                      type: 'error',
                    }),
                  ),
                true,
              ),
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
        }
      } catch (error) {
        console.log('=================================');
        console.log('=================================');
        console.log('=========== error ===============');
        console.log(error);
        console.log(apiOptions);
        console.log('=================================');
        console.log('=================================');
        console.log('=================================');
        dispatch({
          type: actionType.FAILURE,
          payload: {error, inputPayload},
        });
        callback?.failure || apiOptions?.useOnce
          ? callback?.failure(error.message, dispatch, error)
          : error.message !== 'Unauthenticated.' &&
            dispatch(
              showAlert({
                title: 'Error',
                body: '__DEV__' ? error.message : 'Something went wrong!',
                // body: error.message,
                type: 'error',
              }),
            );
      }
    };
  };
}
