import {generateThunkAction} from './utilities';

import {
  LIST_LEADERBOARD_CAST,
  LIST_LEADERBOARD_COUNTRY,
  LIST_LEADERBOARD_GLOBAL,
  LIST_LEADERBOARD_GUEST,
  LIST_LEADERBOARD_REGIONAL,
  LIST_LEADERBOARD_REQUESTER,
  LIST_LEADERBOARD_HELPER,
} from './types';

export const getListLeaderBoardGlobal = ({type = 'global'}, callback) =>
  generateThunkAction({
    actionType: LIST_LEADERBOARD_GLOBAL,
    apiOptions: {
      endpoint: `/rewards?type=${type}`,
    },
    callback,
  })();

export const getListLeaderBoardRegional = ({type = 'regional'}, callback) =>
  generateThunkAction({
    actionType: LIST_LEADERBOARD_REGIONAL,
    apiOptions: {
      endpoint: `/rewards?type=${type}`,
    },
    callback,
  })();

export const getListLeaderBoardCountry = ({type = 'country'}, callback) =>
  generateThunkAction({
    actionType: LIST_LEADERBOARD_COUNTRY,
    apiOptions: {
      endpoint: `/rewards?type=${type}`,
    },
    callback,
  })();

export const getListLeaderBoardCast = (
  {type = 'cast', from_date, to_date},
  callback,
) =>
  generateThunkAction({
    actionType: LIST_LEADERBOARD_CAST,
    apiOptions: {
      endpoint: `/leaderboard/by/${type}?from_date=${from_date}&to_date=${to_date}`,
    },
    callback,
  })();

export const getListLeaderBoardGuest = (
  {type = 'guest', from_date, to_date},
  callback,
) =>
  generateThunkAction({
    actionType: LIST_LEADERBOARD_GUEST,
    apiOptions: {
      endpoint: `/leaderboard/by/${type}?from_date=${from_date}&to_date=${to_date}`,
    },
    callback,
  })();

export const getListLeaderBoardRequester = (
  {type = 'requester', from_date, to_date},
  callback,
) =>
  generateThunkAction({
    actionType: LIST_LEADERBOARD_REQUESTER,
    apiOptions: {
      endpoint: `/leaderboard/by/${type}?from_date=${from_date}&to_date=${to_date}`,
    },
    callback,
  })();

export const getListLeaderBoardHelper = (
  {type = 'helper', from_date, to_date},
  callback,
) =>
  generateThunkAction({
    actionType: LIST_LEADERBOARD_HELPER,
    apiOptions: {
      endpoint: `/leaderboard/by/${type}?from_date=${from_date}&to_date=${to_date}`,
    },
    callback,
  })();
