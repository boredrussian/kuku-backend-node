
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
    'statusCode': 403,
    'body': 'Error occurred when try to update user data, source signature or hash is wrong!'
  };

  try {
    ({ source } = bodyEncrypted({ event }));
  } catch (e) {
    console.warn('[getUser][bodyEncrypted]', e);
  }

  try {
    isValid = checkIsObjectValid({ objData: source, address: source.address });
 
  } catch (e) {
    console.warn('[userUpdate][checkIsObjectValid]', e)
    isValid = false;
    return;
  }

  if (!isValid) return response;


  try {
    currentIndex_NonRelational = await getIndex_NonRelational({ tableName: config.signedTableName, address: source.address, sourceRelation: prefixes.source });
    } catch (e) {
    console.warn("[updateIndex][currentIndex_NonRelational]", e);
  }

  try {
  await updateIndexSource_NonRelational({ tableName: config.signedTableName, currentIndex: currentIndex_NonRelational, newSource: source, sourceRelation: prefixes.source });
 
      response = {
      statusCode: 200,
      body: 'Ok'
    }
    
  }
  catch (e) {
    console.warn('[updateIndex][updateIndexSource_NonRelational]', e);
  }



  return response;
};