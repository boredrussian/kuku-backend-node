const bitcoinMessage = require("bitcoinjs-message");
const CryptoJS = require('crypto-js');
const parseJson = require("parse-json");
const { getJsonFromObj } = require("./json");
const bs58 = require('bs58');

const isSignaturesValid = ({ message, address, signature }) => {
    let isValid;
    try {
        // console.log('address', address);
        // console.log('signatures', signatures);
        isValid = bitcoinMessage.verify(message, address, signature);
    } catch (e) {
        console.log("[crypto][isSignaturesValid]", e);
        isValid = false;
    }
    return isValid;
};

const bodyEncrypted = ({ event }) => {
    return parseJson(event.body);
    let body;
    if (!event) {
        return;
    }

     try {
        const encodedWord = CryptoJS.enc.Base64.parse(event.body);
        
         
        const encoded = CryptoJS.enc.Utf8.stringify(encodedWord);
        console.log(encoded);
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
          console.log('[crypto][isValidArr]------sing', sign);
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



const getHash = ({ objectData }) => {
    const dataJson = JSON.stringify(objectData);
    let resHash;
    try {
        const hash = CryptoJS.SHA256(dataJson);
        const hashString = hash.toString(CryptoJS.enc.Hex);
        const bytes = Buffer.from(hashString, 'hex');
          resHash = bs58.encode(bytes);
    } catch (e) {
        console.error('[getHash]', e);
    }

    return resHash;
}


module.exports = {
    bodyEncrypted,
    checkIsObjectValid,
    getHash
}