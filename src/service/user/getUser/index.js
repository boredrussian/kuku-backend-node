
const stringify = require('fast-json-stable-stringify');

const { config, prefixes } = require('../../../config');
const { getSubscribed } = require("../_utils/subscribed");
const { bodyEncrypted } = require('../../../lib/crypto');
const { getUserByUserName_NonRelational } = require('../../../dataBaseNonRelational/user/get');

module.exports.getUser = async ({ event }) => {
    // TODO add validation
    let token, user, subscribed, userName;

    let response = {
        'statusCode': 404,
        'body': 'Could not find user ' + user
    };

    try {
        ({ userName } = bodyEncrypted({ event }));
    } catch (e) {
        console.warn('[getUser][bodyEncrypted]', e);
    }
    console.log('userName', userName)

    try {
        user = await getUserByUserName_NonRelational({ tableName: config.signedTableName, userName : userName, userRelation: prefixes.user  });
        console.warn('[getUser][bodyEncrypted]', user);
        if (user) {
            const data = {
              userName: user?.login,
              encryptedWif: user?.encryptedWif,
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