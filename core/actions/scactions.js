import fetch from 'isomorphic-fetch';
import HelperFunctions from '../../components/HelperFunctions';

export const RECEIVE_PROJECTS = 'RECEIVE_PROJECTS';
export const REQUEST_PROJECTS = 'REQUEST_PROJECTS';
export const SELECTED_PROJECT = 'SELECTED_PROJECT';
export const RECEIVE_DESIGN_DECISIONS = 'RECEIVE_DESIGN_DECISIONS';
export const REQUEST_DESIGN_DECISIONS = 'REQUEST_DESIGN_DECISIONS';

const API_ROOT = 'https://server.sociocortex.com/api/v1/';
const WORKSPACEID = '1iksmphpafkxq';
const SCPROJECTID = 'fo7es9m27wpv';
const SCTASKSID = '1vk4hqzziw3jp';
const ENTITIES = 'entities';
const ENTITYTYPES = 'entityTypes';
const WORKSPACES = 'workspaces';
const MXLQUERY = 'mxlQuery';

export const fetchDesignDecisions = () => {
  return dispatch => {
    dispatch(requestDesignDecisions());

    return postToSC(`${API_ROOT}${WORKSPACES}/${WORKSPACEID}/${MXLQUERY}`, {'expression': 'getDesignDecisions()'}).then(response => {
      return response.json();
    }).then((data) => {
      dispatch(receiveDesignDecisions(data.value));
    });
  }
};

export const fetchProjects = () => {
  return dispatch => {
    dispatch(requestProjects());

    return getFromSC(`${API_ROOT}${ENTITYTYPES}/${SCPROJECTID}/${ENTITIES}`).then(response => {
      return response.json();
    }).then((data) => {
      let p = [];
      let projects = [];
      let filteredData = data.filter(d => {
        return (d.name === "Hadoop Common" || d.name === "Spark")
      });
      filteredData = filteredData.concat(data.slice(0, 10));
      filteredData.map(e => {
        p.push(getFromSC(e.href).then(r => {
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
    return getFromSC(`${API_ROOT}${ENTITIES}/${projectId}`).then(response => {
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

function getFromSC(url) {
  return fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  });
}

function postToSC(url, data) {
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
