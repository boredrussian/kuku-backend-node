const stringify = require('fast-json-stable-stringify');
// const { config } = require("/opt/nodejs/config");
const { config } = require("../../../../config");
const { putObjectS3 } = require("../../../../lib/s3");
const { getFoldersName } = require("../../_utils");
 
 

exports.putFile = async ({ post }) => {
    let res, postString;
    if (!post?.hash) {
        console.warn('hash is absent');
        return;
    }
    const hash = post.hash;
    const folders = getFoldersName(hash);
    const saveToPath = `${config.savePostFile}/${folders.first}/${folders.second}/${folders.fileName}.json`;
  
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