
const { makeToken } = require("../../../lib/jwt");
const { config } = require("../../../config");
const stringify = require('fast-json-stable-stringify');
const { addUser } = require("../../../dataBase/user/put");
const { getSources } = require("../../../dataBase/user/get");
const { updateUsersSubscribed } = require("../../../dataBase/user/update");
const { addNewUserToConfig, getAddresses, generateSubscribed } = require("../_utils/subscribed");
const { bodyEncrypted } = require('../../../lib/crypto');


const register = async ({ event }) => {
  let  address, encryptedWif, userName, salt, verifier, subscribed, sources, hosts;
    let response = {
        'statusCode': 403,
        'body': `Error was occurred [addUser]`
    };
    try {
        ({ address, encryptedWif, userName, salt, verifier, hosts } = bodyEncrypted({ event }));
    } catch (e) {
        console.warn('[register][bodyEncrypted]', e);
    }
    const accessToken = makeToken({ type: "access" });
   
    try {
        await addNewUserToConfig({address});
        console.log('subscribed---register',subscribed)
    } catch (e) {
        console.warn("[register][updateUserConfig]", e);
    }
  
    try {
       sources = await getSources({ tableName: config.userTableName});
       const addresses = getAddresses({users:sources });
     subscribed = generateSubscribed({addresses});
    console.log('https://localhost:3000/---addresses', addresses)
    } catch (e) {
        console.warn("[register][updateUserConfig]", e);
    }


    try {
        await updateUsersSubscribed({ user: config.userTableName});
    } catch (e) {
        console.warn("[register][updateUsersSubscribed]", e);
    }

    try {
        await addUser({
            tableName: config.userTableName,
            address,
            encryptedWif,
            salt,
            verifier,
            login: userName,
            accessToken,
            subscribed,
            hosts
        });

        const resData = {
            accessToken,
            address,
            userName,
            encryptedWif,
            subscribed,
        };

        response = {
            'statusCode': 200,
            'body': stringify(resData)
        };
    }
    catch (e) {
        console.warn("[register][addUser]", e);
    }

    return response;
};

module.exports = {
    register
};






