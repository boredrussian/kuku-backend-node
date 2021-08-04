
const parseJson = require("parse-json");
const { config } = require("../../../config");
const stringify = require('fast-json-stable-stringify');
const { putMentionData } = require("../../../dataBase/inbox/put");
const { getInboxBAddressCrossingId } = require("../../../dataBase/inbox/get");
const { getUserByAddress } = require("../../../dataBase/user/get");

//  Status new/rejected/accepted

const { bodyEncrypted } = require('../../../lib/crypto');


const isUserExistInBlackList = ({userBlackList, mentionedUserAddress }) => {
    if(!!userBlackList) {return false};
    
    let isExistInBlackList = false;
    
    if(userBlackList.includes(mentionedUserAddress)){
        isExistInBlackList = true;
    }
    
    return isExistInBlackList;
}


const addInbox = async ({ event }) => {
    let mentionedUserAddress, post, mention, mentonedUser, isUserInBlackList;
    
    let response = {
        'statusCode': 403,
        'body': `Error was occurred [inbox service] [addInbox]`
    };
    try {
        ({ mentionedUserAddress, post} = bodyEncrypted({ event }));
        console.log('mentionedUserAddress', mentionedUserAddress);
        console.log('post', post);
        console.log('event', event);
    } catch (e) {
        console.warn('[register][bodyEncrypted]', e);
    }
 
     try {
    mention =  await getData({ tableName: config.inboxTableName, address: mentionedUserAddress, id: post.id});
   console.log('1111111111111111111')
   
    } catch (e) {
        console.warn("[addInbox][putData]", e);
    }
    
    
    
    
    try {
        
    mentonedUser = await getUserByAddress({ tableName: config.userTableName, address: mentionedUserAddress });
    console.log('mentonedUser', mentonedUser);
    
   const blackList = mentonedUser.blackList ? parseJson(mentonedUser.blackList) : '';
   console.log('blackList', blackList);
    
      isUserInBlackList = isUserExistInBlackList({userBlackList : blackList , mentionedUserAddress });
   console.log('isUserInBlackList', isUserInBlackList);
    
      } catch (e) {
        console.warn("[addInbox][putData]", e);
    }
     console.log('mention', mention);
    if(mention || isUserInBlackList){
        console.warn("[mentoned!!!!!!!! exist!!!]");
        return response; }
   
 try {
     const postJson = stringify(post);
     console.log('mentionedUserAddress---1', mentionedUserAddress);
     console.log('post---1', post);
     console.log('postJson---1', postJson);
    await putMentionData({ tableName: config.inboxTableName, address: mentionedUserAddress, id: post.id, post: postJson, status: 'new' });
    response = {
        'statusCode': 200,
        'body': `Ok`
    };
 } catch (e) {
        console.warn("[addInbox][putData]", e);
  } 
 
    
  
 

   


    return response;
};

module.exports = {
    addInbox
};






