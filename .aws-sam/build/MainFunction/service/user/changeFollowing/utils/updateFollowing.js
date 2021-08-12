const stringify = require('fast-json-stable-stringify');
const { config, prefixes } = require("../../../../config");
const { putObjectS3 } = require("../../../../lib/s3");
const { getUserByAddress } = require('../../../../dataBase/user/get');
const { getUserNameByAddress_NonRelational, getUserByUserName_NonRelational } = require('../../../../dataBaseNonRelational/user/get');
const { updateSubscribe } = require('../../../../dataBase/user/update');
const { setUserSubscribed_NonRelational } = require("../../../../dataBaseNonRelational/user/put");
const { removeSubscribed_NonRelational } = require("../../../../dataBaseNonRelational/user/delete");

exports.updateFollowing = async ({ address, followSource, follow }) => {
    let result, subscribed, user, newUserSubscribed, user_NonRelational, userName_NonRelational;
    try {
        user = await getUserByAddress({ tableName: config.userTableName, address });
    } catch (e) {
        console.warn('[changeFollowing][updateFollowing][getUserByAddress]', e);
    }

    if (user.subscribed) {
        if (follow) {
            const newSubscribedObj = {
                address: followSource.address,
                source: stringify(followSource),
                url: `${config.publicApiHost}/${followSource.address}`
            };
            const subscribedObjExist = user.subscribed.find(src => src.address === followSource.address);
            if (subscribedObjExist) {
                newUserSubscribed = user.subscribed.filter(src => src.address !== followSource.address);
                newUserSubscribed.push(newSubscribedObj);
            }
            else {
                user.subscribed.push(newSubscribedObj);
                newUserSubscribed = user.subscribed;
            }

        }
        else if (!follow) {
            newUserSubscribed = user.subscribed.filter(src => src.address !== followSource.address);
        }
    }
    try {
        result = await updateSubscribe({ tableName: config.userTableName, address, subscribed: newUserSubscribed });
    } catch (e) {
        console.warn("putObject-error", e);
    }

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
        console.warn('[updateFollowing][getUserNameByAddress_NonRelational]', e);
    }

    try {
        user_NonRelational = await getUserByUserName_NonRelational({ tableName: config.signedTableName, userName: userName_NonRelational, user_relation: prefixes.user });
    } catch (e) {
        console.warn("[getUserLogin][getUserByUserName_NonRelational]", e);
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
        await removeSubscribed_NonRelational({
            tableName: config.signedTableName,
            currentUserName: userName_NonRelational,
            subscribedAddress: address,
            subscribed_relation: prefixes.subscribed,
            user_relation: prefixes.user,
        })
    }
 

    return result
};