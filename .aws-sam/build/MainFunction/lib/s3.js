const AWS = require("aws-sdk");
 const { config } = require("../config");

AWS.config.update({
    region: config.region,
});
const s3 = new AWS.S3();

module.exports.putObjectS3 = async ({
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