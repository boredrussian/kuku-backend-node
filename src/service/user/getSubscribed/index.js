const stringify = require('fast-json-stable-stringify');
const { getSubscribed } = require("../_utils/subscribed");


module.exports.getSubscribed = async ({ event }) => {
    // TODO add validation
    let subscribed;

    let response = {
        'statusCode': 404,
        'body': 'Errors occurred for get subscribed'
    };

    try {
        subscribed = await getSubscribed({});
    } catch (e) {
        console.warn("[getSubscribed][getSubscribed]", e);
    }

    response = {
        'statusCode': 200,
        'body': stringify(subscribed)
    };

    return response;
};