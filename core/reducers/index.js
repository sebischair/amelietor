import { combineReducers } from 'redux'
import { sessionReducer } from 'redux-react-session';
import recs from './recs'
import annotationsByKey from './annotations'
import content from './content'
import screcs from './screcs'
import amelietorReducer from './amelietorReducer'

const amelietor = combineReducers({
  recs,
  session: sessionReducer,
  annotationsByKey,
  content,
  amelietorReducer,
  screcs
});

export default amelietor
