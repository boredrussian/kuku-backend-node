
const { config, prefixes } = require('../../../../config');
const { getIndex } = require('../../../../dataBase/index/get');
const { updateIndexDb } = require('../../../../dataBase/post/update');

const { getIndex_NonReletional } = require('../../../../dataBaseNonReletional/index/get');
const { updateIndexDb_NonReletional } = require('../../../../dataBaseNonReletional/index/update');

exports.updateIndex = async ({ post }) => {
  let currentIndex, currentIndex_NonReletional;

  try {
    currentIndex_NonReletional = await getIndex_NonReletional({ tableName: config.signedTableName, address: post.source.address, source_relation: prefixes.source  });
    console.log('currentIndex_NonReletional', currentIndex_NonReletional);
  } catch (e) {
    console.warn("[updateIndex][currentIndex_NonReletional]", e);
  }

  try {
      await updateIndexDb_NonReletional({ tableName: config.signedTableName,
      currentIndex: currentIndex_NonReletional,
      receivedPost: post, source_relation: prefixes.source  });
  }
    catch (e) {
      console.warn('[updateIndex][updateIndexDb_NonReletional]', e);
  }
  
    
  try {
    currentIndex = await getIndex({ tableName: config.indexTableName, address: post.source.address });
  
  } catch (e) {
    console.warn("[updateIndex][getIndex]", e);
  }
    
    
  try {
      await updateIndexDb({ tableName: config.indexTableName, currentIndex, receivedPost: post });
  }
  catch (e) {
      console.warn('[updateIndex][updateIndexDb]', e);
  }
 
};