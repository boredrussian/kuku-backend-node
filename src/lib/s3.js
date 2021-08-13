const AWS = require("aws-sdk");
const { config } = require("../config");

AWS.config.update({
    region: config.region,
});
const s3 = new AWS.S3();

const putObjectS3 = async ({
    bucket,
    key,
    data,
    ContentType,
}) => {
    let res;
    const params = {
        Bucket: bucket,
        Key: key,
        Body: data,
        ContentType: ContentType,
    };

    console.log("params", params);

    try {
        res = await s3.putObject(params).promise();
    } catch (e) {
        console.warn("putObjectS3-error", e);
    }
    return res;

};





const getObject = async ({ bucket, key }) => {
    try {
        const params = {
            Bucket: bucket,
            Key: key
        };
        console.log('params--- getObject', params);
        const data = await s3.getObject(params).promise();
        return data.Body.toString('utf-8');
    } catch (e) {
        console.warn("[lib][s3][getObject]", e);
    }
}


const isObjectExist = async ({ bucket, key }) => {
    var params = {
        Bucket: bucket,
        Key: key
    };
    try {
        const headCode = await s3.headObject(params).promise();
        // const signedUrl = s3.getSignedUrl('getObject', params);
    } catch (headErr) {
        if (headErr.code === 'NotFound') {
            console.log('777');
            // Handle no object on cloud here  
        }
    }
}

module.exports = {
    putObjectS3,
    getObject,
    isObjectExist
};
