import {RECEIVE_PROJECTS, REQUEST_PROJECTS, SELECTED_PROJECT, REQUEST_DESIGN_DECISIONS, RECEIVE_DESIGN_DECISIONS} from '../actions/scactions';
const screcs = (state = {
  projects: [],
  selectedProject: {},
  designDecisions: []
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
    case REQUEST_DESIGN_DECISIONS:
      return Object.assign({}, state, {
        isFetching:true,
        designDecisions: []
      });
    case RECEIVE_DESIGN_DECISIONS:
      return Object.assign({}, state, {
        isFetching: false,
        designDecisions: action.designDecisions
      });
    default:
      return state;
  }
};

export default screcs;
