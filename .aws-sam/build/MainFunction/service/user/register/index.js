const { makeToken } = require("../../../lib/jwt");
const parseJson = require("parse-json");
const { config } = require("../../../config");
const stringify = require('fast-json-stable-stringify');
const { addUser } = require("../../../dataBase/user/put");


module.exports.register = async ({ event }) => {

    let body, response, address, encryptedWif, login, salt, verifier;
    try {
        body = parseJson(event.body);
        ({ address, encryptedWif, login, salt, verifier, privateKey } = body);
    } catch (e) {
        console.warn('[savePost][parseJson]', e);
    }

    const accessToken = makeToken({ type: "access" });
    try {
        const data = await addUser({
            tableName: config.userTableName,
            address: address,
            encryptedWif: encryptedWif,
            salt: salt,
            verifier: verifier,
            login: login,
            accessToken,
        });

        const resData = {
            accessToken,
            address: address,
            login: login,
            encryptedWif: encryptedWif,
        };

        response = {
            'statusCode': 200,
            'body': stringify(resData)
        };
    } catch (e) {
        console.warn("[register]", e);
        response = {
            'statusCode': 403,
            'body': `Error was occurred [addUser] ${e}`
        };
    }

    return response;
};