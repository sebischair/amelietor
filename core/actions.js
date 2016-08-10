import fetch from 'isomorphic-fetch'

export const REQUEST_ANNOTATIONS = 'REQUEST_ANNOTATIONS';
export const RECEIVE_ANNOTATIONS = 'RECEIVE_ANNOTATIONS';
export const INVALIDATE_KEY = 'INVALIDATE_KEY';
export const SELECT_REC = 'SELECT_REC';
export const REQUEST_REC_META = 'REQUEST_REC_META';
export const RECEIVE_REC_META = 'RECEIVE_REC_META';
export const REQUEST_ALTERNATIVES = 'REQUEST_ALTERNATIVES';
export const RECEIVE_ALTERNATIVES = 'RECEIVE_ALTERNATIVES';
export const REQUEST_SOFTWARE = 'REQUEST_SOFTWARE';
export const RECEIVE_SOFTWARE = 'RECEIVE_SOFTWARE';



const API_ROOT = "http://131.159.30.93:9999/";
const PROCESS_DOCUMENT = "processDocument";
const GET_META_INFORMATION = "getMetaInformation";
const GET_ALTERNATIVES = "getAlternatives";
const GET_SOFTWARE = "getSoftwareSolutions";

export const selectRec = (href) => {
  return {
    type: SELECT_REC,
    href
  }
};

export const fetchRecSoftware = (href) => {
  return dispatch => {
    dispatch(requestRecSoftware(href));

    return fetch(`${API_ROOT}${GET_SOFTWARE}`, {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({uri: href}),
    })
      .then(response => {
        return response.json();
      })
      .then(json => {
        dispatch(receiveRecSoftware(href, json));
      })
  }
};

function requestRecSoftware(href) {
  return {
    type: REQUEST_SOFTWARE,
    href
  }
}

function receiveRecSoftware(href, json) {
  return {
    type: RECEIVE_SOFTWARE,
    href,
    software: json.data.map(child => child),
    receivedAt: Date.now()
  }
}

export const fetchRecAlternatives = (href) => {
  return dispatch => {
    dispatch(requestRecAlternatives(href));

    return fetch(`${API_ROOT}${GET_ALTERNATIVES}`, {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({uri: href}),
    })
      .then(response => {
        return response.json();
      })
      .then(json => {
        dispatch(receiveRecAlternatives(href, json));
      })
  }
};

function requestRecAlternatives(href) {
  return {
    type: REQUEST_ALTERNATIVES,
    href
  }
}

function receiveRecAlternatives(href, json) {
  return {
    type: RECEIVE_ALTERNATIVES,
    href,
    alternatives: json.data.map(child => child),
    receivedAt: Date.now()
  }
}


export const fetchRecMeta = (href) => {
  return dispatch => {
    dispatch(requestRecMeta(href));

    return fetch(`${API_ROOT}${GET_META_INFORMATION}`, {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({uri: href}),
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
    info: json.data['http://dbpedia.org/ontology/abstract']
      .map(child => {return child['lang'] === "en"?child['value']:null})
      .filter(child => child != null)[0],
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

