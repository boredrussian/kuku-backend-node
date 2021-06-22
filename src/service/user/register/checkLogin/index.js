const parseJson = require("parse-json");
const stringify = require('fast-json-stable-stringify');
const { getUserByLogin } = require('../../../../dataBase/user/get');
const { config } = require("../../../../config");
const CryptoJS = require('crypto-js');


module.exports.checkLogin = async ({ event }) => {
    
    let body, response, login, isFreeLogin, encoded;
    
  
      try{
     const encodedWord = CryptoJS.enc.Base64.parse(event.body);
     encoded = CryptoJS.enc.Utf8.stringify(encodedWord);
    }
    catch(e){
          console.warn('[register][Base64.parse]', e);
    }
    
    
    try {
        body = parseJson(encoded);
        ({ login } = body);
        console.log('login', login);
    } catch (e) {
        console.warn('[checkLogin][parseJson]', e);
    }

    try {
        const user = await getUserByLogin({ tableName: config.userTableName, login: login });
        if (user) {
            isFreeLogin = false;
        }
        else {
            isFreeLogin = true;
        }

        response = {
            'statusCode': 200,
            'body': stringify({ isFreeLogin })
        };
        return response;

    } catch (e) {
        console.warn("isFreeLogin", e);
        response = {
            'statusCode': 403,
            'body': `Error occurred when try checkLogin, ${e}`
        };
        return response;
    }

};