import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';

import {API_URL, USER_TOKEN_KEY} from '../utils/constants';

let call;
const once = (config = {}) => {
  if (call) {
    call.cancel('only one request allowed at a time');
  }
  call = axios.CancelToken.source();

  config.cancelToken = call.token;
  return axios(config);
};

export default async ({
  method = 'GET',
  endpoint = '/',
  data,
  headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  params = {},
  useOnce = false,
}) => {
  const token = await AsyncStorage.getItem(USER_TOKEN_KEY);
  const axiost = useOnce ? once : axios;
  console.log(API_URL + endpoint);
  console.log(token);
  //console.log(API_URL + endpoint, data || params);
  try {
    return await axiost({
      method,
      url: API_URL + endpoint,
      data,
      params,
      headers:
        token && token.length
          ? {
              Authorization: `Bearer ${token}`,
              ...headers,
            }
          : headers,
      validateStatus(status) {
        return true;
      },
    });
  } catch (error) {
    return {
      status: 500,
      message: error.message || 'Something went wrong',
    };
  }
};
