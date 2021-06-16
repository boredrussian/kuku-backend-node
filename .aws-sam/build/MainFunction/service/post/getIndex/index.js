
const { getIndex } = require("../../../dataBase/post/get");
const queryString = require('query-string');
const { config } = require('../../../config');

exports.getIndexService = async ({ event }) => {
    let response, indexData, postsArr;
    const parsedHash = queryString.parse(event.rawQueryString);
    const address = parsedHash.address;

    try {
        indexData = await getIndex({ tableName: config.indexTableName, address });
    } catch (e) {
        console.warn('[getIndex][getIndex]', e);
    }
    if (indexData?.index) {
        response = {
            'statusCode': 200,
            'body': indexData.index
        };
    }
    else {
        response = {
            'statusCode': 404,
            'body': 'not found'
        };
    }
    return response;
};
