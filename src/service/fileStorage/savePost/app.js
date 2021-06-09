// const url = 'http://checkip.amazonaws.com/';
const AWS = require('aws-sdk');
const { nanoid } = require('nanoid');
const stringify = require('fast-json-stable-stringify');
const { isPostValid } = require('./utilities/isPostValid');
const { putObjectS3 } = require('./utilities/s3');
const config = require("/opt/nodejs/config");


// TODO: use env.variables
const bucket = 'kuku-staging';
const savePostFile = 'public/file_storage';
let response;

AWS.config.update({
    region: "us-west-2",
});

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const dynamoDbTable = new AWS.DynamoDB();

const s3 = new AWS.S3();

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html 
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 * 
 */


const getFoldersName = (hash) => {
    return {
        first: hash.slice(0, 2),
        second: hash.slice(2, 4),
    };
};

const putData = async ({
    tableName = "signed-index",
    address,
    data,
}) => {
    const params = {
        TableName: tableName,
        Item: {
            address,
            encryptedWif,
            salt,
            privateKey,
            verifier,
            login,
            accessToken,
        },
    };
    await dynamoDb.put(params).promise();
};



const updateIndexDb = async ({
    tableName = "signed-index",
    data,
    address = "testHash",
}) => {

    let postsObject, newIndexJson;
    const currentData = await getIndex({ address: "testHash" });

    if (currentData.Item.length > 0) {

    }

    else {

    }
    /*     const currentVersion = currentData?.Item?.version;
        const indexJson = currentData?.Item?.index; */

    /*     try {
            const indexObject = parseJson(indexJson);
            const postArray = indexObject.posts;
            if (Array.isArray(postArray)) {
                postArray.push(data);
            }
            indexObject.posts = postArray;
            newIndexJson = stringify(indexObject);
        } catch (e) {
            console.warn("[updateIndexDb]", e);
        } */

    /*     const params = {
            TableName: tableName,
            Key: {
                address: address,
            },
            UpdateExpression: "SET #index = :newIndex, #version = :version",
            ConditionExpression: "#version = :expectedVersion",
            ExpressionAttributeNames: {
                "#index": "index",
                "#version": "version",
            },
            ExpressionAttributeValues: {
                // ":index": '{ "posts": [] }',
                ":newIndex": newIndexJson,
                ":version": currentVersion + 1,
                ":expectedVersion": currentVersion,
            },
            ReturnValues: "ALL_NEW",
        };
    
        const results = await dynamoDb.update(params).promise(); */
};


exports.lambdaHandler = async (event, context) => {
    try {
        isValid = isPostValid([{ post: { kkk: 'fjaskljas;fdkljs;fdl' } }]);
        console.log("isValid", isValid);
    } catch (e) {
        isValid = false;
    }


    // const hash = post.hash;
    const hash = nanoid();
    console.log('hash', hash);
    const folders = getFoldersName(hash);
    console.log('folders', folders);

    try {
        let data = { aaa: 'fjfjfj', ddd: '2312321312' }
        data = stringify(data);
        console.log('data', data);
        const saveToPath = `${config.savePostFile}/${folders.first}/${folders.second}/${hash}.json`;

        console.log('putObjectS3', putObjectS3);

        await putObjectS3({
            bucket: config.bucket,
            key: saveToPath,
            data,
            type: "application/json",
        });
    } catch (e) {
        console.error("[readIndex]", e);
    }

    try {
        await putDataIndex({
            tableName: "signed-index",
            address: 'data.address',
            data: 'fjkdfas',
            version: '0'
        });
    }
    catch (e) {
        console.warn('e', e);
    }

    try {
        // const ret = await axios(url);
        response = {
            'statusCode': 200,
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