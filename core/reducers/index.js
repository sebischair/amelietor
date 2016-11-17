import { combineReducers } from 'redux'
import recs from './recs'
import annotationsByKey from './annotations'

const amelietor = combineReducers({
  recs,
  annotationsByKey
});

export default amelietor
