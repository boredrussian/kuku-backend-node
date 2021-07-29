

const { makeToken } = require("../../../lib/jwt");
const { config } = require("../../../config");
const stringify = require('fast-json-stable-stringify');
const { addUser } = require("../../../dataBase/user/put");
const { getUsers } = require("../../../dataBase/user/get");
const { putFirstIndexData } = require("../../../dataBase/index/put");
const { updateUsersSubscribed } = require("../../../dataBase/user/update");
const { addNewUserToConfig, generateSubscribed, getUserSourcesArr } = require("../_utils/subscribed");
const { bodyEncrypted } = require('../../../lib/crypto');


const register = async ({ event }) => {
    let address, encryptedWif, userName, salt, verifier, subscribed, usersList, hosts, source;
    let response = {
        'statusCode': 403,
        'body': `Error was occurred [addUser]`
    };
    try {
        ({ address, encryptedWif, userName, salt, verifier, source } = bodyEncrypted({ event }));
    } catch (e) {
        console.warn('[register][bodyEncrypted]', e);
    }
    const accessToken = makeToken({ type: "access" });

    try {
        await addNewUserToConfig({ source });
    } catch (e) {
        console.warn("[register][updateUserConfig]", e);
    }

    try {
        usersList = await getUsers({ tableName: config.userTableName });
        subscribed = generateSubscribed({ usersList });
    } catch (e) {
        console.warn("[register][updateUserConfig]", e);
    }

    // ???
    // try {
    //     await updateUsersSubscribed({ user: config.userTableName});
    // } catch (e) {
    //     console.warn("[register][updateUsersSubscribed]", e);
    // }


    try {
        await putFirstIndexData({
            tableName: config.indexTableName,
            address: address,
            firstData: { posts: [], source: source }
        });
    }
    catch (e) {
        console.warn('[updateIndex][putFirstData]', e);
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
            source: stringify(source)
        });

        const resData = {
            accessToken,
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






