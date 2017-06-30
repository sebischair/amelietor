import fetch from 'isomorphic-fetch'
import { sessionService } from 'redux-react-session';

export const RECEIVE_PROJECTS = 'RECEIVE_PROJECTS';
export const REQUEST_PROJECTS = 'REQUEST_PROJECTS';

const API_ROOT = "https://server.sociocortex.com/api/v1/";
const WORKSPACEID = "1iksmphpafkxq"
const SCPROJECTID = "fo7es9m27wpv";
const SCTASKSID = "1vk4hqzziw3jp";
const ENTITIES = "entities";
const ENTITYTYPES = "entityTypes";

export const fetchProjects = () => {
  return dispatch => {
    dispatch(requestProjects());

    return getFromSC(`${API_ROOT}${ENTITYTYPES}/${SCPROJECTID}/${ENTITIES}`).then(response => {
      return response.json();
    }).then((data) => {
      let p = [];
      let projects = [];
      for(var i = 0; i < data.length; i++) {
        let e = data[i];
        //if(i > 10) break;
        p.push(getFromSC(e.href).then(r => {return r.json();}).then((entity) => {
          entity.attributes.map(a => {
            if(a.name === "projectCategory" && a.values.length > 0 && a.values[0].name !== "Retired") {
              let newEntity = {};
              newEntity.name = entity.name;
              newEntity.description = getAttribute(entity, "description");
              newEntity.projectCategory = a.values[0].name;
              projects.push(newEntity);
            }
          });
        }));
      }

      Promise.all(p).then(() => {
        dispatch(receiveProjects(projects));
      });
    });
  }
};

function getAttribute(project, attributeName) {
  for(let i=0; i<project.attributes.length; i++) {
    if(project.attributes[i].name === attributeName && project.attributes[i].values.length > 0) {
      return truncate(project.attributes[i].values[0]);
    }
  }
  return "";
}

function truncate(string){
  if (string.length > 30)
    return string.substring(0, 30)+'...';
  else
    return string;
};

function getFromSC(url) {
  return fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
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

