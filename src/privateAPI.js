const { checkSignature, getHash } = require('./signatures')
const { getItems, getItem, putItem } = require('./db');
const { config } = require('config');
const AWS = require("aws-sdk");
const mime = require("mime");

AWS.config.update({
    region: config.region,
});
const s3 = new AWS.S3();

const putS3 = async ({hash, data, contentType}) => {
    const fileExtension = mime.getExtension(contentType);
    const path = `${config.fileStorage}/${hash.slice(0, 2)}/${hash.slice(2, 4)}/${hash.slice(4)}.${fileExtension}`;
    
    return s3.putObject({
        Bucket: config.bucket,
        Key: path,
        Body: data,
        ContentType: contentType,
    }).promise();
}
        
module.exports.putPost = async ({ event }) => {
    // posts-from-[address] / post-[createdAt]-[address] - postJSON, replies count, likes count, reposts count
    // hash-[hash] / post-[createdAt]-[address] - type, size, mime-type, username, uploadedAt

    // TODO - check the JWT token!
    
    const { post } = event;
    const { address, createdAt, updatedAt, signature, type } = post;
    
    // Check post fields
    if(!address || !createdAt || !updatedAt || !signature || !type) throw 'Post missing a required field';
    
    // validate post
    if(!checkSignature(post, address)) throw 'Invalid signature';
    
    // add post to DDB - only overwrite if the post is newer
    let Item = {
        PK: 'posts-from-' + address,
        SK: 'post-' + createdAt + '-' + address,
        post,
        postStats: {
            likesCount: 0,
            repostsCount: 0,
            commentsCount:0
        }
    }
    const existingItem = getItem(Item);
    if(existingItem && existingItem.post.updatedAt > post.updatedAt) return false;
    
    const hash = getHash({obj: post});
    post.hash = hash;
    
    const ddbItem = putItem({Item});
    
    const postJSON = JSON.stringify(post);
    const contentType = 'application/json';
    // add post hash to DDB
    Item = {
        PK: 'hash-' + hash,
        SK: 'post-' + createdAt + '-' + address,
        type: 'post',
        contentType,
        size: postJSON.length,
        uploadedAt: Date.now()
    }
    
    const ddbHash = putItem({Item});
    
    const s3Item = putS3({hash, data: postJSON, contentType});
    // add post to S3
    return Promise.all([ddbItem, ddbHash, s3Item]);
}
