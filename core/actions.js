import fetch from 'isomorphic-fetch'

export const REQUEST_ANNOTATIONS = 'REQUEST_ANNOTATIONS';
export const RECEIVE_ANNOTATIONS = 'RECEIVE_ANNOTATIONS';
export const RECEIVE_ANNOTATIONS_FAILED = 'RECEIVE_ANNOTATIONS_FAILED';
export const INVALIDATE_KEY = 'INVALIDATE_KEY';
export const SELECT_REC = 'SELECT_REC';
export const REMOVE_REC = 'REMOVE_REC';
export const REQUEST_REC_META = 'REQUEST_REC_META';
export const RECEIVE_REC_META = 'RECEIVE_REC_META';
export const REQUEST_ALTERNATIVES = 'REQUEST_ALTERNATIVES';
export const RECEIVE_ALTERNATIVES = 'RECEIVE_ALTERNATIVES';
export const REQUEST_ALTERNATIVE_DELETION = 'REQUEST_SOFTWARE_SOLUTION_DELETION';
export const REQUEST_SOFTWARE = 'REQUEST_SOFTWARE';
export const REQUEST_SOFTWARE_SOLUTION_DELETION = 'REQUEST_SOFTWARE_SOLUTION_DELETION';
export const RECEIVE_SOFTWARE = 'RECEIVE_SOFTWARE';


const API_ROOT = "https://spotlight.in.tum.de/";
const PROCESS_DOCUMENT = "processDocument";
const GET_META_INFORMATION = "getMetaInformation";

const GET_ALTERNATIVES = "getAlternatives";
const DELETE_ALTERNATIVE = "removeAlternative";

const GET_SOFTWARE = "getSoftwareSolutions";
const DELETE_SOFTWARE_SOLUTION = "removeSoftware";

const REMOVE_TOKEN = "removeToken?token=";

export const selectRec = (tokenData) => {
  return {
    type: SELECT_REC,
    tokenData
  }
};

export const removeRec = (token) => {
  return dispatch => {
    return fetch(`${API_ROOT}${REMOVE_TOKEN}${token}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    })
      .then(response => {
        return response.json();
      })
      .then(json => {
        dispatch(selectRec("{}"));
      })
  }
};

export const deleteSoftwareSolution = (href, token) =>{
  return dispatch => {
    // dispatch(requestSoftwareSolutionDeletion(href, token));

    return fetch(`${API_ROOT}${DELETE_SOFTWARE_SOLUTION}`, {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({uri: href, title:token}),
    })
      .then(response => {
        return response.json();
      })
      .then(json => {
        dispatch(fetchRecSoftware(href));
      })
  }
};

export const deleteAlternative = (href, token) =>{
  return dispatch => {
    // dispatch(requestAlternativeDeletion(href, token));

    return fetch(`${API_ROOT}${DELETE_ALTERNATIVE}`, {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({uri: href, title:token}),
    })
      .then(response => {
        return response.json();
      })
      .then(json => {
        dispatch(fetchRecAlternatives(href));
      })
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
    software: json.map(child => child),
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
    alternatives: json.map(child => child),
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
    info: json['http://dbpedia.org/ontology/abstract']
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
      if (!json.status === "OK") {
        return Promise.reject(json).then(receiveAnnotationsFailed(block.key, json))
      }
      dispatch(receiveAnnotations(block.key, json));
    }).catch(error => {
      dispatch(receiveAnnotationsFailed(block.key, error));
    });
  };
};

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

function receiveAnnotationsFailed(key, error) {
  return {
    type: RECEIVE_ANNOTATIONS_FAILED,
    key,
    annotations: [],
    errorMessage:error,
    receivedAt: Date.now()
  }
}
