import { combineReducers } from 'redux'

import {REQUEST_ANNOTATIONS, RECEIVE_ANNOTATIONS, INVALIDATE_KEY} from '../actions';

const annotations = (state = {
  key:null,
  isFetching: false,
  didInvalidate: false,
  items: []
}, action) => {
  switch (action.type) {
    case REQUEST_ANNOTATIONS:
      return Object.assign({}, state, {
        key: action.key,
        isFetching:true
      });
    case RECEIVE_ANNOTATIONS:
      return Object.assign({}, state, {
        key: action.key,
        isFetching: false,
        didInvalidate: false,
        items: action.annotations,
        lastUpdated: action.receivedAt
      });
    default:
        return state
  }
};

function annotationsByKey(state = { }, action) {
  switch (action.type) {
    case INVALIDATE_KEY:
    case RECEIVE_ANNOTATIONS:
    case REQUEST_ANNOTATIONS:
      return Object.assign({}, state, {
        [action.key]: annotations(state[action.key], action)
      });
    default:
      return state
  }
}

const rootAnnotationsReducer = combineReducers({
  annotationsByKey
});

export default rootAnnotationsReducer
