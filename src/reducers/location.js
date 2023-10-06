import {UPDATE_LOCATION, UPDATE_ADDRESS, LOGOUT} from 'actions';

const INITIAL_STATE = {
  coords: {},
  area: null,
  address: null,
  locationLoaded: false,
  error: null,
  areaLoaded: false,
  areaError: null,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case UPDATE_LOCATION.SUCCESS:
      return {
        ...state,
        locationLoaded: true,
        coords: action.payload?.coords,
      };
    case UPDATE_LOCATION.FAILURE:
      return {
        ...state,
        locationLoaded: true,
        error: action.payload.error,
      };
    case UPDATE_ADDRESS.SUCCESS:
      return {
        ...state,
        area: action.payload.area,
        address: action.payload.address,
        areaLoaded: true,
      };
    case UPDATE_ADDRESS.FAILURE:
      return {
        ...state,
        areaLoaded: true,
        areaError: action.payload.error,
      };
    case LOGOUT.SUCCESS:
      return INITIAL_STATE;
    default:
      return state;
  }
};
