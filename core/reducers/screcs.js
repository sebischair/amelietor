import {RECEIVE_PROJECTS, REQUEST_PROJECTS, SELECTED_PROJECT, REQUEST_DESIGN_DECISIONS, RECEIVE_DESIGN_DECISIONS, REQUEST_QA, RECEIVE_QA, REQUEST_AE, RECEIVE_AE} from '../actions/scactions';
const screcs = (state = {
  projects: [],
  selectedProject: {},
  designDecisions: [],
  qaData: [],
  aeData: []
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
    case REQUEST_QA:
      return Object.assign({}, state, {
        isFetching:true,
        qaData: []
      });
    case RECEIVE_QA:
      return Object.assign({}, state, {
        isFetching: false,
        qaData: action.qaData
      });
    case REQUEST_AE:
      return Object.assign({}, state, {
        isFetching:true,
        aeData: []
      });
    case RECEIVE_AE:
      return Object.assign({}, state, {
        isFetching: false,
        aeData: action.aeData
      });
    default:
      return state;
  }
};

export default screcs;
