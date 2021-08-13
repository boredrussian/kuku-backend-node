const sortKeys = require("sort-keys");
const stringify = require("fast-json-stable-stringify");
const parseJson = require("parse-json");


const getJsonFromObj = ({ objectData }) => {
    let objectCopy = parseJson(stringify(objectData));
    if (objectCopy.hash || objectCopy.signatures) {
        delete objectCopy.hash;
        delete objectCopy.signatures;
    }
    objectCopy = sortKeys(objectCopy);
    return stringify(objectCopy);
};


 
module.exports = {
  getJsonFromObj  
};