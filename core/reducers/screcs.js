import {RECEIVE_PROJECTS, REQUEST_PROJECTS} from '../actions/scactions';
const screcs = (state = {
  projects: []
}, action) => {
  switch (action.type) {
    case REQUEST_PROJECTS:
      return Object.assign({}, state, {
        isFetching:true,
        projects: []
      });
    case RECEIVE_PROJECTS:
      return Object.assign({}, state, {
        isFetching: false,
        projects: action.projects
      });
    default:
      return state;
  }
};

export default screcs;
