const stringify = require("fast-json-stable-stringify");
const parseJson = require("parse-json");

 
 

module.exports.getIndex = async ({
  tableName,
  address,
}) => {
  let index;
 
 

 
  return index;
};







exports.getIndex = async ({ address }) => {

  let currentIndex;
  try {
    currentIndex = await getIndex({ tableName: config.indexTableName, address: post.source.address });
    console.log('datadd', currentIndex)
  } catch (e) {
    console.warn("[updateIndex][getIndex]", e);
  }


};