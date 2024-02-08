import {
  LOGIN,
  LOGIN_SOCIAL,
  SIGNUP,
  VERIFY_PHONE,
  SEND_VERIFY_PHONE_CODE,
  UPDATE_SKILLS,
  SKIP_FILLING_SKILL,
  SET_SHORT_LOCATION,
  LOGOUT,
  UPDATE_USER_GENERAL,
  UPDATE_USER_AVATAR,
  UPDATE_USER_COVER,
  UPDATE_USER_IDENTIFY,
  UPDATE_USER_PASSWORD,
  UPDATE_USER_LOCATION,
  ADD_USER_SPECIALTIES,
  GET_USER_INFO,
  REMOVE_COVER,
  REMOVE_AVATAR,
  ACCEPT_FRIEND_REQUEST,
  UNFRIEND,
  RESET_PASSWORD,
  VERIFY_RESET_PW_CODE,
  SEND_RESET_PW_CODE,
  SEND_VERIFY_EMAIL_CODE,
  VERIFY_EMAIL,
  NOTI_NEW_FOLLOW,
  NOTI_FRIEND_ACCEPTED,
  TOGGLE_IS_FIRST_POST,
  ADD_USER_CATEGORIES,
  UPDATE_CATEGORIES,
  //TOGGLE_IS_FIRST_LAUNCH,
  NEED_VERIFY_EMAIL,
  UPDATE_USER_DETAIL,
} from 'actions';

const INITIAL_STATE = {
  isAuth: false,
  //isFirstLaunch: false,
  userInfo: null,
  accessToken: null,
  streamToken: null,
  isSkillSkiped: false,
  beingLogin: false,
  beingUpdateGeneral: false,
  beingUpdateAvatar: false,
  beingUpdateCover: false,
  beingUpdateIdentify: false,
  beingUpdatePassword: false,
  beingUpdateLocation: false,
  beingGetInfo: false,
  beingSignUp: false,
  beingSendResetPwCode: false,
  beingVerifyResetPwCode: false,
  beingResetPassword: false,
  beingSendVerifyEmailCode: false,
  beingVerifyEmail: false,
  beingSendVerifyPhoneCode: false,
  beingVerifyPhone: false,
  shortLocationUser: null,

  needVerifyEmail: false,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case VERIFY_PHONE.REQUEST:
      return {
        ...state,
        beingVerifyPhone: true,
      };
    case VERIFY_PHONE.SUCCESS:
      return {
        ...state,
        beingVerifyPhone: false,
        userInfo: {
          ...state.userInfo,
          phone_verified_at: new Date(),
        },
      };
    case VERIFY_PHONE.FAILURE:
      return {
        ...state,
        beingVerifyPhone: false,
      };
    case SEND_VERIFY_PHONE_CODE.REQUEST:
      return {
        ...state,
        beingSendVerifyPhoneCode: true,
      };
    case SEND_VERIFY_PHONE_CODE.SUCCESS:
      return {
        ...state,
        beingSendVerifyPhoneCode: false,
      };
    case SEND_VERIFY_PHONE_CODE.FAILURE:
      return {
        ...state,
        beingSendVerifyPhoneCode: false,
      };
    case VERIFY_EMAIL.REQUEST:
      return {
        ...state,
        beingVerifyEmail: true,
        needVerifyEmail: true,
      };
    case VERIFY_EMAIL.SUCCESS:
      return {
        ...state,
        beingVerifyEmail: false,
        needVerifyEmail: false,
        userInfo: {
          ...state.userInfo,
          email_verified_at: new Date(),
        },
      };
    case VERIFY_EMAIL.FAILURE:
      return {
        ...state,
        beingVerifyEmail: false,
        needVerifyEmail: false,
      };
    case SEND_VERIFY_EMAIL_CODE.REQUEST:
      return {
        ...state,
        beingSendVerifyEmailCode: true,
      };
    case SEND_VERIFY_EMAIL_CODE.SUCCESS:
      return {
        ...state,
        beingSendVerifyEmailCode: false,
      };
    case SEND_VERIFY_EMAIL_CODE.FAILURE:
      return {
        ...state,
        beingSendVerifyEmailCode: false,
      };
    case SEND_RESET_PW_CODE.REQUEST:
      return {
        ...state,
        beingSendResetPwCode: true,
      };
    case SEND_RESET_PW_CODE.SUCCESS:
      return {
        ...state,
        beingSendResetPwCode: false,
      };
    case SEND_RESET_PW_CODE.FAILURE:
      return {
        ...state,
        beingSendResetPwCode: false,
      };
    case VERIFY_RESET_PW_CODE.REQUEST:
      return {
        ...state,
        beingVerifyResetPwCode: true,
      };
    case VERIFY_RESET_PW_CODE.SUCCESS:
      return {
        ...state,
        beingVerifyResetPwCode: false,
      };
    case VERIFY_RESET_PW_CODE.FAILURE:
      return {
        ...state,
        beingVerifyResetPwCode: false,
      };
    case RESET_PASSWORD.REQUEST:
      return {
        ...state,
        beingResetPassword: true,
      };
    case RESET_PASSWORD.SUCCESS:
      return {
        ...state,
        beingResetPassword: false,
      };
    case RESET_PASSWORD.FAILURE:
      return {
        ...state,
        beingResetPassword: false,
      };
    case ACCEPT_FRIEND_REQUEST.SUCCESS:
      return {
        ...state,
        userInfo: {
          ...state.userInfo,
          relation: {
            ...state.userInfo?.relation,
            friend: state.userInfo?.relation.friend + 1,
            follower: state.userInfo?.relation.follower + 1,
          },
        },
      };
    case NOTI_NEW_FOLLOW:
      return {
        ...state,
        userInfo: {
          ...state.userInfo,
          relation: {
            ...state.userInfo?.relation,
            follower: state.userInfo?.relation.follower + 1,
          },
        },
      };
    case NOTI_FRIEND_ACCEPTED:
      return {
        ...state,
        userInfo: {
          ...state.userInfo,
          relation: {
            ...state.userInfo?.relation,
            friend: state.userInfo?.relation.friend + 1,
            follower: state.userInfo?.relation.follower + 1,
          },
        },
      };
    case UNFRIEND.SUCCESS:
      return {
        ...state,
        userInfo: {
          ...state.userInfo,
          relation: {
            ...state.userInfo?.relation,
            friend:
              state.userInfo?.relation.friend > 0
                ? state.userInfo?.relation.friend - 1
                : 0,
            follower:
              state.userInfo?.relation.follower > 0
                ? state.userInfo?.relation.follower - 1
                : 0,
          },
        },
      };
    case REMOVE_AVATAR.SUCCESS:
      return {
        ...state,
        userInfo: state.userInfo && {
          ...state.userInfo,
          media: {
            avatar: null,
          },
        },
      };
    case REMOVE_COVER.SUCCESS:
      return {
        ...state,
        userInfo: state.userInfo && {
          ...state.userInfo,
          media: {
            cover: null,
          },
        },
      };
    case UPDATE_USER_PASSWORD.REQUEST:
      return {
        ...state,
        beingUpdatePassword: true,
      };
    case UPDATE_USER_PASSWORD.SUCCESS:
      return {
        ...state,
        beingUpdatePassword: false,
        userInfo: action.payload?.data?.self?.data,
        accessToken: action.payload?.data?.access_token,
        streamToken: action.payload?.data?.stream_token,
      };
    case UPDATE_USER_PASSWORD.FAILURE:
      return {
        ...state,
        beingUpdatePassword: false,
      };
    case UPDATE_USER_IDENTIFY.REQUEST:
      return {
        ...state,
        beingUpdateIdentify: true,
      };
    case UPDATE_USER_IDENTIFY.SUCCESS:
      return {
        ...state,
        beingUpdateIdentify: false,
        userInfo: action.payload?.data?.self?.data,
        accessToken: action.payload?.data?.access_token,
        streamToken: action.payload?.data?.stream_token,
      };
    case UPDATE_USER_IDENTIFY.FAILURE:
      return {
        ...state,
        beingUpdateIdentify: false,
      };
    case UPDATE_USER_AVATAR.REQUEST:
      return {
        ...state,
        beingUpdateAvatar: true,
      };
    case UPDATE_USER_AVATAR.SUCCESS:
      return {
        ...state,
        beingUpdateAvatar: false,
        userInfo: {
          ...state.userInfo,
          media: {
            ...state.userInfo?.media,
            avatar: action.payload.data,
          },
        },
      };
    case UPDATE_USER_AVATAR.FAILURE:
      return {
        ...state,
        beingUpdateAvatar: false,
      };
    case UPDATE_USER_COVER.REQUEST:
      return {
        ...state,
        beingUpdateCover: true,
      };
    case UPDATE_USER_COVER.SUCCESS:
      return {
        ...state,
        beingUpdateCover: false,
        userInfo: {
          ...state.userInfo,
          media: {
            ...state.userInfo?.media,
            cover: action.payload.data,
          },
        },
      };
    case UPDATE_USER_COVER.FAILURE:
      return {
        ...state,
        beingUpdateCover: false,
      };
    case UPDATE_USER_GENERAL.REQUEST:
      return {
        ...state,
        beingUpdateGeneral: true,
      };
    case UPDATE_USER_GENERAL.SUCCESS:
      return {
        ...state,
        beingUpdateGeneral: false,
        userInfo: {
          ...state.userInfo,
          ...action.payload.data,
        },
      };
    case UPDATE_USER_GENERAL.FAILURE:
      return {
        ...state,
        beingUpdateGeneral: false,
      };
    case UPDATE_USER_LOCATION.REQUEST:
      return {
        ...state,
        beingUpdateLocation: true,
      };
    case UPDATE_USER_LOCATION.SUCCESS:
      return {
        ...state,
        beingUpdateLocation: false,
        userInfo: action.payload.data,
      };
    case UPDATE_USER_LOCATION.FAILURE:
      return {
        ...state,
        beingUpdateLocation: false,
      };
    case GET_USER_INFO.REQUEST:
      return {
        ...state,
        beingGetInfo: true,
      };
    case GET_USER_INFO.SUCCESS:
      return {
        ...state,
        beingGetInfo: false,
        userInfo: action.payload.data,
      };
    case GET_USER_INFO.FAILURE:
      return {
        ...state,
        beingGetInfo: false,
      };
    case LOGIN.REQUEST:
      return {
        ...state,
        beingLogin: true,
      };
    case LOGIN.SUCCESS:
      return {
        ...state,
        isAuth: true,
        userInfo: action.payload?.data?.self?.data,
        accessToken: action.payload?.data?.access_token,
        streamToken: action.payload?.data?.stream_token,
        beingLogin: false,
      };
    // case TOGGLE_IS_FIRST_LAUNCH:
    //   return {
    //     ...state,
    //     isFirstLaunch: true,
    //   };
    case LOGIN.FAILURE:
      return {
        ...state,
        beingLogin: false,
      };
    case LOGIN_SOCIAL.REQUEST:
      return {
        ...state,
        beingLogin: true,
      };
    case LOGIN_SOCIAL.SUCCESS:
      return {
        ...state,
        isAuth: true,
        userInfo: action.payload?.data?.self?.data,
        accessToken: action.payload?.data?.access_token,
        streamToken: action.payload?.data?.stream_token,
        beingLogin: false,
      };
    case LOGIN_SOCIAL.FAILURE:
      return {
        ...state,
        beingLogin: false,
      };
    case SIGNUP.REQUEST:
      return {
        ...state,
        beingSignUp: true,
      };
    case SIGNUP.SUCCESS:
      return {
        ...state,
        isAuth: true,
        userInfo: action.payload?.data?.self?.data,
        accessToken: action.payload?.data?.access_token,
        streamToken: action.payload?.data?.stream_token,
        beingSignUp: false,

        needVerifyEmail: true,
      };
    case SIGNUP.FAILURE:
      return {
        ...state,
        isAuth: false,
        beingSignUp: false,
      };
    case UPDATE_SKILLS.REQUEST:
      return {
        ...state,
        beingUpdateGeneral: true,
      };
    case UPDATE_SKILLS.SUCCESS:
      return {
        ...state,
        beingUpdateGeneral: false,
        userInfo: {
          ...state.userInfo,
          ...action.payload.data,
          isSkillsUpdated: true,
        },
      };
    case UPDATE_SKILLS.FAILURE:
      return {
        ...state,
        beingUpdateGeneral: false,
      };
    case UPDATE_CATEGORIES.REQUEST:
      return {
        ...state,
        beingUpdateGeneral: true,
      };
    case UPDATE_CATEGORIES.SUCCESS:
      return {
        ...state,
        beingUpdateGeneral: false,
        userInfo: {
          ...state.userInfo,
          ...action.payload.data,
        },
      };
    case UPDATE_CATEGORIES.FAILURE:
      return {
        ...state,
        beingUpdateGeneral: false,
      };
    case ADD_USER_SPECIALTIES.REQUEST:
      return {
        ...state,
        beingUpdateGeneral: true,
      };
    case ADD_USER_SPECIALTIES.SUCCESS:
      /// Q&A21
      return {
        ...state,
        beingUpdateGeneral: false,
        userInfo: {
          ...state.userInfo,
          //...action.payload.data,
          isSkillsUpdated: true,
        },
      };
    case ADD_USER_SPECIALTIES.FAILURE:
      return {
        ...state,
        beingUpdateGeneral: false,
      };
    case ADD_USER_CATEGORIES.REQUEST:
      return {
        ...state,
        beingUpdateGeneral: true,
      };
    case ADD_USER_CATEGORIES.SUCCESS:
      /// Q&A21
      return {
        ...state,
        beingUpdateGeneral: false,
        userInfo: {
          ...state.userInfo,
          //...action.payload.data,
          isSkillsUpdated: true,
        },
      };
    case ADD_USER_CATEGORIES.FAILURE:
      return {
        ...state,
        beingUpdateGeneral: false,
      };
    case TOGGLE_IS_FIRST_POST: {
      return {
        ...state,
        userInfo: {
          ...state.userInfo,
          has_posted: true,
        },
      };
    }
    case SET_SHORT_LOCATION: {
      return {
        ...state,
        shortLocationUser: action.payload,
      };
    }
    case SKIP_FILLING_SKILL:
      return {
        ...state,
        isSkillSkiped: true,
      };
    case LOGOUT.REQUEST:
      return INITIAL_STATE;

    case NEED_VERIFY_EMAIL.REQUEST:
      return {
        ...state,
        needVerifyEmail: action.payload,
      };
    case UPDATE_USER_DETAIL:
      return {
        ...state,
        userInfo: {
          ...state.userInfo,
          email: action.payload.email,
          name: action.payload.name,
          username: action.payload.username,
        },
      };
    default:
      return state;
  }
};
