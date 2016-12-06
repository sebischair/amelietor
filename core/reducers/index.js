import { combineReducers } from 'redux'
import recs from './recs'
import annotationsByKey from './annotations'
import content from './content'

const amelietor = combineReducers({
  recs,
  annotationsByKey,
  content
});

export default amelietor
