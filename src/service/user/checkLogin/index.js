const parseJson = require("parse-json");
const stringify = require('fast-json-stable-stringify');
const { getUserByLogin } = require('../../../dataBase/user/get');
const { config } = require("../../../config");

module.exports.checkLogin = async ({ event }) => {
    let body, response, login, isFreeLogin;
    try {
        body = parseJson(event.body);
        ({ login } = body);
    } catch (e) {
        console.warn('[savePost][parseJson]', e);
    }


    try {
        const user = await getUserByLogin({ tableName: config.userTableName, login: login });
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