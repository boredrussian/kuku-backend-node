const parseJson = require("parse-json");
const stringify = require('fast-json-stable-stringify');
const { config, prefixes } = require('../../../../config');
const CryptoJS = require('crypto-js');
const { makeToken } = require("../../../../lib/jwt");
const { getSubscribed } = require("../../_utils/subscribed");
const { bodyEncrypted } = require('../../../../lib/crypto');
const { getUserByUserName_NonRelational, getSubscribed_NonRelational } = require('../../../../dataBaseNonRelational/user/get');
const { getIndex_NonRelational } = require('../../../../dataBaseNonRelational/index/get');
const { updateAccessToken_NonRelational } = require('../../../../dataBaseNonRelational/user/update');
const { remoweUser_NonRelational } = require('../../../../dataBaseNonRelational/user/delete');
const { deleteAllItems } = require('../../../../dataBaseNonRelational/signed/delete');


module.exports.getUserLogin = async ({ event }) => {
    // TODO add validation
    let user, userName, serverSessionProof, subscribed, user_NonRelational, subscribedUser_NonRelational, userIndex, skipSubscribed;

    let response = {
        'statusCode': 404,
        'body': 'User not found!'
    };

    try {
        ({ userName, serverSessionProof, skipSubscribed } = bodyEncrypted({ event }));

        user = await getUserByUserName_NonRelational({ tableName: config.signedTableName, userName: userName, userRelation: prefixes.user });
        console.warn('executed getUserByUserName_NonRelational', user);

        userIndex = await getIndex_NonRelational({
            tableName: config.signedTableName,
            address: user.address,
            sourceRelation: prefixes.source,
            allSourcesReletion: prefixes.allSources,
        });
        console.warn('executed getIndex_NonRelational', userIndex);

        if (user?.serverSessionProof !== serverSessionProof) {
            return response;
        }
        const accessToken = makeToken({ type: "access" });

        await updateAccessToken_NonRelational({
            tableName: config.signedTableName,
            userName: userName,
            accessToken: accessToken,
            userRelation: prefixes.user
        });
        console.warn('executed updateAccessToken_NonRelational');
        if(!skipSubscribed) {
            subscribedUser_NonRelational = await getSubscribed_NonRelational({
                tableName: config.signedTableName,
                userName: userName,
                userRelation: prefixes.user,
                subscribedRelation: prefixes.subscribed,
            });
            console.warn('executed getSubscribed_NonRelational');
    
            const resSubscribed = await Promise.allSettled(
                subscribedUser_NonRelational.map(async (user) => {
                    const address = user.SK.slice(`${prefixes.subscribed}-`.length);
    
                    const res = await getIndex_NonRelational(
                        {
                            tableName: config.signedTableName,
                            address: address,
                            sourceRelation: prefixes.source,
                            allSourcesReletion: prefixes.allSources
                        });
                    console.warn('executed getIndex_NonRelational');
                    return res;
    
                })
            );
            subscribed = resSubscribed.map(data => parseJson(data.value.sourceJson));
        } else {
            subscribed = null
        }

        const data = {
            login: user?.login,
            address: user?.address,
            wif: user?.encryptedWif,
            token: accessToken,
            subscribed: subscribed,
            source: userIndex.sourceJson
        };

        response = {
            statusCode: 200,
            body: stringify(data)
        }
    }

    catch (e) {
        console.warn('Failed to login', e);
    }

    return response
};

