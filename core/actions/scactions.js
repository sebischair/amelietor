import fetch from 'isomorphic-fetch';

export const RECEIVE_PROJECTS = 'RECEIVE_PROJECTS';
export const REQUEST_PROJECTS = 'REQUEST_PROJECTS';
export const SELECTED_PROJECT = 'SELECTED_PROJECT';
export const SELECTED_DD = 'SELECTED_DD';
export const RECEIVE_DESIGN_DECISIONS = 'RECEIVE_DESIGN_DECISIONS';
export const REQUEST_DESIGN_DECISIONS = 'REQUEST_DESIGN_DECISIONS';
export const RECEIVE_QA = 'RECEIVE_QA';
export const REQUEST_QA = 'REQUEST_QA';
export const REQUEST_ALL_QA = 'REQUEST_ALL_QA';
export const RECEIVE_ALL_QA = 'RECEIVE_ALL_QA';
export const RECEIVE_AE = 'RECEIVE_AE';
export const REQUEST_AE = 'REQUEST_AE';
export const RECEIVE_EM = 'RECEIVE_EM';
export const REQUEST_EM = 'REQUEST_EM';
export const RECEIVE_ER = 'RECEIVE_ER';
export const REQUEST_ER = 'REQUEST_ER';

export const REQUEST_SIMILAR_DDS = 'REQUEST_SIMILAR_DDS';
export const RECEIVE_SIMILAR_DDS = 'RECEIVE_SIMILAR_DDS';

const AKRESERVER = process.env.AKRESERVER || "http://localhost:9000/";

const PROJECT = 'project';

const QADATA = 'getDataForQAV?projectKey=';
const ALLQA = 'getAllQAV';
const AEDATA = 'getDataForAEV?projectKey=';
const EMDATA = 'getAssignee?projectKey=';
const ERDATA = 'predictAssignee?projectKey=';
const DDDATA = 'getDataForDDV';
const DESIGNDECISION = 'designDecision';
const SIMILARDECISIONS = 'similarDecisions';

export const fetchERData = (projectKey) => {
  return dispatch => {
    dispatch(requestERData());
    return getFrom(`${AKRESERVER}${ERDATA}${projectKey}`).then(response => {
      return response.json();
    }).then((data) => {
      dispatch(receiveERData(data));
    });
  }
};

export const fetchEMData = (projectKey) => {
  return dispatch => {
    dispatch(requestEMData());
    return getFrom(`${AKRESERVER}${EMDATA}${projectKey}`).then(response => {
      return response.json();
    }).then((data) => {
      dispatch(receiveEMData(data));
    });
  }
};

export const fetchAEData = (projectKey) => {
  return dispatch => {
    dispatch(requestAEData());

    return getFrom(`${AKRESERVER}${AEDATA}${projectKey}`).then(response => {
      return response.json();
    }).then((data) => {
      dispatch(receiveAEData(data));
    });
  }
};

export const fetchQAData = (projectKey) => {
  return dispatch => {
    dispatch(requestQAData());

    return getFrom(`${AKRESERVER}${QADATA}${projectKey}`).then(response => {
      return response.json();
    }).then((data) => {
      dispatch(receiveQAData(data));
    });
  }
};

export const fetchAllQA = () => {
  return dispatch => {
    dispatch(requestAllQA());

    return getFrom(`${AKRESERVER}${ALLQA}`).then(response => {
      return response.json();
    }).then((data) => {
      data.sort((a, b) => (a < b ? -1 : 1));
      dispatch(receiveAllQA(data));
    });
  }
};

export const fetchDesignDecisions = (projectKey, viz, attrName, segmentName) => {
  return dispatch => {
    dispatch(requestDesignDecisions());

    return postTo(`${AKRESERVER}${DDDATA}`, {'projectKey': projectKey, 'viz': viz, 'attrName': attrName, 'segmentName': segmentName}).then(response => {
      return response.json();
    }).then((data) => {
      dispatch(receiveDesignDecisions(data));
      return data;
    });
  }
};

export const fetchProjects = () => {
  return dispatch => {
    dispatch(requestProjects());
    return getFrom(`${AKRESERVER}${PROJECT}`).then(response => {
      return response.json();
    }).then((data) => {
      const projects = data.sort(function (a, b) {
        return b.issuesCount - a.issuesCount;
      });
      dispatch(receiveProjects(projects));
      return projects;
    });
  }
};

export const fetchSelctedProject = (key) => {
  return dispatch => {
    return getFrom(`${AKRESERVER}${PROJECT}/${key}`).then(response => {
      return response.json();
    }).then((project) => {
      dispatch(selectProject(project));
      return project;
    });
  }
};

export const fetchSelctedDD = (ddKey) => {
  return dispatch => {
    return getFrom(`${AKRESERVER}${DESIGNDECISION}?issueKey=${ddKey}`).then(response => {
      return response.json();
    }).then((dd) => {
      dispatch(selectDD(dd));
    });
  }
};

export const fetchSimilarDDs = (ddKey) => {
  return dispatch => {
    dispatch(requestSimilarDDs());
    return getFrom(`${AKRESERVER}${SIMILARDECISIONS}?issueKey=${ddKey}`).then(response => {
      return response.json();
    }).then((dds) => {
      dispatch(receiveSimilarDDs(dds));
      return dds;
    });
  }
};

export const getFrom = (url) => {
  return fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  });
};

export const postTo = (url, data) => {
  return fetch(url, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
};

/*export const putTo = (url, data) => {
  return fetch(url, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Basic '+ window.btoa(`${SCUSERNAME}:${SCPASSWORD}`)
    },
    body: JSON.stringify(data)
  });
};*/

export const receiveProjects = (json) => {
  return {
    type: RECEIVE_PROJECTS,
    projects: json,
    receivedAt: Date.now()
  }
};

export const requestProjects = () => {
  return {
    type: REQUEST_PROJECTS
  };
};

export const selectProject = (project) => {
  return {
    type: SELECTED_PROJECT,
    selectedProject: project
  }
};

export const requestSimilarDDs = () => {
  return {
    type: REQUEST_SIMILAR_DDS
  };
};

export const receiveSimilarDDs = (json) => {
  return {
    type: RECEIVE_SIMILAR_DDS,
    similarDDs: json.similarDDs,
    receivedAt: Date.now()
  }
};

export const requestDesignDecisions = () => {
  return {
    type: REQUEST_DESIGN_DECISIONS
  };
};

export const receiveDesignDecisions = (json) => {
  return {
    type: RECEIVE_DESIGN_DECISIONS,
    designDecisions: json,
    receivedAt: Date.now()
  }
};

export const requestQAData = () => {
  return {
    type: REQUEST_QA
  };
};

export const receiveQAData = (json) => {
  return {
    type: RECEIVE_QA,
    qaData: json,
    receivedAt: Date.now()
  }
};

export const requestAllQA = () => {
  return {
    type: REQUEST_ALL_QA
  };
};

export const receiveAllQA = (json) => {
  return {
    type: RECEIVE_ALL_QA,
    allQA: json,
    receivedAt: Date.now()
  }
};

export const requestAEData = () => {
  return {
    type: REQUEST_AE
  };
};

export const receiveAEData = (json) => {
  return {
    type: RECEIVE_AE,
    aeData: json,
    receivedAt: Date.now()
  }
};

export const requestEMData = () => {
  return {
    type: REQUEST_EM
  };
};

export const receiveEMData = (json) => {
  return {
    type: RECEIVE_EM,
    emData: json,
    receivedAt: Date.now()
  }
};

export const requestERData = () => {
  return {
    type: REQUEST_ER
  };
};

export const receiveERData = (json) => {
  return {
    type: RECEIVE_ER,
    erData: json,
    receivedAt: Date.now()
  }
};

export const selectDD = (dd) => {
  return {
    type: SELECTED_DD,
    selectedDD: dd
  }
};

