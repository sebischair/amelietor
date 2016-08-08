import { combineReducers } from 'redux'

import {REQUEST_ANNOTATIONS, RECEIVE_ANNOTATIONS, INVALIDATE_KEY, SELECT_KEY} from '../actions';

function selectedKey(state = '', action) {
  switch (action.type) {
    case SELECT_KEY:
      return action.key;
    default:
      return state
  }
}

const annotations = (state = {
  key:null,
  isFetching: false,
  didInvalidate: false,
  items: []
}, action) => {
  switch (action.type) {
    case REQUEST_ANNOTATIONS:
        console.log("Request annotations for block with key:");
        console.log(action.key);
        return Object.assign({}, state, {
          key: action.key,
          isFetching:true
        });
    case RECEIVE_ANNOTATIONS:
      concole.log("Recieved annotations for the block with key:");
      console.log(action.key);
      concole.log("Annotations:");
      console.log(action.annotations);
      return Object.assign({}, state, {
        key: action.key,
        isFetching: false,
        didInvalidate: false,
        items: action.annotations,
        lastUpdated: action.receivedAt
      })
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
  annotationsByKey,
  selectedKey
});

export default rootAnnotationsReducer
