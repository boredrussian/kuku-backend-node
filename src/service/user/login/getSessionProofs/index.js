
const { getUserByLogin } = require('../../../../dataBase/user/get');
const { updateServerSessionProof } = require('../../../../dataBase/user/update');
const srp = require('secure-remote-password/server');
const parseJson = require("parse-json");
const stringify = require('fast-json-stable-stringify');
const { config } = require('../../../../config');
const CryptoJS = require('crypto-js');


module.exports.getSessionProofs = async ({ event }) => {
    let encoded, userName, clientSessionProof, clientEphemeralPublic, body, user;
    let response = {
        'statusCode': 404,
        'body': 'Login or password is invalid'
    };


    try {
        const encodedWord = CryptoJS.enc.Base64.parse(event.body);
        encoded = CryptoJS.enc.Utf8.stringify(encodedWord);

    } catch (e) {
        console.warn('[sessionProof][parseJson]', e);
    }


    try {
        body = parseJson(encoded);
        ({  userName, clientSessionProof, clientEphemeralPublic, userName } = body);

    } catch (e) {
        console.warn('[getSessionProofs][parseJson]', e);
    }
      
       
        try {
            user = await getUserByLogin({ tableName: config.userTableName, login: userName });
            
            
            console.log('user', user)
        } catch (e) {
            console.warn('[sessionProof][getUserByLogin]', e);
        }


        if (user) {
            try {
                const {serverEphemeralSecret, salt, verifier } = user;
                
                const serverSession = srp.deriveSession(
                    serverEphemeralSecret,
                    clientEphemeralPublic,
                    salt,
                    userName,
                    verifier,
                    clientSessionProof
                );
 
                  await updateServerSessionProof({
                    tableName: config.userTableName,
                    address: user.address,
                    serverSessionProof: serverSession.proof,
                });

                response = {
                    statusCode: 200,
                    body: stringify({ serverSessionProof: serverSession.proof })
                }

             
            } catch (e) {
                console.warn("[sessionProof]", e);
                return response;
            }
        }
        
        return response;
    };
