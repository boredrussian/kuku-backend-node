const jwt = require('jsonwebtoken');

/**
 * expiresIn: 86400, in milliseconds second - 24 hours
 *
 *
 *
 */

const expiredTimeMap = {
    access: 86400,
    refresh: 86400 * 30,
};

module.exports.makeToken = ({ type }) => {
    let jwtToken = "";
    try {
        jwtToken = jwt.sign({ type: type }, process.env.JWT_SECRET, {
            expiresIn: expiredTimeMap[type],
        });
    } catch (e) {
        console.log("[getToken]", e);
    }
    return jwtToken;
};

module.exports.verifyToken = ({ token }) => {
    let isVerify = false;

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        if (decodedToken) {
            isVerify = true;
        }
    } catch (err) {
        console.log("[verifyToken]", err);
    }
    return isVerify;
};
