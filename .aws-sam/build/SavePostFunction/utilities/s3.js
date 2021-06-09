const AWS = require("aws-sdk");
AWS.config.update({
    region: "us-west-2",
});
const s3 = new AWS.S3();

exports.putObjectS3 = async ({
    bucket,
    key,
    data,
    type,
}) => {
    const params = {
        Bucket: bucket,
        Key: key,
        Body: data,
        ContentType: type,
    };
    let res;
    try {
        res = await s3.client.putObject(params).promise();
    } catch (e) {
        console.warn("putObject-error", e);
    }
    return res
};