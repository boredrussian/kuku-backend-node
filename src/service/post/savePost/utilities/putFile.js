const AWS = require("aws-sdk");
const stringify = require('fast-json-stable-stringify');
const { config } = require("/opt/nodejs/config");

AWS.config.update({
    region: config.region,
});
const s3 = new AWS.S3();

 

const putObjectS3 = async ({
    bucket,
    key,
    data,
    type,
}) => {
    let res;
    const params = {
        Bucket: bucket,
        Key: key,
        Body: data,
        ContentType: type,
    };

    console.log("params", params);

    try {
        res = await s3.putObject(params).promise();
    } catch (e) {
        console.warn("putObjectS3-error", e);
    }
    return res;

};

const getFoldersName = (hash) => {
    return {
        first: hash.slice(0, 2),
        second: hash.slice(2, 4),
    };
};

exports.putFile = async ({ post }) => {
    let res, postString;
    if (!post?.hash) {
        console.warn('hash is absent');
        return;
    }
    const hash = post.hash;
    const folders = getFoldersName(hash);
    const saveToPath = `${config.savePostFile}/${folders.first}/${folders.second}/${hash}.json`;

    try {
        postString = stringify(post);
    } catch (e) {
        console.warn('postString', postString);
    }

    try {
        await putObjectS3({
            bucket: config.bucket,
            key: saveToPath,
            data: postString,
            type: "application/json",
        });
    } catch (e) {
        console.warn("putObject-error", e);
    }
    return res
};