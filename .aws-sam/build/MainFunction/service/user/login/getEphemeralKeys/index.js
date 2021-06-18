
const { getUserByLogin } = require('../../../../dataBase/user/get');
const { updateEphemeralSecret } = require('../../../../dataBase/user/update');
const srp = require('secure-remote-password/client')
const parseJson = require("parse-json");
const stringify = require('fast-json-stable-stringify');
const { config } = require('../../../../config')

module.exports.getEphemeralKeys = async ({ event }) => {
    let body, login, serverEphemeralSecret, user, loginDataSecondStep;
    let response = {
        'statusCode': 404,
        'body': 'Login or password is invalid'
    };
    try {
        body = parseJson(event.body);
        ({ login } = body);
    } catch (e) {
        console.warn('[savePost][parseJson]', e);
    }
    if (!login) {
        return response;
    }

    try {
        user = await getUserByLogin({ tableName: config.userTableName, login: login });
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

        console.log('response--fffff', response);
    } catch (e) {
        console.warn("[login--2]", e);
        return response;
    }

    try {
        await updateEphemeralSecret({
            address: user?.address,
            serverEphemeralSecret: serverEphemeralSecret,
        });

        if (!loginDataSecondStep) {
            return response;
        }
        response = {
            ...response,
            statusCode: 200,
            body: stringify(loginDataSecondStep)
        }
    } catch (e) {
        console.warn("[login--3]", e);
        return response;
    }

    return response;
}