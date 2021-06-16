const { savePost } = require('./service/post/savePost');
const { getIndexService } = require('./service/post/getIndex');
const { configApi } = require('./config');


exports.lambdaHandler = async (event, context) => {
    let response;
    const { method, path } = event.requestContext.http;
    const notFoundResponse = {
        'statusCode': 404,
    };

    switch (path) {
        case configApi.savePost.path:
            response = await savePost({ event });
            break;
        case configApi.getIndex.path:
            response = getIndexService({ event });
            break;

        /*     case configApi.register.path:
               response = register({ event });
           case configApi.auth.path:
               response = auth({ event }); */
        default:
            response = notFoundResponse;
    }

    if (!response) {
        response = notFoundResponse;
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