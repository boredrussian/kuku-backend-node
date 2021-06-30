const bitcoinMessage = require("bitcoinjs-message");
const CryptoJS = require('crypto-js');
const parseJson = require("parse-json");


const isPostValid = ({ message, address, signatures }) => {
    let isValid;
    try {
        isValid = bitcoinMessage.verify(message, address, signatures);
    } catch (e) {
        console.log("[isPostValid]", e);
        isValid = false;
    }
    return isValid;
}


const bodyEncrypted = ({ event }) => {
    let body;
    if (!event) {
        return;
    }

    try {
        const encodedWord = CryptoJS.enc.Base64.parse(event.body);
        const encoded = CryptoJS.enc.Utf8.stringify(encodedWord);
        body = parseJson(encoded);
    }
    catch (e) {
        console.warn('[lib][][eventBodyEncrypted]', e);
    }

    return body;
}


module.exports = {
    isPostValid,
    bodyEncrypted
}