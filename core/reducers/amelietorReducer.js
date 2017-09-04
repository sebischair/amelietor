import {REQUEST_DECORATORS, DECORATION_FAILED, DECORATED} from '../actions/amelietorActions';
const amelietorReducer = (state = {
  decorate: false,
  isError: false,
  errorMsg: ""
}, action) => {
  switch (action.type) {
    case REQUEST_DECORATORS:
      return Object.assign({}, state, {
        decorate: true
      });
    case DECORATED:
      return Object.assign({}, state, {
        decorate:false
      });
    case DECORATION_FAILED:
      return Object.assign({}, state, {
        decorate:false,
        isError:true,
        errorMsg: action.errorMsg
      });
    default:
      return state
  }
};


export default amelietorReducer
