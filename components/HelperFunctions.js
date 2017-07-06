/**
 * Created by mahabaleshwar on 7/6/2017.
 */

function getParameterByName(name, string) {
  name = name.replace(/[\[\]]/g, "\\$&");
  let regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(string);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function truncate(string){
  if (string.length > 50)
    return string.substring(0, 50)+'...';
  else
    return string;
}

let HelperFunctions = {
  getParameterByName: getParameterByName,
  truncate: truncate
};

export default HelperFunctions;
