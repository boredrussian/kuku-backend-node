
const parseJson = require("parse-json");
const { config, prefixes } = require("../../../config");
const stringify = require('fast-json-stable-stringify');
const { putInboxPost_NonRelational, putInboxMentionAuthor_NonRelational } = require("../../../dataBaseNonRelational/inbox/put");
const { bodyEncrypted } = require('../../../lib/crypto');
const { isAccessValid } = require('../../../lib/jwt');

const { getUserNameByAddress_NonRelational, getUserByUserName_NonRelational } = require('../../../dataBaseNonRelational/user/get');


// inbox statuses new/rejected/accepted


const isUserExistInBlackList = ({userBlackList, mentionedUserAddress }) => {
    if(!!userBlackList) {return false};
    
    let isExistInBlackList = false;
    
    if(userBlackList.includes(mentionedUserAddress)){
        isExistInBlackList = true;
    }
    return isExistInBlackList;
}


const addInbox = async ({ event }) => {
    let mentionedUserAddress, post, mention, mentonedUser, isUserInBlackList, userName_NonRelational, user_NonRelational;
    
    let response = {
        'statusCode': 403,
        'body': `Error was occurred [inbox service] [addInbox]`
    };
    
    
    if(!isAccessValid({event})){
    return response;
    }
    
    try {
        ({ mentionedUserAddress, post} = bodyEncrypted({ event }));
    } catch (e) {
        console.warn('[register][bodyEncrypted]', e);
        return response;
    }
 
    try {
        userName_NonRelational = await getUserNameByAddress_NonRelational({
            tableName: config.signedTableName,
            address: mentionedUserAddress,
            sourceRelation: prefixes.source,
            userRelation: prefixes.user
        });
        userName_NonRelational = userName_NonRelational.slice(`${prefixes.user}-`.length);
    }
    catch (e) {
        console.warn('[addInbox][getUserNameByAddress_NonRelational]', e);
    }

    try {
        user_NonRelational = await getUserByUserName_NonRelational({
            tableName: config.signedTableName,
            userName: userName_NonRelational,
            user_relation: prefixes.user });
            
        const blackList = mentonedUser.blackList ? parseJson(mentonedUser.blackList) : '';
        isUserInBlackList = isUserExistInBlackList({userBlackList : blackList , mentionedUserAddress }); 
            
    } catch (e) {
        console.warn("[getUserLogin][getUserByLogin_NonRelational]", e);
    }
 
        
 
    
    
  if(mention || isUserInBlackList){
        console.warn("[mentoned!!!!!!!! exist!!!]");
        return response; }
   
 try {
    const postJson = stringify(post);
 
    await putInboxPost_NonRelational({
    tableName: config.signedTableName,
    mentionedUserAddress,
    authorPostAddress:  post.source.address,
    postId: post.id,
    postJson,
    status: 'new',
    sourceRelation : prefixes.source,
    inboxRelation : prefixes.inbox,
    inboxPostRelation : prefixes.inboxPost,
    createdAt: Date.now()
    });
  } catch (e) {
        console.warn("[addInbox][putData]", e);
  } 
  
 try {
    await putInboxMentionAuthor_NonRelational({
    tableName: config.signedTableName,
    authorPostAddress:  post.source.address,
    postId: post.id,
    sourceRelation : prefixes.source,
    inboxPostRelation : prefixes.inboxPost,
    });
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






