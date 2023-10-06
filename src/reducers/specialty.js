import {
  LIST_SUGGESTED_SPECIALTIES,
  SEARCH_SPECIALTY,
  LOGOUT,
  LIST_SUGGESTED_CATEGORIES,
  SEARCH_CATEGORY,
} from 'actions';

const INITIAL_STATE = {
  suggested: [],
  searchResults: [],
  loadingSuggested: false,
  searching: false,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case LIST_SUGGESTED_SPECIALTIES.REQUEST:
      return {
        ...state,
        loadingSuggested: true,
      };
    case LIST_SUGGESTED_SPECIALTIES.SUCCESS:
      return {
        ...state,
        loadingSuggested: false,
        suggested: action.payload.data,
      };
    case LIST_SUGGESTED_SPECIALTIES.FAILURE:
      return {
        ...state,
        loadingSuggested: false,
      };

    case LIST_SUGGESTED_CATEGORIES.REQUEST:
      return {
        ...state,
        loadingSuggested: true,
      };
    case LIST_SUGGESTED_CATEGORIES.SUCCESS:
      return {
        ...state,
        loadingSuggested: false,
        suggested: action.payload.data,
      };
    case LIST_SUGGESTED_CATEGORIES.FAILURE:
      return {
        ...state,
        loadingSuggested: false,
      };

    case SEARCH_CATEGORY.REQUEST:
      return {
        ...state,
        searching: true,
      };
    case SEARCH_CATEGORY.SUCCESS:
      return {
        ...state,
        searching: false,
        searchResults: action.payload.data,
      };
    case SEARCH_CATEGORY.FAILURE:
      return {
        ...state,
        searching: false,
      };

    case SEARCH_SPECIALTY.REQUEST:
      return {
        ...state,
        searching: true,
      };
    case SEARCH_SPECIALTY.SUCCESS:
      return {
        ...state,
        searching: false,
        searchResults: action.payload.data,
      };
    case SEARCH_SPECIALTY.FAILURE:
      return {
        ...state,
        searching: false,
      };
    case LOGOUT.SUCCESS:
      return INITIAL_STATE;
    default:
      return state;
  }
};
