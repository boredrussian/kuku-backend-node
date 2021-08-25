
const { getUserByLogin } = require('../../../../dataBase/user/get');
const { updateEphemeralSecret } = require('../../../../dataBase/user/update');
const srp = require('secure-remote-password/server');
const { getUserByUserName_NonRelational } = require('../../../../dataBaseNonRelational/user/get');
const { updateEphemeralSecret_NonRelational } = require('../../../../dataBaseNonRelational/user/update');

const stringify = require('fast-json-stable-stringify');
const { config, prefixes } = require('../../../../config');
const { bodyEncrypted } = require('../../../../lib/crypto');

module.exports.getEphemeralKeys = async ({ event }) => {
    let userName, serverEphemeralSecret, user, loginDataSecondStep, user_NonRelational;
    let response = {
        'statusCode': 404,
        'body': 'Login or password is invalid'
    };

    try {
        ({ userName } = bodyEncrypted({ event }));
    } catch (e) {
        console.warn('[savePost][parseJson]', e);
    }
    if (!userName) {
        return response;
    }


    try {
        user = await getUserByUserName_NonRelational({ tableName: config.signedTableName, userName: userName, userRelation: prefixes.user });
        if (!user) {
            return response;
        }
    } catch (e) {
        console.warn("[getEphemeralKeys][getUserByLogin_NonRelational]", e);
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
       await updateEphemeralSecret_NonRelational({
            tableName: config.signedTableName,
            userName: userName,
            serverEphemeralSecret: serverEphemeralSecret,
            user_relation: prefixes.user
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