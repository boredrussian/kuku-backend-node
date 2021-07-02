
const { getUserByLogin } = require('../../../../dataBase/user/get');
const parseJson = require("parse-json");
const stringify = require('fast-json-stable-stringify');
const { config } = require('../../../../config');
const CryptoJS = require('crypto-js');
const { makeToken } = require("../../../../lib/jwt");
const { updateAccessToken } = require('../../../../dataBase/user/update');
const { getSubscribed } = require("../../_utils/subscribed");
const { bodyEncrypted } = require('../../../../lib/crypto');

module.exports.getUserLogin = async ({ event }) => {
  // TODO add validation
  let user, userName, serverSessionProof, subscribed;

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
    subscribed = await getSubscribed({ userAddress: user?.address });
  } catch (e) {
    console.warn("[getUser][getSubscribed]", e);
  }

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


    const data = {
      login: user?.login,
      address: user?.address,
      wif: user?.encryptedWif,
      token: accessToken,
      subscribed: subscribed
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

