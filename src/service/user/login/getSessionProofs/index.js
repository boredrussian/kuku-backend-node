
const srp = require('secure-remote-password/server');
const stringify = require('fast-json-stable-stringify');
const { config, prefixes } = require('../../../../config');
const { bodyEncrypted } = require('../../../../lib/crypto');
const { getUserByUserName_NonRelational } = require('../../../../dataBaseNonRelational/user/get');
const { updateServerSessionProof_NonRelational } = require('../../../../dataBaseNonRelational/user/update');


module.exports.getSessionProofs = async ({ event }) => {
    let userName, clientSessionProof, clientEphemeralPublic, user, user_NonRelational;
    let response = {
        'statusCode': 404,
        'body': 'Login or password is invalid'
    };


    try {
        ({ userName, clientSessionProof, clientEphemeralPublic } = bodyEncrypted({ event }));
    } catch (e) {
        console.warn('[getSessionProofs][bodyEncrypted]', e);
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

    if (user) {
        try {
            const { serverEphemeralSecret, salt, verifier } = user;

            const serverSession = srp.deriveSession(
                serverEphemeralSecret,
                clientEphemeralPublic,
                salt,
                userName,
                verifier,
                clientSessionProof
            );

   
            await updateServerSessionProof_NonRelational({
                tableName: config.signedTableName,
                userName: userName,
                serverSessionProof: serverSession.proof,
                userRelation: prefixes.user
            });

            response = {
                statusCode: 200,
                body: stringify({ serverSessionProof: serverSession.proof })
            }

        } catch (e) {
            console.warn("[sessionProof]", e);
            return response;
        }
    }

    return response;
};
