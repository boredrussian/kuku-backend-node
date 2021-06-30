const stringify = require('fast-json-stable-stringify');
const { getUserByLogin } = require('../../../../dataBase/user/get');
const { config } = require("../../../../config");
const { bodyEncrypted } = require('../../../../lib/crypto');

module.exports.checkLogin = async ({ event }) => {
    let response, userName, isFreeLogin;
    try {
        ({ userName } = bodyEncrypted({ event }));
    } catch (e) {
        console.warn('[checkLogin][bodyEncrypted]', e);
    }

    try {
        const user = await getUserByLogin({ tableName: config.userTableName, login: userName });
        if (user) {
            isFreeLogin = false;
        }
        else {
            isFreeLogin = true;
        }

        response = {
            'statusCode': 200,
            'body': stringify({ isFreeLogin })
        };
        return response;

    } catch (e) {
        console.warn("isFreeLogin", e);
        response = {
            'statusCode': 403,
            'body': `Error occurred when try checkLogin, ${e}`
        };
        return response;
    }

};