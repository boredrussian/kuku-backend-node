import * as fs from "fs";
import stringify from "fast-json-stable-stringify";
import parseJson from "parse-json";
import path from "path";
import fsp from "fs/promises";
import AWS from "aws-sdk";

const s3 = new AWS.S3();

/** other way to upload file on s3
 *  s3.upload(params, function (err: any, data: any) {
*   if (err) {
*     throw err;
*   }
*   console.log(`File uploaded successfully. ${data.Location}`);
 });
  */

interface TypePut {
  bucket?: string;
  key: string;
  data: any;
  type: string;
}

/* Key: `public/file_storage/${folders.first}/${folders.second}/${hash}.json`,
ContentType: "application/json", */

export const putObjectS3 = ({
  bucket = process.env.AWS_BASKET || "",
  key,
  data,
  type,
}: TypePut) => {
  const params = {
    Bucket: bucket,
    Key: key,
    Body: data,
    ContentType: type,
  };

  s3.putObject(params, function (err, data) {
    if (err) {
      console.log(err);
    } else {
      console.log("Successfully uploaded data to myBucket/myKey", data);
    }
  });
};
