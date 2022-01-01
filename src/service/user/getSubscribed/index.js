const stringify = require('fast-json-stable-stringify');
const { getSubscribed } = require("../_utils/subscribed");
const { getUsers_NonRelational } = require("../../../dataBaseNonRelational/user/get");
const { addUser_NonRelational, addUserSourceReletion_NonRelational, putSourceAndIndexInitial_NonRelational, setUserSubscribed_NonRelational }
    = require("../../../dataBaseNonRelational/user/put");
const { config, prefixes } = require("../../../config");
const { addNewUserToConfig, generateSubscribed, getUserSourcesArr, getSubscribedFromIndex } = require("../_utils/subscribed");

module.exports.getSubscribed = async ({ event }) => {
    // TODO add validation
    let subscribed, usersSubscribedList;

    let response = {
        'statusCode': 404,
        'body': 'Errors occurred for get subscribed'
    };

    try {
        usersSubscribedList = await getUsers_NonRelational({ tableName: config.signedTableName,
        sourceRelation: prefixes.source, allSourcesReletion: prefixes.allSources });
        
      if(!usersSubscribedList || !Array.isArray(usersSubscribedList)  ){
         usersSubscribedList = [];
       }
       
       console.log("Got "+usersSubscribedList.length+" sources")

    subscribed = getSubscribedFromIndex(usersSubscribedList);
       
    
    } catch (e) {
        console.warn("[getSubscribed][getSubscribed]", e);
    }

    response = {
        'statusCode': 200,
        'body': stringify(subscribed)
    };

    return response;
};