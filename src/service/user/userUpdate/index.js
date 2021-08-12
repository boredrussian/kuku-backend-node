
const stringify = require('fast-json-stable-stringify');
const { getUserByAccessToken } = require('../../../dataBase/user/get');
const { updateUser } = require('../../../dataBase/user/update');
const { config, prefixes } = require('../../../config');
const { getSubscribed, updateUserSourceInConfig } = require("../_utils/subscribed");
const { bodyEncrypted, checkIsObjectValid } = require('../../../lib/crypto');
const { getIndex } = require('../../../dataBase/index/get');
const { updateIndexUserSource } = require('../../../dataBase/index/update');
const { updateIndexSource_NonReletional } = require('../../../dataBaseNonReletional/index/update');
const { getIndex_NonReletional } = require('../../../dataBaseNonReletional/index/get');

module.exports.userUpdate = async ({ event }) => {

  let source, isValid, currentIndex, currentIndex_NonReletional;
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

if(!isValid) return response;

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
       
    currentIndex_NonReletional = await getIndex_NonReletional({ tableName: config.signedTableName, address: source.address, source_relation: prefixes.source  });
    console.log('currentIndex_NonReletional[update user!]', currentIndex_NonReletional);
    
  } catch (e) {
    console.warn("[updateIndex][currentIndex_NonReletional]", e);
  }
  
  try {
    await updateIndexSource_NonReletional({ tableName: config.signedTableName, currentIndex: currentIndex_NonReletional, newSource: source, source_relation : prefixes.source });
  }
  catch (e) {
    console.warn('[updateIndex][updateIndexSource_NonReletional]', e);
  }

  

  return response;
};