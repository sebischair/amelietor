import fetch from 'isomorphic-fetch'

export const REQUEST_ANNOTATIONS = 'REQUEST_ANNOTATIONS';
export const RECEIVE_ANNOTATIONS = 'RECEIVE_ANNOTATIONS';
export const INVALIDATE_KEY = 'INVALIDATE_KEY';
export const SELECT_KEY = 'SELECT_KEY';

const API_ROOT = "http://131.159.30.93:9999/";
const PROCESS_DOCUMENT = "processDocument";

export const showRec = (href) => {
  return {
    type: 'SHOW_REC',
    href
  }
};

export function selectKey(key) {
  return {
    type: SELECT_KEY,
    key
  }
};

export const fetchAnnotationsPerBlock = (block) => {
  return dispatch => {
    dispatch(requestAnnotations(block.key));
    return fetch(`${API_ROOT}${PROCESS_DOCUMENT}`, {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({content: block.text}),
    })
    .then(response => {
      return response.json();
    })
    .then(json => {
      dispatch(receiveAnnotations(block.key, json));
    })
  }
}

function requestAnnotations(key) {
  return {
    type: REQUEST_ANNOTATIONS,
    key
  }
}

function receiveAnnotations(key, json) {

  return {
    type: RECEIVE_ANNOTATIONS,
    key,
    annotations: json.data.map(child => child),
    receivedAt: Date.now()
  }
}

