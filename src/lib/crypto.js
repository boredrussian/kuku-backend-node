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
    
    let isValidArr = [], isValid;
    
    if(!Array.isArray(signatures)){
        console.warn('[]')
    }
    
    
    try {
      const isValidArr = signatures.map(sign => {
        return isSignaturesValid({
        message, address: sign.address, signature: sign.signature
        })
     })
     } catch (e) {
        console.warn('[crypto][isSignaturesValid]',e)
    } 
    
    if(isValidArr.find(val => val === 'false')){
        isValid = false;
    } else {
        isValid = true;
        }
    
    //   try {
    //     isValid =  isSignaturesValid({
    //     message, address, signatures
    //     })
    // } catch (e) {
    //     console.warn('[crypto][isSignaturesValid]',e)
    // } 
   return isValid;
};


module.exports = {
     bodyEncrypted,
    checkIsObjectValid
}