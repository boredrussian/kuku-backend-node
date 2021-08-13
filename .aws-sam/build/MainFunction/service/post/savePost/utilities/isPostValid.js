const bitcoinMessage = require("bitcoinjs-message");
const sortKeys = require("sort-keys");
const stringify = require("fast-json-stable-stringify");
const parseJson = require("parse-json");
const { isPostValid } = require("../../../../lib/crypto");


const getJsonFromObj = ({ objectData }) => {
    let objectCopy = parseJson(stringify(objectData));
    if (objectCopy.hash || objectCopy.signatures) {
        delete objectCopy.hash;
        delete objectCopy.signatures;
    }
    objectCopy = sortKeys(objectCopy);
    return stringify(objectCopy);
};

exports.checkIsPostValid =  ({ post }) => {
    const { address } = post.source;
    const { signatures } = post;
    const message = getJsonFromObj({ post: post });
    let isValid;
    try {
        isValid =  isPostValid({
            message, address, signatures
        })
    } catch (e) {
        console.warn('[]')
    }

    return isValid;
};