const { putFile } = require('./utilities/putFile');
const { updateIndex } = require('./utilities/updateIndex');
const { updateTagIndex } = require('./utilities/updateTagIndex');
const { checkIsObjectValid } = require('../../../lib/crypto');
const parseJson = require("parse-json");
const CryptoJS = require('crypto-js');


exports.savePost = async ({ event, isAddToIndex = false, inboxPost = false, inboxAddress = false  }) => {
    let  post, addToIndex, isValid = true, encoded, indexAddress;

    let response = {
        'statusCode': 403,
        'body': `Error was occurred [savePost]  `
    };

    try {
        const encodedWord = CryptoJS.enc.Base64.parse(event.body);
        encoded = CryptoJS.enc.Utf8.stringify(encodedWord);
    } catch (e) {
        console.warn('[savePost][parseJson]', e);
    }

    try {
        const body = parseJson(encoded);
        ({ post, addToIndex } = body);
        if(isAddToIndex && inboxPost && inboxAddress ){
            addToIndex = isAddToIndex;
            post = inboxPost;
            indexAddress = inboxAddress;
        }else{
           indexAddress = post.source.address; 
        }
     
    } catch (e) {
        console.warn('[savePost][parseJson]', e)
    }

    try {
          isValid = checkIsObjectValid({ objData: post, address: post.source.address });
          console.log('isValid!!!!!!!', isValid)
      } catch (e) {
              console.warn('[savePost][checkIsObjectValid]', e)
          isValid = false;
          // TODO add error response
          return;
      }  

    if (isValid) {
        try{
           await putFile({ post });
        } catch (e) {
        console.warn('[savePost][putFile]', e)
    }
  
       
       if (addToIndex) {
           try{
                await updateIndex({ post, indexAddress });
           }catch(e){
               console.warn('[savePost][updateIndex]', e)
           }
           
           try{
                 await updateTagIndex({ post });
           }catch(e){
               console.warn('[savePost][updateTagIndex]', e)
           }
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

