
const { config, prefixes } = require('../../../../config');
const { getTagIndex } = require('../../../../dataBaseNonRelational/tag/get');
const { updateTagIndex } = require('../../../../dataBaseNonRelational/tag/update');
const { putTagIndex } = require('../../../../dataBaseNonRelational/tag/put');
const stringify = require('fast-json-stable-stringify');
const parseJson = require("parse-json");


exports.updateTagIndex = async ({ post }) => {
if(!Array.isArray(post.tags)){
    return 
}
let currentIndex, currentTagsArr, preparedTagsArr;
// const tagArr = ['jjj', 'fdafsdf'];

const tagArr = post.tags;
let tagSet = [...tagArr];

try{
      currentTagsArr = await Promise.allSettled(
        tagArr.map(async (tag) => {
          return  await getTagIndex({
                    tableName: config.signedTableName,
                    tag: tag,
                    tagRelation: prefixes.tag,
                 });
        })
    );
 
   preparedTagsArr = currentTagsArr.map(val => {
    
    if(val.value){
     const tagExist = val.value.PK.slice(`${prefixes.tag}-`.length);
     tagSet = tagSet.filter(item => item !== tagExist);
     return {
         tag: tagExist,
         index: parseJson(val.value.indexJson),
         version: val.value.version};
    }
    else {
     const tagAbsent = tagSet[0];
     tagSet = tagSet.filter(item => item !== tagAbsent);
        return {
       tag: tagAbsent, 
       index: '',
       version: 0
     }
    }
   })
 
}catch(e){
   console.warn('[updateIndex][updateIndexDb_NonRelational]', e);
}

try {
       await Promise.allSettled(
        preparedTagsArr.map(async (tagData) => {
             if(tagData.index){
                await updateTagIndex({
                    tableName: config.signedTableName,
                    tag: tagData.tag,
                    currentTagIndex: tagData.index,
                    tagRelation: prefixes.tag,
                    currentVersion: tagData.version,
                    post
                   })
            }
            else {
                await putTagIndex({
                    tableName: config.signedTableName,
                    tag: tagData.tag,
                    tagRelation: prefixes.tag,
                    indexJson: stringify([post]),
                    version: tagData.version
                })
            }
       })
    );
    
 
 }
  catch (e) {
    console.warn('[updateIndex][updateIndexDb_NonRelational]', e);
  }


};


