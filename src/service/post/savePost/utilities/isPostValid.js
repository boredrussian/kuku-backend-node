const bitcoinMessage = require("bitcoinjs-message");
const sortKeys = require("sort-keys");
const stringify = require("fast-json-stable-stringify");
const parseJson = require("parse-json");
const { isPostValid } = require("../../../../lib/crypto");


const getPostJsonFromObj = ({ post }) => {
    let postCopy = parseJson(stringify(post));
    if (postCopy.hash || postCopy.signatures) {
        delete postCopy.hash;
        delete postCopy.signatures;
    }
    postCopy = sortKeys(postCopy);
    return stringify(postCopy);
};


exports.checkIsPostValid =  ({ post }) => {
    const { address } = post.source;
    const { signatures } = post;
    const message = getPostJsonFromObj({ post: post });
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