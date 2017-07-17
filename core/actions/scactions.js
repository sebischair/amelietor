import fetch from 'isomorphic-fetch';
import HelperFunctions from '../../components/HelperFunctions';

export const RECEIVE_PROJECTS = 'RECEIVE_PROJECTS';
export const REQUEST_PROJECTS = 'REQUEST_PROJECTS';
export const SELECTED_PROJECT = 'SELECTED_PROJECT';
export const RECEIVE_DESIGN_DECISIONS = 'RECEIVE_DESIGN_DECISIONS';
export const REQUEST_DESIGN_DECISIONS = 'REQUEST_DESIGN_DECISIONS';
export const RECEIVE_QA = 'RECEIVE_QA';
export const REQUEST_QA = 'REQUEST_QA';
export const RECEIVE_AE = 'RECEIVE_AE';
export const REQUEST_AE = 'REQUEST_AE';
export const RECEIVE_EM = 'RECEIVE_EM';
export const REQUEST_EM = 'REQUEST_EM';
export const RECEIVE_ER = 'RECEIVE_ER';
export const REQUEST_ER = 'REQUEST_ER';

const API_ROOT = 'https://server.sociocortex.com/api/v1/';
const WORKSPACEID = '1iksmphpafkxq';
const SCPROJECTID = 'fo7es9m27wpv';
const SCTASKSID = '1vk4hqzziw3jp';
const ENTITIES = 'entities';
const ENTITYTYPES = 'entityTypes';
const WORKSPACES = 'workspaces';
const MXLQUERY = 'mxlQuery';
const AKRESERVER = 'http://131.159.30.93:9000/';
const QADATA = 'getQAData?projectId=';
const AEDATA = 'getAE?projectId=';
const EMDATA = 'getAssignee?projectId=';
const ERDATA = 'predictAssignee?projectId=';

export const fetchERData = (projectId) => {
  return dispatch => {
    dispatch(requestERData());
    return getFrom(`${AKRESERVER}${ERDATA}${projectId}`).then(response => {
      return response.json();
    }).then((data) => {
      dispatch(receiveERData(data));
    });
  }
};

export const fetchEMData = (projectId) => {
  return dispatch => {
    dispatch(requestEMData());
    return getFrom(`${AKRESERVER}${EMDATA}${projectId}`).then(response => {
      return response.json();
    }).then((data) => {
      dispatch(receiveEMData(data));
    });
  }
};

export const fetchAEData = (projectId) => {
  return dispatch => {
    dispatch(requestAEData());
    return getFrom(`${AKRESERVER}${AEDATA}${projectId}`).then(response => {
      return response.json();
    }).then((data) => {
      dispatch(receiveAEData(data));
    });
  }
};

export const fetchQAData = (projectId) => {
  return dispatch => {
    dispatch(requestQAData());

    return getFrom(`${AKRESERVER}${QADATA}${projectId}`).then(response => {
      return response.json();
    }).then((data) => {
      dispatch(receiveQAData(data));
    });
  }
};

export const fetchDesignDecisions = () => {
  return dispatch => {
    dispatch(requestDesignDecisions());

    return postTo(`${API_ROOT}${WORKSPACES}/${WORKSPACEID}/${MXLQUERY}`, {'expression': 'getDesignDecisions()'}).then(response => {
      return response.json();
    }).then((data) => {
      dispatch(receiveDesignDecisions(data.value));
    });
  }
};

export const fetchProjects = () => {
  return dispatch => {
    dispatch(requestProjects());

    return getFrom(`${API_ROOT}${ENTITYTYPES}/${SCPROJECTID}/${ENTITIES}`).then(response => {
      return response.json();
    }).then((data) => {
      let p = [];
      let projects = [];
      let filteredData = data.filter(d => {
        return (d.name === "Hadoop Common" || d.name === "Spark")
      });
      filteredData = filteredData.concat(data.slice(0, 10));
      filteredData.map(e => {
        p.push(getFrom(e.href).then(r => {
          return r.json();
        }).then((entity) => {
          if (isNotRetiredProject(entity)) {
            projects.push(getProjectDetails(entity));
          }
        }));
      });

      Promise.all(p).then(() => {
        dispatch(receiveProjects(projects));
      });
    });
  }
};

export const fetchSelctedProject = (projectId) => {
  return dispatch => {
    return getFrom(`${API_ROOT}${ENTITIES}/${projectId}`).then(response => {
      return response.json();
    }).then((project) => {
      dispatch(selectProject(getProjectDetails(project)));
    });
  }
};

function isNotRetiredProject(entity) {
  return entity.attributes.map(a => {
    return (a.name === 'projectCategory' && a.values.length > 0 && a.values[0].name !== 'Retired')
  });
}

function getProjectDetails(entity) {
  let newEntity = {};
  newEntity.projectId = entity.id;
  newEntity.href = entity.href;
  newEntity.name = entity.name;
  newEntity.description = getAttribute(entity, 'description');
  newEntity.shortDescription = HelperFunctions.truncate(newEntity.description);
  newEntity.projectCategory = (getAttribute(entity, 'projectCategory') !== "" ? getAttribute(entity, 'projectCategory').name : "");
  if(entity.derivedAttributes.length > 0) {
    newEntity.issuesCount = getDerivedAttribute(entity, 'issuesCount');
  }
  return newEntity;
}

function getAttribute(project, attributeName) {
  for (let i = 0; i < project.attributes.length; i++) {
    if (project.attributes[i].name === attributeName && project.attributes[i].values.length > 0) {
      return project.attributes[i].values[0];
    }
  }
  return '';
}

function getDerivedAttribute(project, attributeName) {
  for (let i = 0; i < project.derivedAttributes.length; i++) {
    if (project.derivedAttributes[i].name === attributeName && project.derivedAttributes[i].values.length > 0) {
      return project.derivedAttributes[i].values[0];
    }
  }
  return '';
}

function getFrom(url) {
  return fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  });
}

function postTo(url, data) {
  return fetch(url, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  });
}

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
