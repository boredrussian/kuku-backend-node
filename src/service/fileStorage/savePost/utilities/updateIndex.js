const AWS = require("aws-sdk");
const { config } = require('/opt/nodejs/config');

AWS.config.update({
    region: config.region,
});
const dynamoDb = new AWS.DynamoDB.DocumentClient();

const getIndex = async ({
    tableName,
    address,
}) => {
    const params = {
        TableName: tableName,
        Key: {
            address: address,
        },
    };
    return await dynamoDb.get(params).promise();
};

exports.updateIndex = async ({ post }) => {
    let book;
    try {
        // book.posts.push(post);
        const data = await getIngidex({ tableName: config.indexTableName, address: 'data.address' });

        console.log('data------exports.updateIndex', data);
        // createTable({});
        // deleteTable({});

        /*     await putData({
          data: { posts: [] },
          address: "testHash",
          version: 0,
        }); */

        // const data = await updateIndexDb({ data: post, address: "testHash" });

        // await dynamoDb.put(params).promise();
    } catch (e) {
        console.error("[updateIndex][getIndex]", e);
    }

};