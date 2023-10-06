import {
  LIST_LEADERBOARD_CAST,
  LIST_LEADERBOARD_COUNTRY,
  LIST_LEADERBOARD_GLOBAL,
  LIST_LEADERBOARD_GUEST,
  LIST_LEADERBOARD_REGIONAL,
  LIST_LEADERBOARD_REQUESTER,
  LIST_LEADERBOARD_HELPER,
  GET_TUTORIAL_IMAGES,
} from 'actions';

const INITIAL_STATE = {
  leaderboardGlobalListLoading: false,
  leaderboardGlobalList: {},

  leaderboardRegionalListLoading: false,
  leaderboardRegionalList: {},

  leaderboardCountryListLoading: false,
  leaderboardCountryList: {},

  leaderboardCastListLoading: false,
  leaderboardCastList: {},

  leaderboardRequesterListLoading: false,
  leaderboardRequesterList: {},

  leaderboardGuestListLoading: false,
  leaderboardGuestList: {},

  leaderboardHelperListLoading: false,
  leaderboardHelperList: {},

  tutorialImagesList: [],
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case LIST_LEADERBOARD_GLOBAL.REQUEST:
      return {
        ...state,
        leaderboardGlobalListLoading: true,
        leaderboardGlobalList: {},
      };
    case LIST_LEADERBOARD_GLOBAL.SUCCESS:
      return {
        ...state,
        leaderboardGlobalListLoading: false,
        leaderboardGlobalList: action.payload,
      };
    case LIST_LEADERBOARD_GLOBAL.FAILURE:
      return {
        ...state,
        leaderboardGlobalListLoading: false,
      };

    case LIST_LEADERBOARD_REGIONAL.REQUEST:
      return {
        ...state,
        leaderboardRegionalListLoading: true,
        leaderboardRegionalList: {},
      };
    case LIST_LEADERBOARD_REGIONAL.SUCCESS:
      return {
        ...state,
        leaderboardRegionalListLoading: false,
        leaderboardRegionalList: action.payload,
      };
    case LIST_LEADERBOARD_REGIONAL.FAILURE:
      return {
        ...state,
        leaderboardRegionalListLoading: false,
      };

    case LIST_LEADERBOARD_COUNTRY.REQUEST:
      return {
        ...state,
        leaderboardCountryListLoading: true,
        leaderboardCountryList: {},
      };
    case LIST_LEADERBOARD_COUNTRY.SUCCESS:
      return {
        ...state,
        leaderboardCountryListLoading: false,
        leaderboardCountryList: action.payload,
      };
    case LIST_LEADERBOARD_COUNTRY.FAILURE:
      return {
        ...state,
        leaderboardCountryListLoading: false,
      };

    case LIST_LEADERBOARD_CAST.REQUEST:
      return {
        ...state,
        leaderboardCastListLoading: true,
        leaderboardCastList: {},
      };
    case LIST_LEADERBOARD_CAST.SUCCESS:
      return {
        ...state,
        leaderboardCastListLoading: false,
        leaderboardCastList: action.payload,
      };
    case LIST_LEADERBOARD_CAST.FAILURE:
      return {
        ...state,
        leaderboardCastListLoading: false,
      };

    case LIST_LEADERBOARD_GUEST.REQUEST:
      return {
        ...state,
        leaderboardGuestListLoading: true,
        leaderboardGuestList: {},
      };
    case LIST_LEADERBOARD_GUEST.SUCCESS:
      return {
        ...state,
        leaderboardGuestListLoading: false,
        leaderboardGuestList: action.payload,
      };
    case LIST_LEADERBOARD_GUEST.FAILURE:
      return {
        ...state,
        leaderboardGuestListLoading: false,
      };

    case LIST_LEADERBOARD_REQUESTER.REQUEST:
      return {
        ...state,
        leaderboardRequesterListLoading: true,
        leaderboardRequesterList: {},
      };
    case LIST_LEADERBOARD_REQUESTER.SUCCESS:
      return {
        ...state,
        leaderboardRequesterListLoading: false,
        leaderboardRequesterList: action.payload,
      };
    case LIST_LEADERBOARD_REQUESTER.FAILURE:
      return {
        ...state,
        leaderboardRequesterListLoading: false,
      };

    case LIST_LEADERBOARD_HELPER.REQUEST:
      return {
        ...state,
        leaderboardHelperListLoading: true,
        leaderboardHelperList: {},
      };
    case LIST_LEADERBOARD_HELPER.SUCCESS:
      return {
        ...state,
        leaderboardHelperListLoading: false,
        leaderboardHelperList: action.payload,
      };
    case LIST_LEADERBOARD_HELPER.FAILURE:
      return {
        ...state,
        leaderboardHelperListLoading: false,
      };

    case GET_TUTORIAL_IMAGES.SUCCESS:
      return {
        ...state,
        tutorialImagesList: action.payload.data,
      };
    default:
      return state;
  }
};
