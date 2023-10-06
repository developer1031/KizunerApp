import {
  FTS_ALL,
  FTS_HANGOUTS,
  FTS_STATUSES,
  FTS_USERS,
  SET_FTS_QUERY,
  CLEAR_SEARCH_RESULT,
  SET_FTS_FILTER,
  FTS_HELP,
} from './types'
import {generateThunkAction} from './utilities'

const PER_PAGE = 10

export function setFtsFilter (payload) {
  return {
    type: SET_FTS_FILTER,
    payload,
  }
}

export function clearSearchResult () {
  return {
    type: CLEAR_SEARCH_RESULT,
  }
}

export function setFtsQuery (query) {
  return {
    type: SET_FTS_QUERY,
    payload: {query},
  }
}

export const ftsAll = ({
  query,
  page,
  age,
  gender,
  categories = null,
  skills = null,
  available_status = null,

  offer_type,
  payment_method,
  location,
  amount,
}) =>
  console.log({
    query,
    page,
    age,
    gender,
    skills,
    categories,
    available_status,
  }) ||
  generateThunkAction({
    actionType: FTS_ALL,
    apiOptions: {
      endpoint: '/search',
      params: {
        query,
        page,
        per_page: PER_PAGE,
        age,
        gender,
        skills,
        categories,
        available_status,
        offer_type,
        payment_method,
        location,
        amount,
      },
    },
  })()

export const ftsHelp = ({query, page}) =>
  generateThunkAction({
    actionType: FTS_HELP,
    apiOptions: {
      endpoint: '/search',
      params: {query, page, type: 'help', per_page: PER_PAGE},
    },
  })()

export const ftsHangouts = ({query, page}) =>
  generateThunkAction({
    actionType: FTS_HANGOUTS,
    apiOptions: {
      endpoint: '/search',
      params: {query, page, type: 'hangouts', per_page: PER_PAGE},
    },
  })()

export const ftsStatuses = ({query, page}) =>
  generateThunkAction({
    actionType: FTS_STATUSES,
    apiOptions: {
      endpoint: '/search',
      params: {query, page, type: 'statuses', per_page: PER_PAGE},
    },
  })()

export const ftsUsers = ({query, page}) =>
  generateThunkAction({
    actionType: FTS_USERS,
    apiOptions: {
      endpoint: '/search',
      params: {query, page, type: 'users', per_page: PER_PAGE},
    },
  })()
