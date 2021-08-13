const stringify = require('fast-json-stable-stringify');
const { getUserByLogin } = require('../../../../dataBase/user/get');
const { getUserByLogin_NonRelational } = require('../../../../dataBaseNonRelational/user/get');
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
        const user = await getUserByLogin_NonRelational({ tableName: config.signedTableName, userName: userName, user_relation: prefixes.user });

 

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


    } catch (e) {
        console.warn("isFreeLogin", e);

    }

    return response;


};