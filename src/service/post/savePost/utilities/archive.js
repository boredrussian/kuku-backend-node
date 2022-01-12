const stringify = require('fast-json-stable-stringify');
const parseJson = require("parse-json");
const { getHash } = require("../../../../lib/crypto");
const { putFile } = require('./putFile');
const { config, prefixes } = require('../../../../config');
const { updateIndexArchive } = require('../../../../dataBaseNonRelational/index/update');





const isAddArchiveIndex = ({currentIndex}) => {
 let isMovePostToArchive = false; 
 const indexJson = currentIndex?.indexJson;
 const indexObject = parseJson(indexJson);
 const recentPostArray = indexObject.recentPosts;
 
   
 const postsAmount = Array.isArray(recentPostArray) ? recentPostArray.length : 0;
 const bitesAmount =  new TextEncoder().encode(indexJson).length;
 const kiloBytesAmount = Math.ceil(bitesAmount/1024);
 
 console.log('[file - archive]keepPostTest', postsAmount);
 console.log('[]bitesAmount', kiloBytesAmount);
 
 // const bitesAmount = encodeURI(indexJson).split(/%(?:u[0-9A-F]{2})?[0-9A-F]{2}|./).length - 1;
 // const = size Buffer.byteLength(string, 'utf8')
//  change to 100!!!
 if(postsAmount.length > 100 || kiloBytesAmount > 100 ){
     isMovePostToArchive = true;
 }
  
 return isMovePostToArchive;
}


 


const getPostsLeftAndSend = ({recentPostArray}) => {
  let stopRecursionIndex = 50;       
  
  
  let keepPostInDataBase = recentPostArray.slice(-51);
  // let keepPostInDataBase = recentPostArray.slice(0, 51);
  
  let moveToS3Posts = recentPostArray.filter( post => !keepPostInDataBase.includes(post));
  
  const getKeepedPost = ({postsArr, stopRecursionIndex}) => {
  // const postMoveToSaveInS3 = postsArr.pop();
  const postMoveToSaveInS3 = postsArr.shift();
  // moveToS3Posts.unshift(postMoveToSaveInS3);
  moveToS3Posts.push(postMoveToSaveInS3);
    
  while(new TextEncoder().encode(JSON.stringify(postsArr)).length > 100 && stopRecursionIndex > 0){
                getKeepedPost({postsArr, stopRecursionIndex: --stopRecursionIndex});
  }
            
  return postsArr;
  }
         
  const keepPostTest = getKeepedPost({postsArr: keepPostInDataBase});
  const keepPostInDataBaseData = recentPostArray.filter( post => !moveToS3Posts.includes(post));
 
  console.log('keepPostTest', keepPostTest.length);
  console.log('keepPostInDataBaseData', keepPostInDataBaseData.length)
   
   return  {
       moveToS3Posts,
       keepPostInDataBase: keepPostInDataBaseData
     } 
    
}


//  getKeepedPost({postsArr.slice(1, postsArr.length - 1)});
            
const getArchiveObjectData = ({moveToS3Posts}) => {
 
    return {
        startDate: moveToS3Posts[0].updatedAt,
        endDate: moveToS3Posts[moveToS3Posts.length - 1].updatedAt,
        hash: getHash({objectData:moveToS3Posts }),
        posts: moveToS3Posts
    }
}        
            
            

const updateArchiveInIndex = async ({currentIndex, post, indexAddress}) => {
let archivedPosts, keepedPosts;
const indexJson = currentIndex?.indexJson;
const indexObject = parseJson(indexJson);
const recentPostArray = indexObject.recentPosts;
 
 
 console.log('[1]recentPostArray[Array exist resently]', recentPostArray.length);
 
 recentPostArray.push(post);
 const { moveToS3Posts, keepPostInDataBase} = getPostsLeftAndSend({recentPostArray});
  
 console.warn('[2-a][file: archive][funcion call putFile]', moveToS3Posts.length);
 console.warn('[2-b][file: archive][funcion call putFile]', keepPostInDataBase.length);
 
  const archiveData = getArchiveObjectData({moveToS3Posts});
  console.log('[file Archive.js][func updateIndexArchive]archiveData', archiveData.hash);
   
  try{ 
    await putFile({ data: archiveData , hash: archiveData.hash });
  } catch (e) {
     console.warn('[file: archive][funcion call putFile]', e);
  }
  
      indexObject.recentPosts = keepPostInDataBase,
      indexObject.archives.push(archiveData)
    
      console.log(indexObject);
    
      delete archiveData.posts;
      try {
      const isUpdated  = await updateIndexArchive({
      tableName: config.signedTableName,
      address: indexAddress,
      indexObject,
      currentIndex,
      sourceRelation: prefixes.source,
      allSourcesReletion: prefixes.allSources
    });
   
    }
    
    catch (e) {
     console.warn('[file: archive][funcion call putFile]', e)
  }
    
    
    
   
}

module.exports = {
    isAddArchiveIndex,
    updateArchiveInIndex
}