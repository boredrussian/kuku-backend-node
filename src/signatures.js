const stringify = require('fast-json-stable-stringify');
const sortKeys = require('sort-object-keys')
const { nanoid } = require('nanoid')
const CryptoJS = require("crypto-js");
const bs58 = require('bs58')
const bip38 = require('bip38')
const wif = require('wif')
const bitcoin = require('bitcoinjs-lib');
const bitcoinMessage = require('bitcoinjs-message');
const srp = require('secure-remote-password/client')

exports.newWif = ({ password }) => {
    const keyPair = bitcoin.ECPair.makeRandom();
    const wif = keyPair.toWIF();
    const decoded = wif.decode(wif);
    
    // See https://github.com/bitcoinjs/bip38 for details
    const encryptedWif = bip38.encrypt(decoded.privateKey, decoded.compressed, password);

    const { address } = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey });

    return {
        encryptedWif, wif, address
    };
}

exports.isWifFormat = ({ wif }) => {
    try {
        const pair = bitcoin.ECPair.fromWIF(wif);
        return !!pair;
    } catch (e) {
        return false;
    }
}

const getStableString = ({ obj }) => {
    let objCopy = {};
    Object.assign(objCopy, obj);
    delete objCopy.hash;
    delete objCopy.signature;
    objCopy = sortKeys(objCopy);
    let stableString = stringify(objCopy);
    return stableString;
}

exports.getSignature = ({ obj, wif }) => {
    const stableString = getStableString({ obj });
    const keyPair = bitcoin.ECPair.fromWIF(wif);
    const privateKey = keyPair.privateKey;
    const signature = bitcoinMessage.sign(stableString, privateKey, keyPair.compressed);
    return = signature.toString('base64');
};

exports.getHash = ({ obj }) => {
    const stableString = getStableString({ obj });
    const hash = CryptoJS.SHA256(dataJson);
    const hashString = hash.toString(CryptoJS.enc.Hex);
    const bytes = Buffer.from(hashString, 'hex');
    return = bs58.encode(bytes);
}

exports.checkSignature = ({ obj, address }) => {
    const { signature } = obj;
    const stableString = getStableString({ obj });
    return bitcoinMessage.verify(stableString, address, signature);
};

