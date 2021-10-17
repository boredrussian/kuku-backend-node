const AWS = require("aws-sdk");
const { config } = require('../../config');

AWS.config.update({
    region: config.region,
});
const dynamoDb = new AWS.DynamoDB.DocumentClient();




const getAllRecords = async (table) => {
  let params = {
    TableName: table,
  };
  let items = [];
  let data = await dynamoDb.scan(params).promise();
  items = [...items, ...data.Items];
  while (typeof data.LastEvaluatedKey != "undefined") {
    params.ExclusiveStartKey = data.LastEvaluatedKey;
    data = await dynamoDb.scan(params).promise();
    items = [...items, ...data.Items];
  }
  return items;
};


const deleteItem = ({tableName, pk, sk}) => {
  var params = {
    TableName: tableName,
    Key: {
      PK: pk,
      SK: sk,
    },
  };

  return new Promise(function (resolve, reject) {
    dynamoDb.delete(params, function (err, data) {
      if (err) {
        console.log("Error Deleting ",  err);
        reject(err);
      } else {
        console.log("Success Deleting ",  err);
        resolve();
      }
    });
  });
};



// exports.deleteAllItems = async function (event, context, callback) {
exports.deleteAllItems = async function ({tableName  }) {
  try {
    // const tableName = "<table>";
    // scan and get all items
    const allRecords = await getAllRecords(tableName);
    // delete one by one 
    for (const item of allRecords) {
      await deleteItem({tableName, pk: item.PK, sk: item.SK});
    }
    // callback(null, {
    //   msg: "All records are deleted.",
    // });
  } catch (e) {
      console.log("callback", e);
    // callback(null, JSON.stringify(e, null, 2));
  }
};