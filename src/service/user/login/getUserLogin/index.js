
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
const { remoweUser_NonRelational } = require('../../../../dataBaseNonRelational/user/delete');
const { deleteAllItems } = require('../../../../dataBaseNonRelational/signed/delete');


module.exports.getUserLogin = async ({ event }) => {
  // TODO add validation
  let user, userName, serverSessionProof, subscribed, user_NonRelational, subscribedUser_NonRelational, userIndex;

  let response = {
    'statusCode': 404,
    'body': 'User not found!'
  };

  try {
    ({ userName, serverSessionProof } = bodyEncrypted({ event }));
  } catch (e) {
    console.warn('[getUserLogin][bodyEncrypted]', e);
  }

 
  
  
  try{
    // user = await remoweUser_NonRelational({ tableName: config.signedTableName, currentUserName: 'vbvb', userRelation: prefixes.user });
    // user = await deleteAllItems({ tableName: config.signedTableName});
     console.warn('[delete][delete]' );
  }catch(e){
    console.warn('[getUserLogin][deleteAllItems]', e);
  }

  try {
    user  = await getUserByUserName_NonRelational({ tableName: config.signedTableName, userName: userName, userRelation: prefixes.user });
    console.warn('user getUserByUserName_NonRelational', user);
  } catch (e) {
    console.warn("[getUserLogin][getUserByLogin_NonRelational]", e);
  }
  
  try {
    userIndex  = await getIndex_NonRelational({ tableName: config.signedTableName, address: user.address, sourceRelation: prefixes.source });
    console.warn('user getIndex_NonRelational', userIndex);
  } catch (e) {
    console.warn("[getUserLogin][getIndex_NonRelational]", e);
  }

 
    if (user?.serverSessionProof !== serverSessionProof) {
      return response;
    }
    const accessToken = makeToken({ type: "access" });

  

    try {
      await updateAccessToken_NonRelational({
        tableName: config.signedTableName,
        userName: userName,
        accessToken: accessToken,
        userRelation: prefixes.user
      });
    } catch (e) {
      console.warn("[getUserLogin][updateAccessToken_NonRelational]", e);
    }


    try {
      subscribedUser_NonRelational = await getSubscribed_NonRelational({
        tableName: config.signedTableName,
        userName: userName,
        userRelation: prefixes.user,
        subscribedRelation: prefixes.subscribed,
      });
    }
 catch (e) { console.warn("[getSubscribed_NonRelational]", e); }

 try{
      const resSubscribed = await Promise.allSettled(
      subscribedUser_NonRelational.map(async (user) => {
        const address = user.SK.slice(`${prefixes.subscribed}-`.length);
        try {
          return await getIndex_NonRelational(
            {
              tableName: config.signedTableName,
              address: address,
              sourceRelation: prefixes.source
            });

        } catch (e) {
          console.warn('[getUSerLogin][setUserSubscribed]', e);
        }
      })
    );
    try{
    subscribed = resSubscribed.map(data => parseJson(data.value.sourceJson));
    }
    catch(e){
      console.warn('[getUSerLogin][getIndex_NonRelational][gather subscribed source]', e);
      subscribed = []
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
 
 catch (e){
   console.warn('[getUSerLogin][getIndex_NonRelational - combine][sendData]', e);
 }

  return response
};

