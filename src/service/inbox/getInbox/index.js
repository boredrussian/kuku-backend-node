const parseJson = require("parse-json");
const queryString = require('query-string');
const { config, prefixes } = require("../../../config");
const stringify = require('fast-json-stable-stringify');
const { getInbox_NonRelational } = require("../../../dataBaseNonRelational/inbox/get");
const { getData } = require("../../../dataBase/inbox/get");
const { getUserByAddress } = require("../../../dataBase/user/get");
const { bodyEncrypted } = require('../../../lib/crypto');


const mentionsStatusFilter = ({arr, status}) => {
    if(!Array.isArray(arr)) {
        return []
    }
return arr.filter(m => m.status === status);
  }

const getInbox = async ({ event }) => {
    let response = {
        'statusCode': 403,
        'body': `Error was occurred [inbox service] [getInbox]`
    };
    
    const parsedHash = queryString.parse(event.rawQueryString);
    const address = parsedHash.address;
   try {
   const mentions_NonRelational =  await getInbox_NonRelational({ tableName: config.signedTableName,
   address: address,
   inboxPostRelation: prefixes.inboxPost,
   sourceRelation: prefixes.source
   });
    
    response = {
        'statusCode': 200,
        'body':  stringify(mentions_NonRelational)
    };
    } catch (e) {
        console.warn("[getInbox][getInbox_NonRelational]", e);
    }
    return response;
};

module.exports = {
    getInbox
};






