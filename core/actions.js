import fetch from 'isomorphic-fetch'

export const REQUEST_ANNOTATIONS = 'REQUEST_ANNOTATIONS';
export const RECEIVE_ANNOTATIONS = 'RECEIVE_ANNOTATIONS';
export const INVALIDATE_KEY = 'INVALIDATE_KEY';
export const SELECT_REC = 'SELECT_REC';
export const REQUEST_REC_META = 'REQUEST_REC_META';
export const RECEIVE_REC_META = 'RECEIVE_REC_META';


const API_ROOT = "http://131.159.30.93:9999/";
const PROCESS_DOCUMENT = "processDocument";
const GET_META_INFORMATION = "getMetaInformation";

export const selectRec = (href) => {
  return {
    type: SELECT_REC,
    href
  }
};

export const fetchRecMeta = (href) => {
  return dispatch => {
    dispatch(requestRecMeta(href));
    return fetch(`${API_ROOT}${GET_META_INFORMATION}`, {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({uri: href.href}),
    })
      .then(response => {
        return response.json();
      })
      .then(json => {
        dispatch(receiveRecMeta(href, json));
      })
  }
};

function requestRecMeta(href) {
  return {
    type: REQUEST_REC_META,
    href
  }
}

function receiveRecMeta(href, json) {
  return {
    type: RECEIVE_REC_META,
    href,
    info: json.data['http://dbpedia.org/ontology/abstract'].map(child => {
       return child['lang'] === "en" ? child['value'] : null;
    }),
    receivedAt: Date.now()
  }
}


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

