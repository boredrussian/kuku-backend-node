const stringify = require('fast-json-stable-stringify');
const { getUserByAccessToken } = require('../../../dataBase/user/get');
const { config } = require('../../../config');
const { getSubscribed } = require("../_utils/subscribed");
const { bodyEncrypted } = require('../../../lib/crypto');

module.exports.getUser = async ({ event }) => {
    // TODO add validation
    let token, user, subscribed;

    let response = {
        'statusCode': 404,
        'body': 'Login or password is invalid'
    };

    try {
        ({ token } = bodyEncrypted({ event }));
    } catch (e) {
        console.warn('[getUser][bodyEncrypted]', e);
    }

    try {
        subscribed = await getSubscribed();
    } catch (e) {
        console.warn("[getUser][getSubscribed]", e);
    }


    try {
        user = await getUserByAccessToken({ tableName: config.userTableName, token });
        if (user) {
            const data = {
                address: user?.address,
                userName: user?.login,
                subscribed: subscribed,
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