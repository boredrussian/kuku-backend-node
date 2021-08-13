const { putFile } = require('./utilities/putFile');
const { updateIndex } = require('./utilities/updateIndex');
const { checkIsObjectValid } = require('../../../lib/crypto');
const parseJson = require("parse-json");
const CryptoJS = require('crypto-js');


exports.savePost = async ({ event }) => {
    let response, post, addToIndex, isValid = true, encoded;

    try {
        const encodedWord = CryptoJS.enc.Base64.parse(event.body);
        encoded = CryptoJS.enc.Utf8.stringify(encodedWord);
    } catch (e) {
        console.warn('[savePost][parseJson]', e);
    }

    try {
        const body = parseJson(encoded);
        ({ post, addToIndex } = body);
    } catch (e) {
        console.warn('[savePost][parseJson]', e)
    }

    
    try {
          isValid =  checkIsObjectValid({ objData: post, address: post.source.address });
          console.log('isValid!!!!!!!', isValid)
      } catch (e) {
              console.warn('[savePost][checkIsObjectValid]', e)
          isValid = false;
          // TODO add error response
          return;
      }  

    if (isValid) {
          console.log('1111111111isValid!!!!!!!', isValid);
        await putFile({ post });
        if (addToIndex) {
            await updateIndex({ post });
        }
    }

    try {
        response = {
            'statusCode': 200,
            'body': JSON.stringify({
                message: 'Ok',
            })
        }
    } catch (err) {
        console.log(err);
        return err;
    }

    return response
};

