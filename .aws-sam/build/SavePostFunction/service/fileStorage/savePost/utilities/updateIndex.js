// const url = 'http://checkip.amazonaws.com/';
const AWS = require('aws-sdk');
const parseJson = require("parse-json");
const { isPostValid } = require('./utilities/isPostValid');
const { putFile } = require('./utilities/putFile');
const { updateIndex } = require('./utilities/updateIndex');

exports.lambdaHandler = async (event, context) => {
    let response, post, isAddToIndex, isValid = true;
    try {
        ({ post, addToIndex: isAddToIndex } = parseJson(event.body));
    }
    catch (e) {
        console.warn('savePost', e)
    }

    // try {
    //     isValid = isPostValid({ post });
    // } catch (e) {
    //     isValid = false;
    //     // TODO add error response
    //     return;
    // }



    if (isValid) {
        await putFile({ post });
        if (isAddToIndex) {
            console.log('isPostValid Box')
           await updateIndex({post});
        }
    }

    try {
        response = {
            'statusCode': 200,
             headers: {
            "Content-Type" : "application/json",
            "Access-Control-Allow-Headers" : "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
            "Access-Control-Allow-Methods" : "OPTIONS,POST,GET",
            "Access-Control-Allow-Credentials" : true,
            "Access-Control-Allow-Origin" : "*",
            "X-Requested-With" : "*"
        },
            'body': JSON.stringify({
                message: 'Oks',
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