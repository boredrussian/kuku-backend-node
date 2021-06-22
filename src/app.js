const { savePost } = require('./service/post/savePost');
const { getIndexService } = require('./service/post/getIndex');
const { register } = require('./service/user/register');
const { checkLogin } = require('./service/user/register/checkLogin');
const { getEphemeralKeys } = require('./service/user/login/getEphemeralKeys');
 const { getSessionProofs } = require('./service/user/login/getSessionProofs');
// const { getUserByTokenLogin } = require('./service/user/login/getUserByTokenLogin');
const { httpApi } = require('./config');



exports.lambdaHandler = async (event, context) => {
    let response;
    const { method, path } = event.requestContext.http;
    const notFoundResponse = {
        'statusCode': 404,
    };

    console.log('path', path);

    switch (path) {
        case httpApi.savePost.path:
            response = await savePost({ event });
            break;
        case httpApi.getIndex.path:
            response = await getIndexService({ event });
            break;
        case httpApi.registerCheckLogin.path:
            response = await checkLogin({ event });
            break;
        case httpApi.register.path:
            response = await register({ event });
            break;
        case httpApi.exchangeEphemeralKeysFirstStepLogin.path:
            response = await getEphemeralKeys({ event });
            break;
         case httpApi.validateSessionProofsSecondStepLogin.path:
             response = await getSessionProofs({ event });
             break;
        //   case httpApi.GetUserTokenThirdLoginStepLogin.path:
        //         response = await getUserByTokenLogin({ event });
        //         break;  
        default:
            response = notFoundResponse;
    }

    if (!response) {
        response = notFoundResponse;
    }

    return response;
};



