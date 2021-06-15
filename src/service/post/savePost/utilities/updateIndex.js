const AWS = require("aws-sdk");
const { config } = require('/opt/nodejs/config');
const stringify = require("fast-json-stable-stringify");
const parseJson = require("parse-json");


AWS.config.update({
    region: config.region,
});
const dynamoDb = new AWS.DynamoDB.DocumentClient();

const getIndex = async ({
    tableName,
    address,
}) => {
let index;
    const params = {
        TableName: tableName,
        Key: {
            address: address,
        },
    };
    const  res = await dynamoDb.get(params).promise();
   
    if(res.Item){
        index = res.Item;
    } 
    return index;
};



  const putFirstDataPost = async ({
    tableName,
    post
    }) => {
    
    const firstData = {
        posts: [post]
    };
    
    
    try{
        const params = {
    TableName: tableName,
    Item: {
      address: post.source.address,
      index: stringify(firstData),
      version: 0,
    },
  };
    await dynamoDb.put(params).promise();  
    }
    
    catch(e){
          console.warn("[updateIndex][putFirstDataPost]", e);
    }

};


const updateIndexDb = async ({
  tableName,
  currentIndex,
  receivedPost
  }) => {
  let  newIndexJson;
 
  const currentVersion = currentIndex?.version;
  const indexJson = currentIndex?.index;
  const address = currentIndex?.address;

  try {
    const indexObject = parseJson(indexJson);
    const postArray = indexObject.posts;
    if (Array.isArray(postArray)) {
      postArray.push(receivedPost);
    }
    indexObject.posts = postArray;
    newIndexJson = stringify(indexObject);
   } catch (e) {
    console.warn("[updateIndexDb]", e);
  }

  const params = {
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

   await dynamoDb.update(params).promise();
};


exports.updateIndex = async ({ post }) => {
   let currentIndex;
     try {
     currentIndex = await getIndex({ tableName: config.indexTableName, address: post.source.address });
     console.log('datadd', currentIndex);
     
    } catch (e) {
        console.warn("[updateIndex][getIndex]", e);
    }

if(!currentIndex){
    
    try{
         await putFirstDataPost({
             tableName: config.indexTableName,
             post}); 
    }
    catch(e){
        console.warn('[updateIndex][putFirstData]',e);
    }
    
}else {
    
    try{
      await updateIndexDb({ tableName: config.indexTableName, currentIndex, receivedPost: post });
    }
    catch(e){
         console.warn('[updateIndex][updateIndexDb]',e);
    }
}

      
   
};