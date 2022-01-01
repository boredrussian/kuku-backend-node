const stringify = require('fast-json-stable-stringify');
const { getUserByUserName_NonRelational } = require('../../../../dataBaseNonRelational/user/get');
const { config, prefixes } = require("../../../../config");
const { bodyEncrypted } = require('../../../../lib/crypto');

module.exports.checkLogin = async ({ event }) => {
    let userName, isFreeLogin;

    let response = {
        'statusCode': 403,
        'body': `Error occurred when try checkLogin`
    };

    try {
        ({ userName } = bodyEncrypted({ event }));
    } catch (e) {
        console.warn('[checkLogin][bodyEncrypted]', e);
    }


    try {
        const user = await getUserByUserName_NonRelational({ tableName: config.signedTableName, userName: userName, userRelation: prefixes.user });
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

    } catch (e) {
        console.warn("isFreeLogin", e);
    }

    return response;


};