import {SELECT_REC, RECEIVE_REC_META, REQUEST_REC_META} from '../actions';

const recs = (state = {
  href: null,
  isFetching: false,
  didInvalidate: false,
}, action) => {
  switch (action.type) {
    case SELECT_REC:
      return Object.assign({}, state, {
        href: action.href
      });
    case REQUEST_REC_META:
      return Object.assign({}, state, {
        key: action.key,
        isFetching:true
      });
    case RECEIVE_REC_META:
      return Object.assign({}, state, {
        href: action.href,
        isFetching: false,
        didInvalidate: false,
        info: action.info,
        lastUpdated: action.receivedAt
      });
    default:
      return state
  }
};

export default recs
