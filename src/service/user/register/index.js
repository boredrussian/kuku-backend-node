
const { makeToken } = require("../../../lib/jwt");
const { config } = require("../../../config");
const stringify = require('fast-json-stable-stringify');
const { addUser } = require("../../../dataBase/user/put");
const { updateUserConfig } = require("../_utils/subscribed");
const { bodyEncrypted } = require('../../../lib/crypto');

const register = async ({ event }) => {
    address, encryptedWif, userName, salt, verifier, subscribed;
    let response = {
        'statusCode': 403,
        'body': `Error was occurred [addUser]`
    };

    try {
        ({ address, encryptedWif, userName, salt, verifier } = bodyEncrypted({ event }));
    } catch (e) {
        console.warn('[register][bodyEncrypted]', e);
    }
    const accessToken = makeToken({ type: "access" });
    try {
        subscribed = await updateUserConfig({ address });
    } catch (e) {
        console.warn("[register][updateUserConfig]", e);
    }

    try {
        await addUser({
            tableName: config.userTableName,
            address,
            encryptedWif,
            salt,
            verifier,
            login: userName,
            accessToken,
        });

        const resData = {
            accessToken,
            address,
            userName,
            encryptedWif,
            subscribed
        };

        response = {
            'statusCode': 200,
            'body': stringify(resData)
        };
    }
    catch (e) {
        console.warn("[register][addUser]", e);
    }

    return response;
};

module.exports = {
    register
};






