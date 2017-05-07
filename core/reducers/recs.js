import {SELECT_REC,
  RECEIVE_REC_META,
  REQUEST_REC_META,
  REQUEST_ALTERNATIVES,
  RECEIVE_ALTERNATIVES,
  REQUEST_SOFTWARE,
  RECEIVE_SOFTWARE,
  REQUEST_SOFTWARE_SOLUTION_DELETION,
  REQUEST_ALTERNATIVE_DELETION,
  REMOVE_REC
} from '../actions';

const recs = (state = {
  href: null,
  info:{},
  alternatives: {}
}, action) => {
  switch (action.type) {
    case SELECT_REC:
      return Object.assign({}, state, {
        href: action.tokenData.URI,
        tokenData: action.tokenData
      });
    case REMOVE_REC:
      return Object.assign({}, state, {
        href: action.tokenData.URI,
        tokenData: action.tokenData
      });
    case REQUEST_SOFTWARE_SOLUTION_DELETION:
      return Object.assign({}, state, {
        href: action.href,
        tokenData: action.token
      });
    case REQUEST_ALTERNATIVE_DELETION:
      return Object.assign({}, state, {
        href: action.href,
        tokenData: action.token
      });
    case REQUEST_REC_META:
      return Object.assign({}, state, {
        href: action.href,
        info:{
          isFetching:true
        }
      });
    case RECEIVE_REC_META:
      return Object.assign({}, state, {
        href: action.href,
        info: {
          isFetching: false,
          didInvalidate: false,
          data:action.info,
          lastUpdated: action.receivedAt
        }
      });
    case REQUEST_ALTERNATIVES:
      return Object.assign({}, state, {
        href: action.href,
        alternatives:{
          isFetching:true
        }
      });
    case RECEIVE_ALTERNATIVES:
      return Object.assign({}, state, {
        href: action.href,
        alternatives: {
          isFetching: false,
          didInvalidate: false,
          data:action.alternatives,
          lastUpdated: action.receivedAt
        }
      });
    case REQUEST_SOFTWARE:
      return Object.assign({}, state, {
        href: action.href,
        software:{
          isFetching:true
        }
      });
    case RECEIVE_SOFTWARE:
      return Object.assign({}, state, {
        href: action.href,
        software: {
          isFetching: false,
          didInvalidate: false,
          data:action.software,
          lastUpdated: action.receivedAt
        }
      });
    default:
      return state
  }
};

export default recs
