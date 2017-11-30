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

let HelperFunctions = {
  getParameterByName: getParameterByName
};

export default HelperFunctions;
