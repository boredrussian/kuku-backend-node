const stringify = require('fast-json-stable-stringify');
// const { config } = require("/opt/nodejs/config");
const { config } = require("../../../../config");
const { putObjectS3 } = require("../../../../lib/s3");
const { getFoldersName } = require("../../_utils");
 


exports.putFile = async ({ data, hash }) => {
    
    const folders = getFoldersName(hash);
    const saveToPath = `${config.fileStorage}/${folders.first}/${folders.second}/${folders.fileName}.json`;
  
 try {
            await putObjectS3({
            bucket: config.bucket,
            key: saveToPath,
            data: stringify(data),
            type: "application/json",
        });
        
        console.log('folders', folders);
        console.log('saveToPath', saveToPath);
 } catch (e) {
        console.warn("putObject-error", e);
    }
    
};