
const stringify = require('fast-json-stable-stringify');
const { getUserByAccessToken } = require('../../../dataBase/user/get');
const { updateUser } = require('../../../dataBase/user/update');
const { config } = require('../../../config');
const { getSubscribed, updateUserSourceInConfig } = require("../_utils/subscribed");
const { bodyEncrypted, checkIsObjectValid } = require('../../../lib/crypto');
const { getIndex } = require('../../../dataBase/index/get');
const { updateIndexUserSource } = require('../../../dataBase/index/update');

module.exports.userUpdate = async ({ event }) => {

  let source, isValid, currentIndex;

  let response = {
    'statusCode': 404,
    'body': 'Login or password is invalid'
  };

  try {
    ({ source } = bodyEncrypted({ event }));
  } catch (e) {
    console.warn('[getUser][bodyEncrypted]', e);
  }

  try {
    isValid = checkIsObjectValid({ objData: source, address: source.address });
    console.log('isValid!!!!!!!', isValid);
  } catch (e) {
    console.warn('[userUpdate][checkIsObjectValid]', e)
    isValid = false;
    return;
  }

  try {
    await updateUser({
      tableName: config.userTableName,
      address: source.address,
      source: stringify(source)
    });

    response = {
      statusCode: 200,
      body: 'Ok'
    }

  } catch (e) {
    console.warn("[userUpdate][updateUser]", e);
    return response;
  }

  try {
    currentIndex = await getIndex({ tableName: config.indexTableName, address: source.address });
  } catch (e) {
    console.warn("[updateIndex][getIndex]", e);
  }

  try {
    await updateIndexUserSource({ tableName: config.indexTableName, currentIndex, newSource: source });
  }
  catch (e) {
    console.warn('[updateIndex][updateIndexDb]', e);
  }

  try {
    await updateUserSourceInConfig({ source });
  } catch (e) {
    console.warn("[userUpdate][updateUserSourceInConfig]", e);

  }

  return response;
};