const { getUserByAccessToken } = require('../../../../dataBase/user/get');
const parseJson = require("parse-json");
const stringify = require('fast-json-stable-stringify');
const { config } = require('../../../config');
const CryptoJS = require('crypto-js');

module.exports.getUser = async () => {
    // TODO add validation
    let token, encoded, body;

    let response = {
        'statusCode': 404,
        'body': 'Login or password is invalid'
    };

    try {
        const encodedWord = CryptoJS.enc.Base64.parse(event.body);
        encoded = CryptoJS.enc.Utf8.stringify(encodedWord);
    } catch (e) {
        console.warn('[getUser][parseJson]', e);
    }

    try {
        body = parseJson(encoded);
        ({ token } = body);

    } catch (e) {
        console.warn('[getUser][parseJson]', e);
    }

    try {
        const user = await getUserByAccessToken({ tableName: config.userTableName, token });

        console.log("------!!!!------user----321-------", user);
        if (user) {
            const data = {
                address: user?.address,
                userName: user?.login,
            };

            response = {
                statusCode: 200,
                body: stringify(data)
            }

            return response
        } else {
            return response;
        }
    } catch (e) {
        console.warn("getUserByToken", e);
        return response
    }
};