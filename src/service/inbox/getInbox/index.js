
const parseJson = require("parse-json");
const queryString = require('query-string');
const { config } = require("../../../config");
const stringify = require('fast-json-stable-stringify');
const { getInboxesByAddress } = require("../../../dataBase/inbox/get");

const { getData } = require("../../../dataBase/inbox/get");
const { getUserByAddress } = require("../../../dataBase/user/get");

// const { getUsers } = require("../../../dataBase/user/get");
// const { putFirstIndexData } = require("../../../dataBase/index/put");
// const { updateUsersSubscribed } = require("../../../dataBase/user/update");
// const { addNewUserToConfig, generateSubscribed, getUserSourcesArr } = require("../_utils/subscribed");

const { bodyEncrypted } = require('../../../lib/crypto');


const mentionsStatusFilter = ({arr, status}) => {
    
    if(!Array.isArray(arr)) {
        return []
    }
    
    return arr.filter(m => m.status === status);
    
}


 
  



const getInbox = async ({ event }) => {
    let newMentions;
    
    let response = {
        'statusCode': 403,
        'body': `Error was occurred [inbox service] [getInbox]`
    };
    
    
    const parsedHash = queryString.parse(event.rawQueryString);
    const address = parsedHash.address;
   
    try {
    const mentions =  await getInboxesByAddress({ tableName: config.inboxTableName, address: address});
    
  
   
 
    newMentions = mentionsStatusFilter({arr:mentions, status: 'new' })
    console.log('mentions', mentions);
    console.log('newMentions', newMentions);
    
       response = {
        'statusCode': 200,
        'body':  stringify(newMentions)
    };
    } catch (e) {
        console.warn("[getInbox][getInboxByAddress]", e);
    }
   
    return response;
};

module.exports = {
    getInbox
};






