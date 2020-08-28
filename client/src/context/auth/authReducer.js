import {
  REGISTER_SUCCES,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  CLEAR_ERRORS,
} from '../types';

export default (state, action) => {
  switch (action.type) {
    case REGISTER_SUCCES: {
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        ...action.payload, // Value of action payload is "token: @@@@"
        isAuthenticated: true,
        loading: false,
      };
    }

    case USER_LOADED: {
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: action.payload,
      };
    }

    case AUTH_ERROR: {
      localStorage.removeItem('token');
      return {
        ...state,
        token: null,
        isAuthenticated: null,
        loading: null,
        user: null,
        error: action.payload,
      };
    }

    case REGISTER_FAIL: {
      localStorage.removeItem('token');
      return {
        ...state,
        token: null,
        isAuthenticated: null,
        loading: null,
        user: null,
        error: action.payload,
      };
    }

    case CLEAR_ERRORS: {
      return {
        ...state,
        error: null,
      };
    }

    default:
      return state;
  }
};
