import {REQUEST_ANNOTATIONS, RECEIVE_ANNOTATIONS, INVALIDATE_KEY, RECEIVE_ANNOTATIONS_FAILED} from '../actions/actions';

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
        isFetching:true,
        isError: false,
      });
    case RECEIVE_ANNOTATIONS:
      return Object.assign({}, state, {
        key: action.key,
        isFetching: false,
        didInvalidate: false,
        isError: false,
        errorMessage:"",
        items: action.annotations,
        lastUpdated: action.receivedAt
      });
    case RECEIVE_ANNOTATIONS_FAILED:
      return Object.assign({}, state, {
        key: action.key,
        isFetching: false,
        didInvalidate: false,
        isError: true,
        errorMessage:action.errorMessage,
        items: action.annotations,
        lastUpdated: action.receivedAt
      });
    default:
        return state
  }
};

function annotationsByKey(state = { }, action) {
  switch (action.type) {
    case RECEIVE_ANNOTATIONS:
    case RECEIVE_ANNOTATIONS_FAILED:
    case REQUEST_ANNOTATIONS:
      return Object.assign({}, state, {
        [action.key]: annotations(state[action.key], action)
      });
    default:
      return state
  }
}

export default annotationsByKey
