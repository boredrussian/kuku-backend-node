
const stringify = require('fast-json-stable-stringify');
const { getUserByAccessToken } = require('../../../dataBase/user/get');
const { updateUser } = require('../../../dataBase/user/update');
const { config, prefixes } = require('../../../config');
const { getSubscribed, updateUserSourceInConfig } = require("../_utils/subscribed");
const { bodyEncrypted, checkIsObjectValid } = require('../../../lib/crypto');
const { getIndex } = require('../../../dataBase/index/get');
const { updateIndexUserSource } = require('../../../dataBase/index/update');
const { updateIndexSource_NonRelational } = require('../../../dataBaseNonRelational/index/update');
const { getIndex_NonRelational } = require('../../../dataBaseNonRelational/index/get');

module.exports.userUpdate = async ({ event }) => {

  let source, isValid, currentIndex, currentIndex_NonRelational;
  let response = {
    'statusCode': 404,
    'body': 'Error occurred when try to update user data, source signature or hash is wrong!'
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

  if (!isValid) return response;

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


  try {

    currentIndex_NonRelational = await getIndex_NonRelational({ tableName: config.signedTableName, address: source.address, source_relation: prefixes.source });
    console.log('currentIndex_NonRelational[update user!]', currentIndex_NonRelational);

  } catch (e) {
    console.warn("[updateIndex][currentIndex_NonRelational]", e);
  }

  try {
    await updateIndexSource_NonRelational({ tableName: config.signedTableName, currentIndex: currentIndex_NonRelational, newSource: source, source_relation: prefixes.source });
  }
  catch (e) {
    console.warn('[updateIndex][updateIndexSource_NonRelational]', e);
  }



  return response;
};