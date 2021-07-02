const { config } = require("../../../config");
const { bodyEncrypted } = require('../../../lib/crypto');

const Busboy = require('busboy');
const path = require('path');
const fs = require('fs');
const CryptoJS = require('crypto-js');
const bs58 = require('bs58')
const fsp = require("fs/promises");
const { nanoid } = require("nanoid");
const mime = require("mime");
const { putObjectS3 } = require("../../../lib/s3");
const stringify = require('fast-json-stable-stringify');

const getHash = ({ data }) => {
    const postJson = "string";
    let resHash;
    try {
        const hash = CryptoJS.SHA256(postJson);
        const hashString = hash.toString(CryptoJS.enc.Hex);
        const bytes = Buffer.from(hashString, "hex");
        resHash = bs58.encode(bytes);
    } catch (e) {
        console.error("[savePost][getHash]", e);
    }
    return resHash;
};


const fileUpload = ({ event }) => {


    return new Promise((resolve, reject) => {

        let response = {
            'statusCode': 404,
            'body': 'User not found!'
        };

        let hashFileName;
        const sha256 = CryptoJS.algo.SHA256.create();
        const busboy = new Busboy({
            headers: {
                ...event.headers,
                "content-type":
                    event.headers["Content-Type"] || event.headers["content-type"],
            },
        });

        const result = {
            files: [],
        };

        busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
            file.on("data", (data) => {
                sha256.update(data.toString("base64"));
                result.files.push({
                    file: data,
                    fileName: filename,
                    contentType: mimetype,
                });
            });
        });
        busboy.on("field", (fieldname, value) => {
            try {
                result[fieldname] = JSON.parse(value);
            } catch (err) {
                result[fieldname] = value;
            }
        });
        busboy.on("error", (error) => reject(`Parse error: ${error}`));
        busboy.on("finish", async () => {
            const hashFin = sha256.finalize();
            const hashString = hashFin.toString(CryptoJS.enc.Hex);
            const bytes = Buffer.from(hashString, "hex");
            const hash_58 = bs58.encode(bytes);
            const fileExtension = mime.getExtension(result.files[0].contentType);
            hashFileName = `${hash_58}.${fileExtension}`;
            const saveToPath = `${config.saveImgPathS3}/${hashFileName}`;

            response = {
                statusCode: 200,
                body: stringify({ hash: hash_58, type: result.files[0].contentType })
            }
            try {

                await putObjectS3({
                    bucket: config.bucket,
                    key: saveToPath,
                    data: result.files[0].file,
                    type: result.files[0].contentType,
                });
            } catch (e) {
                console.warn("putObject-error", e);
            }

            event.body = result;

            resolve(response);
        });
        busboy.write(event.body, event.isBase64Encoded ? "base64" : "binary");
        busboy.end();
    });



};


module.exports = {
    fileUpload
};






