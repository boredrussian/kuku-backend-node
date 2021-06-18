const { putFile } = require('./utilities/putFile');
const { updateIndex } = require('./utilities/updateIndex');
const { checkIsPostValid } = require('./utilities/isPostValid');
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

    /*   try {
          isValid = checkIsPostValid({ post });
          console.log('isValid', isValid)
      } catch (e) {
          isValid = false;
          // TODO add error response
          return;
      } */

    if (isValid) {
        await putFile({ post });
        if (addToIndex) {
            await updateIndex({ post });
        }
    }

    try {
        response = {
            'statusCode': 200,
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Credentials": true,
            "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,OPTIONS",
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




/*
SavePostFunction:
    Type: AWS::Serverless::Function # More info about Function Resource: https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
    Properties:
      CodeUri: save-post/
      Handler: app.lambdaHandler
      Runtime: nodejs14.x
      Role: arn:aws:iam::164620743841:role/lambda-execution-role # Pre-existing role
      Layers:
        - !Ref DepLayer
      Events:
        SavePost:
          Type: HttpApi # More info about API Event Source: https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#api
          Properties:
            Path: /post
            Method: post
 */