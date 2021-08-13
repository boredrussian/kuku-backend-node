
const stringify = require('fast-json-stable-stringify');
const { updateFollowing } = require('./utils/updateFollowing');
const { config } = require('../../../config');
const { getSubscribed } = require("../_utils/subscribed");
const { bodyEncrypted } = require('../../../lib/crypto');

module.exports.changeFollowing = async ({ event }) => {
    let address, followSource, follow;

    let response = {
        'statusCode': 404,
        'body': 'Error occured try to following'
    };

    try {
        ({ address, followSource, follow } = bodyEncrypted({ event }));
     }
    catch (e) {
        console.warn('[getUser][bodyEncrypted]', e);
        return response;
    }
 
    try {
      await updateFollowing({address, followSource, follow});
       response = {
        'statusCode': 200,
        'body': 'Ok'
    };
    } catch (e) {
        console.warn('[getUser][bodyEncrypted]', e);
          return response;
    }
  
   

  return response;
};