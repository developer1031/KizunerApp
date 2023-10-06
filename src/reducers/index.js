import {combineReducers} from 'redux';

import app from './app';
import auth from './auth';
import location from './location';
import alert from './alert';
import modalize from './modalize';
import specialty from './specialty';
import contact from './contact';
import userProfile from './userProfile';
import feed from './feed';
import feedDetail from './feedDetail';
import chat from './chat';
import search from './search';
import wallet from './wallet';
import rating from './rating';
import notification from './notification';
import offer from './offer';
import trophy from './trophy';
import modalizeAll from './modalizeAll';

export default combineReducers({
  app,
  auth,
  location,
  alert,
  modalize,
  specialty,
  contact,
  userProfile,
  feed,
  feedDetail,
  chat,
  search,
  wallet,
  rating,
  notification,
  offer,
  trophy,
  modalizeAll,
});
