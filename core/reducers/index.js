import { combineReducers } from 'redux'
import { sessionReducer } from 'redux-react-session';
import recs from './recs'
import rootAnnotationsReducer from './annotations'

const amelietor = combineReducers({
  recs,
  rootAnnotationsReducer,
  session: sessionReducer
});

export default amelietor
