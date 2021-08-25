
const parseJson = require("parse-json");
const queryString = require('query-string');
const { config, prefixes } = require("../../../config");
const stringify = require('fast-json-stable-stringify');
 
const { getInboxItem } = require("../../../dataBaseNonRelational/inbox/get");
const { updateInboxItem_NonRelation } = require("../../../dataBaseNonRelational/inbox/update");
const { savePost } = require("../../post/savePost");

 

//  new/rejected/accepted
const { bodyEncrypted } = require('../../../lib/crypto');


const updateInbox = async ({ event }) => {
    let id, status, authorAddress, destinationAddress, inboxItem, post;
  
    let response = {
        'statusCode': 403,
        'body': `Error was occurred [inbox service] [updateInbox]`
    };
    try {
        ({id, status, destinationAddress, authorAddress } = bodyEncrypted({ event }));
         } catch (e) {
        console.warn('[updateInbox][bodyEncrypted]', e);
        return response;
    }
    
 
    try {
    await updateInboxItem_NonRelation({
        tableName: config.signedTableName,
        id: id,
        authorAddress,
        destinationAddress,
        newStatus: status,
        inboxPostRelation: prefixes.inboxPost,
        sourceRelation: prefixes.source
        });
     } catch (e) {
        console.warn("[updateInbox][updateInboxItem_NonRelation]", e);
        return response;
    }
    
    if(status === 'accepted'){
       
     try{
    const {postJson} = await getInboxItem({
        tableName: config.signedTableName,
        id: id,
        authorAddress,
        destinationAddress,
        inboxPostRelation: prefixes.inboxPost,
        sourceRelation: prefixes.source
    });
    
    post = parseJson(postJson);
    
    
    console.warn("[inboxItem][inboxItem]", postJson);
    
    response = {
        'statusCode': 200,
        'body':  'Ok'
    };
    
    }catch(e){
     console.warn("[updateInbox][getInboxItem]", e);
     return response;
    }
    
  try {
  response = await savePost({event, isAddToIndex: true, inboxPost: post, inboxAddress: destinationAddress });
   response = {
        'statusCode': 200,
        'body':  'Ok'
  };
  } catch (e) {
        console.warn("[updateInbox][updateInboxItem_NonRelation]", e);
        return response;
  }
  }
 
      return response;
};

module.exports = {
    updateInbox
};






