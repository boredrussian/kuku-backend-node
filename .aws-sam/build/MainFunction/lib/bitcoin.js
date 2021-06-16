const bitcoinMessage = require("bitcoinjs-message");

exports.isPostValid = ({ message, address, signatures }) => {
    let isValid;
    try {
        isValid = bitcoinMessage.verify(message, address, signatures);
    } catch (e) {
        console.log("[isPostValid]", e);
        isValid = false;
    }
    return isValid;
}