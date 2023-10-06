import {
  LIST_SUGGESTED_SPECIALTIES,
  SEARCH_CATEGORY,
  SEARCH_SPECIALTY,
  LIST_SUGGESTED_CATEGORIES,
} from './types';
import {generateThunkAction} from './utilities';

export const listSuggestedSpecialties = () =>
  generateThunkAction({
    actionType: LIST_SUGGESTED_SPECIALTIES,
    apiOptions: {
      endpoint: '/skills/search',
      params: {
        type: 'suggest',
      },
    },
  })();

export const searchSpecialties = ({query}) =>
  generateThunkAction({
    actionType: SEARCH_SPECIALTY,
    apiOptions: {
      endpoint: '/skills/search',
      params: {
        query,
        per_page: 5,
      },
      useOnce: true,
    },
  })();

export const listSuggestedCategories = () =>
  generateThunkAction({
    actionType: LIST_SUGGESTED_CATEGORIES,
    apiOptions: {
      endpoint: '/categories/search',
      params: {
        type: 'suggest',
      },
    },
  })();

export const searchCategories = ({query}) =>
  generateThunkAction({
    actionType: SEARCH_CATEGORY,
    apiOptions: {
      endpoint: '/categories/search',
      params: {
        query,
        per_page: 5,
      },
      useOnce: true,
    },
  })();
