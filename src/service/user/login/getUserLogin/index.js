
const { getUserByLogin } = require('../../../../dataBase/user/get');
const parseJson = require("parse-json");
const stringify = require('fast-json-stable-stringify');
const { config } = require('../../../../config');
const CryptoJS = require('crypto-js');
const { makeToken } = require("../../../../lib/jwt");
const { updateAccessToken } = require('../../../../dataBase/user/update');



module.exports.getUserLogin = async ({ event }) => {
  // TODO add validation
  let user, userName, serverSessionProof, encoded, body;

  let response = {
    'statusCode': 404,
    'body': 'User not found!'
  };

  try {
    const encodedWord = CryptoJS.enc.Base64.parse(event.body);
    encoded = CryptoJS.enc.Utf8.stringify(encodedWord);
  } catch (e) {
    console.warn('[getUserLogin][parseJson]', e);
  }


  try {
    body = parseJson(encoded);
    ({ userName, serverSessionProof } = body);
  } catch (e) {
    console.warn('[getUserLogin][parseJson]', e);
  }


  try {
    user = await getUserByLogin({ tableName: config.userTableName, login: userName });
  } catch (e) {
    console.warn("[getUserLogin][getUserByLogin]", e);
    return response;
  }

  try {
    if (user?.serverSessionProof !== serverSessionProof) {
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

