
const { getUserByLogin } = require('../../../../dataBase/user/get');
const parseJson = require("parse-json");
const stringify = require('fast-json-stable-stringify');
const { config, prefixes } = require('../../../../config');
const CryptoJS = require('crypto-js');
const { makeToken } = require("../../../../lib/jwt");
const { updateAccessToken } = require('../../../../dataBase/user/update');
const { getSubscribed } = require("../../_utils/subscribed");
const { bodyEncrypted } = require('../../../../lib/crypto');
const { getUserByUserName_NonRelational, getSubscribed_NonRelational } = require('../../../../dataBaseNonRelational/user/get');
const { getIndex_NonRelational } = require('../../../../dataBaseNonRelational/index/get');
const { updateAccessToken_NonRelational } = require('../../../../dataBaseNonRelational/user/update');


module.exports.getUserLogin = async ({ event }) => {
  // TODO add validation
  let user, userName, serverSessionProof, subscribed, user_NonRelational, subscribedUser_NonRelational;

  let response = {
    'statusCode': 404,
    'body': 'User not found!'
  };

  try {
    ({ userName, serverSessionProof } = bodyEncrypted({ event }));
  } catch (e) {
    console.warn('[getUserLogin][bodyEncrypted]', e);
  }

  try {
    user = await getUserByLogin({ tableName: config.userTableName, login: userName });

  } catch (e) {
    console.warn("[getUserLogin][getUserByLogin]", e);
    return response;
  }

  try {
    user_NonRelational = await getUserByUserName_NonRelational({ tableName: config.signedTableName, userName: userName, user_relation: prefixes.user });

  } catch (e) {
    console.warn("[getUserLogin][getUserByLogin_NonRelational]", e);
  }

  // try {
  //   subscribed = await getSubscribed({userAddress: user?.address} );
  // } catch (e) {
  //   console.warn("[getUser][getSubscribed]", e);
  // }

  try {
    if (user?.serverSessionProof !== serverSessionProof) {
      return response;
    }
    const accessToken = makeToken({ type: "access" });

    await updateAccessToken({
      tableName: config.userTableName,
      address: user?.address,
      accessToken: accessToken,
    });

    try {
      await updateAccessToken_NonRelational({
        tableName: config.signedTableName,
        userName: userName,
        accessToken: accessToken,
        user_relation: prefixes.user
      });
    } catch (e) {
      console.warn("[getUserLogin][updateAccessToken_NonRelational]", e);
    }


    try {
      subscribedUser_NonRelational = await getSubscribed_NonRelational({
        tableName: config.signedTableName,
        userName: userName,
        user_relation: prefixes.user,
        subscribed_relation: prefixes.subscribed,
      });
    }
    catch (e) { console.warn("[getSubscribed_NonRelational]", e); }

    const resSubscribed = await Promise.allSettled(
      subscribedUser_NonRelational.map(async (user) => {
        const address = user.SK.slice(`${prefixes.subscribed}-`.length);
        try {
          return await getIndex_NonRelational(
            {
              tableName: config.signedTableName,
              address: address,
              source_relation: prefixes.source
            });

        } catch (e) {
          console.warn('[register][setUserSubscribed]', e);
        }
      })
    );

    //  add to response !!!!
    const getSubscribedSource_NonRelational = resSubscribed.map(data => data.value.sourceJson)

    const data = {
      login: user?.login,
      address: user?.address,
      wif: user?.encryptedWif,
      token: accessToken,
      subscribed: user?.subscribed,
      source: user?.source
    };


    response = {
      statusCode: 200,
      body: stringify(data)
    }

    return response
  } catch (e) {
    console.warn("[getUserLogin]", e);
    return response
  }
};

