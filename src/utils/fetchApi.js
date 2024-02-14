import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import uuid from 'uuid/v4';
import {Linking} from 'react-native';

import {
  API_URL,
  USER_TOKEN_KEY,
  TWITTER_AUTH_URL,
  TWITTER_CONSUMER_KEY,
} from '../utils/constants';

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

  var header = headers;
  if (endpoint.includes('/upload') || endpoint.includes('/identity-document')) {
    header['Content-Type'] = 'multipart/form-data';
  }

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
              ...header,
            }
          : header,
      validateStatus: (status) => {
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

export const twitterAuth = async () => {
  const state = uuid();

  const params = {
    client_id: TWITTER_CONSUMER_KEY,
    scope: 'users.read tweet.read',
    code_challenge_method: 'plain',
    code_challenge: state,
    state: state,
    response_type: 'code',
    redirect_uri: `${API_URL}/redirect_code`,
  };
  const paramString = new URLSearchParams(params).toString();

  const apiWithParams = `${TWITTER_AUTH_URL}?${paramString}`;

  Linking.openURL(apiWithParams);
};
