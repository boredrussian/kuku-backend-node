const stringify = require('fast-json-stable-stringify');
const { config, prefixes } = require("../../../../config");
const { putObjectS3 } = require("../../../../lib/s3");
const { getUserNameByAddress_NonRelational, getUserByUserName_NonRelational } = require('../../../../dataBaseNonRelational/user/get');
const { setUserSubscribed_NonRelational } = require("../../../../dataBaseNonRelational/user/put");
const { remoweSubscribed_NonRelational } = require("../../../../dataBaseNonRelational/user/delete");

exports.updateFollowing = async ({ address, followSource, follow }) => {
    let result, subscribed, user, newUserSubscribed, user_NonRelational, userName_NonRelational;

    try {
        userName_NonRelational = await getUserNameByAddress_NonRelational({
            tableName: config.signedTableName,
            address,
            source_relation: prefixes.source,
            user_relation: prefixes.user
        });
        userName_NonRelational = userName_NonRelational.slice(`${prefixes.user}-`.length);
    }
    catch (e) {
        console.warn('[updateFollowing][getUserLoginByAddress_NonRelational]', e);
    }

    try {
        user_NonRelational = await getUserByUserName_NonRelational({ tableName: config.signedTableName, userName: userName_NonRelational, user_relation: prefixes.user });

    } catch (e) {
        console.warn("[getUserLogin][getUserByLogin_NonRelational]", e);
    }

    if (follow) {
        try {
            await setUserSubscribed_NonRelational({
                tableName: config.signedTableName,
                currentUserName: userName_NonRelational,
                subscribedAddress: address,
                subscribed_relation: prefixes.subscribed,
                user_relation: prefixes.user,
            });
        } catch (e) {
            console.warn('[register][setUserSubscribed]', e);
        }
    } else {
           await remoweSubscribed_NonRelational({
            tableName: config.signedTableName,
            currentUserName: userName_NonRelational,
            subscribedAddress: address,
            subscribed_relation: prefixes.subscribed,
            user_relation: prefixes.user,
        })
    }

    // try {
    //   result = await updateSubscribed_NonRelational({tableName: config.signedTableName, userName, followSourceAddress: , isFollow: follow });
    // }
    // catch(e){

    // }

    return result
};