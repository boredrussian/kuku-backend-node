 
 
const stringify = require('fast-json-stable-stringify');
const { config } = require("../../../../config");
const { putObjectS3 } = require("../../../../lib/s3");
const { getUserByAddress } = require('../../../../dataBase/user/get');
const { updateSubscribe } = require('../../../../dataBase/user/update');


exports.updateFollowing = async ({address, followSource, follow}) => {
    let result, subscribed, user, newUserSubscribed;
     try {
          user = await getUserByAddress({tableName: config.userTableName,address});
    } catch (e) {
        console.warn('[changeFollowing][updateFollowing][getUserByAddress]', e);
    }

  if(user.subscribed){
    if(follow){
        const newSubscribedObj = {
            address: followSource.address,
            source: stringify(followSource),
            url: `${config.publicApiHost}/${followSource.address}`
        };
        const subscribedObjExist = user.subscribed.find(src => src.address === followSource.address);
        if(subscribedObjExist){
             newUserSubscribed = user.subscribed.filter(src => src.address !== followSource.address);
             newUserSubscribed.push(newSubscribedObj);
        }
        else {
             user.subscribed.push(newSubscribedObj);
             newUserSubscribed = user.subscribed;
        }
          
         }
         else if(!follow){
                newUserSubscribed = user.subscribed.filter(src => src.address !== followSource.address);
                       }
          }
    try {
      result =await updateSubscribe({tableName: config.userTableName, address, subscribed: newUserSubscribed });
    } catch (e) {
        console.warn("putObject-error", e);
    }
    return result
};