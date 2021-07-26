const bitcoinMessage = require("bitcoinjs-message");
const CryptoJS = require('crypto-js');
const parseJson = require("parse-json");
const { getJsonFromObj } = require("./json");


const isSignaturesValid = ({ message, address, signatures }) => {
    let isValid;
    try {
        isValid = bitcoinMessage.verify(message, address, signatures);
    } catch (e) {
        console.log("[isSignaturesValid]", e);
        isValid = false;
    }
    return isValid;
};

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
};

const checkIsObjectValid =  ({ objData, address }) => {
    const { signatures } = objData;
    const message = getJsonFromObj({ objectData: objData });
    
    let isValid;
    console.log('message---1', message)
    console.log('address---1', address)
    console.log('signatures---1', signatures)
    try {
        isValid =  isSignaturesValid({
        message, address, signatures
        })
    } catch (e) {
        console.warn('[]')
    }

    return isValid;
};


module.exports = {
     bodyEncrypted,
    checkIsObjectValid
}