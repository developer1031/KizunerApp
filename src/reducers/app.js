import {
  TOGGLE_THEME,
  GET_GUIDE_VIDEOS,
  GET_CONFIGS,
  REPORT_CONTENT,
  CHECK_UNREAD_NOTIFICATION,
  GET_COUNTRY_LIST,
  TOGGLE_IS_FIRST_LAUNCH,
  TOGGLE_IS_SKIP_LAUNCH,
  GET_REWARD_SETTING,
} from 'actions';

const INITIAL_STATE = {
  theme: 'orangeLight',
  guideVideos: [],
  guideVideosLoading: false,
  guideVideosError: null,
  guideVideoLastPage: 1,
  policyData: null,
  termData: null,
  faqData: null,
  configLoading: false,
  reporting: false,
  isAnyNotificationUnRead: false,
  countryList: [],
  rewardList: [],
  isFirstLaunch: false,
  isSkipLaunch: false,
  nearbyRadius: 15,
  mapRadius: 15000,
  aboutData: null,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case REPORT_CONTENT.REQUEST:
      return {
        ...state,
        reporting: true,
      };
    case REPORT_CONTENT.SUCCESS:
      return {
        ...state,
        reporting: false,
      };
    case REPORT_CONTENT.FAILURE:
      return {
        ...state,
        reporting: false,
      };
    case GET_CONFIGS.REQUEST:
      return {
        ...state,
        configLoading: true,
      };
    case GET_CONFIGS.SUCCESS:
      return {
        ...state,
        configLoading: false,
        termData: action.payload.data?.find((item) => item.path === 'term')
          ?.value,
        policyData: action.payload.data?.find((item) => item.path === 'policy')
          ?.value,
        faqData: action.payload.data?.find((item) => item.path === 'faq')
          ?.value,
        nearbyRadius: action.payload.data?.find(
          (item) => item.path === 'nearby_radius',
        )?.value,
        mapRadius: action.payload.data?.find(
          (item) => item.path === 'map_radius',
        )?.value,
        aboutData: action.payload.data?.find((item) => item.path === 'about')
          ?.value,
      };
    case GET_CONFIGS.FAILURE:
      return {
        ...state,
        configLoading: false,
      };
    case TOGGLE_THEME:
      return {
        ...state,
        theme:
          state.theme === 'orangeLight'
            ? 'blackLivesMatter'
            : state.theme === 'blackLivesMatter'
            ? 'pinkLight'
            : 'orangeLight',
      };
    case GET_GUIDE_VIDEOS.REQUEST:
      return {
        ...state,
        guideVideosLoading: true,
      };
    case GET_GUIDE_VIDEOS.SUCCESS:
      return {
        ...state,
        guideVideosLoading: false,
        guideVideos:
          action.payload.meta.pagination.current_page === 1
            ? action.payload.data
            : [...state.guideVideos, ...action.payload.data],
        guideVideoLastPage: action.payload.meta.pagination.total_pages,
      };
    case GET_GUIDE_VIDEOS.FAILURE:
      return {
        ...state,
        guideVideosLoading: false,
        guideVideosError: action.payload.error,
      };
    case GET_COUNTRY_LIST.SUCCESS:
      return {
        ...state,
        countryList: action.payload.data,
      };
    case GET_REWARD_SETTING.SUCCESS:
      return {
        ...state,
        rewardList: action.payload.data,
      };
    case TOGGLE_IS_FIRST_LAUNCH:
      return {
        ...state,
        isFirstLaunch: action.payload,
      };
    case TOGGLE_IS_SKIP_LAUNCH:
      return {
        ...state,
        isSkipLaunch: action.payload,
      };
    case CHECK_UNREAD_NOTIFICATION.SUCCESS:
      return {
        ...state,
        isAnyNotificationUnRead: true,
      };
    case CHECK_UNREAD_NOTIFICATION.FAILURE:
      return {
        ...state,
      };
    default:
      return state;
  }
};
