
const parseJson = require("parse-json");
const queryString = require('query-string');
const { config } = require("../../../config");
const stringify = require('fast-json-stable-stringify');
const { updateStatus } = require("../../../dataBase/inbox/update");

// const { getUsers } = require("../../../dataBase/user/get");
// const { putFirstIndexData } = require("../../../dataBase/index/put");
// const { updateUsersSubscribed } = require("../../../dataBase/user/update");
// const { addNewUserToConfig, generateSubscribed, getUserSourcesArr } = require("../_utils/subscribed");

const { bodyEncrypted } = require('../../../lib/crypto');


const updateInbox = async ({ event }) => {
    let address, id, status;
  
    let response = {
        'statusCode': 403,
        'body': `Error was occurred [inbox service] [updateInbox]`
    };
    try {
        ({ address, id, status} = bodyEncrypted({ event }));
         } catch (e) {
        console.warn('[updateInbox][bodyEncrypted]', e);
    }
   
    try {
    await updateStatus({ tableName: config.inboxTableName, id: id,
    address: address, status: status});
    
    response = {
        'statusCode': 200,
        'body':  'Ok'
    };
    } catch (e) {
        console.warn("[updateStatus][2]", e);
    }
   
    return response;
};

module.exports = {
    updateInbox
};






