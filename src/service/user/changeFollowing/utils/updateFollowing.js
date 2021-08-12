const stringify = require('fast-json-stable-stringify');
const { config, prefixes } = require("../../../../config");
const { putObjectS3 } = require("../../../../lib/s3");
const { getUserByAddress } = require('../../../../dataBase/user/get');
const { getUserNameByAddress_NonReletional, getUserByUserName_NonReletional } = require('../../../../dataBaseNonReletional/user/get');
const { updateSubscribe } = require('../../../../dataBase/user/update');
const { setUserSubscribed_NonReletional } = require("../../../../dataBaseNonReletional/user/put");
const { remoweSubscribed_NonReletional } = require("../../../../dataBaseNonReletional/user/delete");

exports.updateFollowing = async ({address, followSource, follow}) => {
    let result, subscribed, user, newUserSubscribed, user_NonReletional, userName_NonReletional;
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
      result = await updateSubscribe({tableName: config.userTableName, address, subscribed: newUserSubscribed });
    } catch (e) {
        console.warn("putObject-error", e);
    }
    
    try {
      userName_NonReletional = await getUserNameByAddress_NonReletional({
      tableName: config.signedTableName,
      address,
      source_relation: prefixes.source,
      user_relation : prefixes.user
      });
      userName_NonReletional = userName_NonReletional.slice(`${prefixes.user}-`.length); 
    }
    catch(e){
     console.warn('[updateFollowing][getUserLoginByAddress_NonReletional]', e); 
    }
    
       try {
        user_NonReletional = await getUserByUserName_NonReletional({ tableName: config.signedTableName, userName: userName_NonReletional, user_relation: prefixes.user });
        console.log('userName_NonReletional88888nal', userName_NonReletional);
        console.log('user_NonReletio678888888888nal', user_NonReletional);
    } catch (e) {
        console.warn("[getUserLogin][getUserByLogin_NonReletional]", e);
        }
        
        
    if(follow){
         try{
              await setUserSubscribed_NonReletional({
              tableName: config.signedTableName,
              currentUserName: userName_NonReletional,
              subscribedAddress: address,
              subscribed_relation: prefixes.subscribed,
              user_relation: prefixes.user,
              });
          }catch(e){
              console.warn('[register][setUserSubscribed]', e);
          }
    }else {
        console.log(' await remoweSubscribed_NonReletional({')
        await remoweSubscribed_NonReletional({
             tableName: config.signedTableName,
             currentUserName: userName_NonReletional,
             subscribedAddress: address,
             subscribed_relation: prefixes.subscribed,
             user_relation: prefixes.user,
        })
    }
        
    // try {
    //   result = await updateSubscribed_NonReletional({tableName: config.signedTableName, userName, followSourceAddress: , isFollow: follow });
    // }
    // catch(e){
        
    // }
    
    return result
};