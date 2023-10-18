import {createStore, applyMiddleware} from 'redux';
import {persistStore, persistReducer} from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';
import thunk from 'redux-thunk';
import {createFilter} from 'redux-persist-transform-filter';

import reducers from '../reducers';
import {PERSIST_KEY} from '../utils/constants';

const persistConfig = {
  key: PERSIST_KEY,
  storage: AsyncStorage,
  whitelist: ['auth', 'location', 'app'],
  transforms: [
    createFilter('auth', [
      'isAuth',
      'userInfo',
      'accessToken',
      'streamToken',
      'isSkillSkiped',
      'isPhoneVerified',
      'shortLocationUser',
    ]),
    createFilter('app', ['isFirstLaunch', 'isSkipLaunch']),
  ],
};

const persistedReducer = persistReducer(persistConfig, reducers);

const store = createStore(persistedReducer, applyMiddleware(thunk));

export const persistor = persistStore(store);

export default store;
