
const { getUserByLogin } = require('../../../../dataBase/user/get');
const { updateEphemeralSecret } = require('../../../../dataBase/user/update');
const srp = require('secure-remote-password/server')
const parseJson = require("parse-json");
const stringify = require('fast-json-stable-stringify');
const { config } = require('../../../../config');
const CryptoJS = require('crypto-js');


module.exports.getEphemeralKeys = async ({ event }) => {
    let body, userName, serverEphemeralSecret, user, loginDataSecondStep, encoded;
    let response = {
        'statusCode': 404,
        'body': 'Login or password is invalid'
    };

    try {
        const encodedWord = CryptoJS.enc.Base64.parse(event.body);
        encoded = CryptoJS.enc.Utf8.stringify(encodedWord);
    } catch (e) {
        console.warn('[savePost][parseJson]', e);
    }

    try {
        body = parseJson(encoded);
        ({ userName } = body);

    } catch (e) {
        console.warn('[savePost][parseJson]', e);
    }
    if (!userName) {
        return response;
    }

    try {
        user = await getUserByLogin({ tableName: config.userTableName, login: userName });
        if (!user) {
            return response;
        }
    } catch (e) {
        console.warn("[login--1]", e);
        return response;
    }

    try {


        const serverEphemeral = srp.generateEphemeral(user?.verifier);
        serverEphemeralSecret = serverEphemeral.secret;
        loginDataSecondStep = {
            serverPublicEphemeral: serverEphemeral.public,
            salt: user.salt,
        };

    } catch (e) {
        console.warn("[login--2]", e);
        return response;
    }

    try {
        await updateEphemeralSecret({
            tableName: config.userTableName,
            address: user?.address,
            serverEphemeralSecret: serverEphemeralSecret,
        });

        if (!loginDataSecondStep) {
            return response;
        }

        response = {
            statusCode: 200,
            body: stringify(loginDataSecondStep)
        }
    } catch (e) {
        console.warn("[login--3]", e);
        return response;
    }

    return response;
}