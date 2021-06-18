const { savePost } = require('./service/post/savePost');
const { getIndexService } = require('./service/post/getIndex');
const { register } = require('./service/user/register');
const { checkLogin } = require('./service/user/register/checkLogin');
const { getEphemeralKeys } = require('./service/user/login/getEphemeralKeys');
const { getSessionProofs } = require('./service/user/login/getSessionProofs');
const { getUserByTokenLogin } = require('./service/user/login/getUserByTokenLogin');
const { httpApi } = require('./config');
const { getUserByLogin } = require('./dataBase/user/get');


exports.lambdaHandler = async (event, context) => {
    let response;
    const { method, path } = event.requestContext.http;
    const notFoundResponse = {
        'statusCode': 404,
    };

    console.log('path', path)

    switch (path) {
        case httpApi.savePost.path:
            response = await savePost({ event });
            break;
        case httpApi.getIndex.path:
            response = await getIndexService({ event });
            break;
        case httpApi.register.path:
            response = await register({ event });
            break;
        case httpApi.registerCheckLogin.path:
            response = await checkLogin({ event });
            break;
        // case httpApi.exchangeEphemeralKeysFirstStepLogin.path:
        //     response = await getEphemeralKeys({ event });
        //     break;
        /*     case httpApi.validateSessionProofsSecondStepLogin.path:
                response = await getSessionProofs({ event });
                break;
            case httpApi.GetUserTokenThirdLoginStepLogin.path:
                response = await getUserByTokenLogin({ event });
                break; */
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