import fetch from 'isomorphic-fetch'
import { sessionService } from 'redux-react-session';
import {decorationFailed, decorationSucceed} from "./amelietorActions";
const config = require('../../tools/config');


export const REQUEST_ANNOTATIONS = 'REQUEST_ANNOTATIONS';
export const RECEIVE_ANNOTATIONS = 'RECEIVE_ANNOTATIONS';
export const RECEIVE_ANNOTATIONS_FAILED = 'RECEIVE_ANNOTATIONS_FAILED';
export const INVALIDATE_ANNOTATION = 'INVALIDATE_ANNOTATION';
export const SELECT_REC = 'SELECT_REC';
export const CLEAR_REC = 'CLEAR_REC';
export const REMOVE_REC = 'REMOVE_REC';
export const REQUEST_REC_META = 'REQUEST_REC_META';
export const RECEIVE_REC_META = 'RECEIVE_REC_META';
export const REQUEST_ALTERNATIVES = 'REQUEST_ALTERNATIVES';
export const RECEIVE_ALTERNATIVES = 'RECEIVE_ALTERNATIVES';
export const REQUEST_ALTERNATIVE_DELETION = 'REQUEST_SOFTWARE_SOLUTION_DELETION';
export const REQUEST_SOFTWARE = 'REQUEST_SOFTWARE';
export const REQUEST_SOFTWARE_SOLUTION_DELETION = 'REQUEST_SOFTWARE_SOLUTION_DELETION';
export const RECEIVE_SOFTWARE = 'RECEIVE_SOFTWARE';
export const REQUEST_FILE_CONTENT = 'REQUEST_FILE_CONTENT';
export const RECEIVE_FILE_CONTENT = "RECEIVE_FILE_CONTENT";
export const RECEIVE_FILE_CONTENT_FAILED = "RECEIVE_FILE_CONTENT_FAILED";

const API_ROOT = config.spotlightHost;

const GET_CONTENT_EXTRACTION = "getFileContent";
const PROCESS_DOCUMENT = "annotate";
const GET_META_INFORMATION = "getMetaInformation";

const GET_ALTERNATIVES = "getAlternatives";
const ADD_ALTERNATIVE = "addAlternative";
const DELETE_ALTERNATIVE = "removeAlternative";

const GET_SOFTWARE = "getSoftwareSolutions";
const DELETE_SOFTWARE_SOLUTION = "removeSoftware";
const ADD_SOFTWARE = "addSoftware";
const REMOVE_TOKEN = "removeToken?token=";

const CREATE_SESSION = "createSession";

export const selectRec = (tokenData) => {
  return {
    type: SELECT_REC,
    tokenData
  }
};

export const clearRec = () => {
  return {
    type: CLEAR_REC
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

export const fetchSession = () =>{
  return dispatch => {
  return fetch(`${API_ROOT}${CREATE_SESSION}`, {
      method: 'post'
    }).then(response => {
      return response.json();
    }).catch(() => {
      console.log("no session received");
    }).then(json => {
      //if session doesn't exists in local storage, create a new one
      sessionService.loadSession().catch(() => {
        sessionService.saveSession(json.session).then(() => {
          //throws error it no user specified
          sessionService.saveUser({});
        });
      });
    })
  };
};

export const addSoftware = (href, token) =>{
  return dispatch => {
    return fetch(`${API_ROOT}${ADD_SOFTWARE}`, {
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


export const addAlternative = (href, token) =>{
  return dispatch => {
    return fetch(`${API_ROOT}${ADD_ALTERNATIVE}`, {
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

export const uploadFile = (file) => {
  return dispatch => {
    dispatch(uploadStarted(file.name));
    let data = new FormData();
    data.append('file', file);
    return fetch(`${API_ROOT}${GET_CONTENT_EXTRACTION}`, {
      method: 'post',
      body: data
    })
      .then(response => {
        return response.json();
      })
      .then(response => {
        dispatch(receiveFileContent(response.fileName, response.paragraphs, false));
      }).catch(error => {
        dispatch(receiveFileContentFailed(error.fileName, error.error));
      });
  }
};

function uploadStarted(fileName) {
  return {
    type: REQUEST_FILE_CONTENT,
    fileName: fileName

  }
}

export const receiveFileContent = (fileName, fileContent, readOnly) => {
  return {
    type: RECEIVE_FILE_CONTENT,
    fileName: fileName,
    readOnly: readOnly,
    fileContent: {'entityMap': {
    },'blocks':
      fileContent.map(child =>{
          return {
            'text':child,
            'type':'unstyled'
          }}
        )
      // .reduce((heading, para) => {
      //   return heading.concat(para);
      // }, [])
      // .reduce((prev, curr) =>{
      //   return [...prev, ...curr];
      // }, [])
     },
    receivedAt: Date.now()
  }
};

function receiveFileContentFailed(fileName, error) {
  return {
    type: RECEIVE_FILE_CONTENT_FAILED,
    fileName: fileName,
    error: error,
    receivedAt: Date.now()
  }
}


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
    return sessionService.loadSession()
      .then(currentSession => {
        return fetch(`${API_ROOT}${PROCESS_DOCUMENT}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            content: block.text,
            annotationType: ["uncertainty", "architectureRecommendations"],
            tags: [
              "MD",  // MD: verb, modal auxillaryverb, modal auxillary,
              "JJS", // JJS: adjective, superlative,
              "JJR", // JJR: adjective, comparative
              "RBS", // RBS: adverb, superlative
              "RBR", // RBR: adverb, comparative
              //"JJ", // JJ: adjective
              "PRP$", // PRP$: pronoun, possessive
              "PDT",  // PDT: predeterminer
              "RB"    // RB:adverb
            ],
            parNum: block.paragraphNumber,
            parMax: block.paragraphsCount,
            docHash: block.documentHash,
            uuid: currentSession
          }),
        })
          .then(response => {
            return response.json();
          })
          .then(json => {
            // if (!json.status === "OK") {
            //   return Promise.reject(json).then(()=>{
            //     dispatch(receiveAnnotationsFailed(block.key, json));
            //   });
            // }
            dispatch(receiveAnnotations(block.key, json));
            dispatch(decorationSucceed());
          }).catch(error => {
            dispatch(receiveAnnotationsFailed(block.key, error));
            dispatch(decorationFailed("While processing text errors occured"));
          });
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
    annotations: json.data,
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

export const invalidateAnnotation = (key) => {
  return {
    type: INVALIDATE_ANNOTATION,
    key,
    receivedAt: Date.now()
  }
};
