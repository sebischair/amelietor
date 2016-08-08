import { combineReducers } from 'redux'
import recs from './recs'
import rootAnnotationsReducer from './annotations'

const amelietor = combineReducers({
  recs,
  rootAnnotationsReducer
});

export default amelietor
