
const AWS = require('aws-sdk');
const parseJson = require("parse-json");
const { getIndex } = require('./utilities/getIndex');


exports.getIndex = async ({ event }) => {
    let response, post, isAddToIndex, isValid = true;
    try {
        ({ post, addToIndex: isAddToIndex } = parseJson(event.body));
    }
    catch (e) {
        console.warn('savePost', e)
    }

    /*    if (isValid) {
           await getIndex({ post });
           if (isAddToIndex) {
               await updateIndex({ post });
           }
       } */

    try {
        response = {
            'statusCode': 200,
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Credentials": true,
            "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,OPTIONS",
            'body': JSON.stringify({
                message: 'Ok get',
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