import {REQUEST_FILE_CONTENT, RECEIVE_FILE_CONTENT,RECEIVE_FILE_CONTENT_FAILED} from '../actions/actions';

const content = (state = {
  fileName:null,
  isFinished: true,
  isError: false,
  readOnly: false
}, action) => {
  switch (action.type) {
    case REQUEST_FILE_CONTENT:
      return Object.assign({}, state, {
        fileName: action.fileName,
        isFinished:false,
        isError: false,
      });
    case RECEIVE_FILE_CONTENT:
      return Object.assign({}, state, {
        fileName: action.fileName,
        isFinished: true,
        isError: false,
        errorMessage:"",
        readOnly: action.readOnly,
        fileContent: action.fileContent,
        lastUpdated: action.receivedAt
      });
    case RECEIVE_FILE_CONTENT_FAILED:
      return Object.assign({}, state, {
        fileName: action.fileName,
        isFinished: true,
        isError: true,
        errorMessage:action.errorMessage,
        lastUpdated: action.receivedAt
      });
    default:
        return state
  }
};

export default content
