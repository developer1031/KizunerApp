import {
  FTS_ALL,
  FTS_HANGOUTS,
  FTS_STATUSES,
  FTS_USERS,
  FTS_HELP,
  SET_FTS_QUERY,
  CLEAR_SEARCH_RESULT,
  SET_FTS_FILTER,
} from 'actions';

const INITIAL_STATE = {
  query: '',
  gender: null,
  age: null,
  loading: false,
  users: [],
  usersPage: 1,
  usersLoading: false,
  hangouts: [],
  hangoutsPage: 1,
  hangoutsLoading: false,
  helps: [],
  helpsPage: 1,
  helpsLoading: false,
  statuses: [],
  statusesPage: 1,
  statusesLoading: false,
  skills: null,
  categories: null,
  available_status: null,

  videos: [],
  videosPage: 1,
  videosLoading: false,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SET_FTS_FILTER:
      return {
        ...state,
        age: action.payload.age,
        gender: action.payload.gender,
        skills: action.payload.skills,
        categories: action.payload.categories,
        available_status: action.payload.available_status,
      };
    case CLEAR_SEARCH_RESULT:
      return {
        ...state,
        users: [],
        usersPage: 1,
        usersLoading: false,
        hangouts: [],
        hangoutsPage: 1,
        hangoutsLoading: false,
        statuses: [],
        statusesPage: 1,
        statusesLoading: false,
        helps: [],
        helpsPage: 1,
        helpsLoading: false,
        skills: null,
        categories: null,
        available_status: null,

        videos: [],
        videosPage: 1,
        videosLoading: false,
      };
    case SET_FTS_QUERY:
      return {
        ...state,
        query: action.payload.query,
      };
    case FTS_ALL.REQUEST:
      return {
        ...state,
        loading: true,
      };
    case FTS_ALL.SUCCESS:
      return {
        ...state,
        loading: false,
        users:
          action.payload.data.users.meta.pagination.current_page === 1
            ? action.payload.data.users.data
            : [...state.users, ...action.payload.data.users.data],
        usersPage: action.payload.data.users.meta.pagination.total_pages,
        videos: action.payload.data?.videos?.data || [],
        hangouts: action.payload.data.hangouts.data,
        statuses: action.payload.data.statuses.data,
        helps: action.payload.data.helps.data,
      };
    case FTS_ALL.FAILURE:
      return {
        ...state,
        loading: false,
      };
    default:
      return state;
  }
};
