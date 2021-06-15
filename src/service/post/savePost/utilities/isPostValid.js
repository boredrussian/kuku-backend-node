const bitcoinMessage = require("bitcoinjs-message");
const sortKeys = require("sort-keys");
const stringify = require("fast-json-stable-stringify");
const parseJson = require("parse-json");

const getPostJsonFromObj = ({ post }) => {
    let postCopy = parseJson(stringify(post));
    if (postCopy.hash || postCopy.signatures) {
        delete postCopy.hash;
        delete postCopy.signatures;
    }
    postCopy = sortKeys(postCopy);
    return stringify(postCopy);
};

exports.isPostValid = ({ post }) => {
    console.log('post', post);
    const { address } = post.source;
    const { signatures } = post;
    const message = getPostJsonFromObj({ post: post });
    console.log('message', message);
    let isValid;
    try {
        isValid = bitcoinMessage.verify(message, address, signatures);
    } catch (e) {
        console.log("[isPostValid]", e);
        isValid = false;
    }
    return isValid;
};