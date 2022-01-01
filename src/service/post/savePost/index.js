const { putFile } = require('./utilities/putFile');
const { updateIndex } = require('./utilities/updateIndex');
const { updateTagIndex } = require('./utilities/updateTagIndex');
const { checkIsObjectValid, bodyEncrypted } = require('../../../lib/crypto');
const { isAccessValid } = require('../../../lib/jwt');
const parseJson = require("parse-json");
const CryptoJS = require('crypto-js');


exports.savePost = async ({ event, isAddToIndex = false, inboxPost = false, inboxAddress = false }) => {
    let post, addToIndex, isValid = true, indexAddress, tags;

    let response = {
        'statusCode': 404,
        'body': `Error was occurred [savePost]`
    };

    //  if(!isAccessValid({event})){
    //      return response;
    //  }

    try {
        ({ post, addToIndex, tags } = bodyEncrypted({ event }));

        if (isAddToIndex && inboxPost && inboxAddress) {
            addToIndex = isAddToIndex;
            post = inboxPost;
            indexAddress = inboxAddress;
        } else {
            indexAddress = post.source.address;
        }

        isValid = checkIsObjectValid({ objData: post, address: post.source.address });
        console.log('isValid!!!!!!!', isValid);
    } catch (e) {
        console.warn('[savePost][checkIsObjectValid]', e)
        isValid = false;
    }

    let isUpdated = false;
    if (isValid) {
        await putFile({ data: post, hash: post.hash });

        if (addToIndex) {
            // Here we should send an SQS message instead
            isUpdated = await updateIndex({ post, indexAddress }); // && await updateTagIndex({ post, tags });
        }
    }

    if ((isValid && isUpdated && addToIndex) || (isValid && !addToIndex && !isUpdated)) {
        response = {
            'statusCode': 200,
            'body': JSON.stringify({
                message: 'Ok',
            })
        }
    }
    console.log("isValid = " + isValid + " isUpdated = " + isUpdated + " addtoIndex = " + addToIndex + " returning " + response.body)
    return response
};

