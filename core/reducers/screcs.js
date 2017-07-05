import {RECEIVE_PROJECTS, REQUEST_PROJECTS, SELECTED_PROJECT} from '../actions/scactions';
const screcs = (state = {
  projects: [],
  selectedProject: {}
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
    case SELECTED_PROJECT:
      return Object.assign({}, state, {
        isFetching: false,
        selectedProject: action.selectedProject
      });
    default:
      return state;
  }
};

export default screcs;
