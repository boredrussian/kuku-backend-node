
const { config, prefixes } = require('../../../../config');
const { getIndex } = require('../../../../dataBase/index/get');
const { updateIndexDb } = require('../../../../dataBase/post/update');

const { getIndex_NonRelational } = require('../../../../dataBaseNonRelational/index/get');
const { updateIndexDb_NonRelational } = require('../../../../dataBaseNonRelational/index/update');

exports.updateIndex = async ({ post }) => {
  let currentIndex, currentIndex_NonRelational;

  try {
    currentIndex_NonRelational = await getIndex_NonRelational({ tableName: config.signedTableName, address: post.source.address, source_relation: prefixes.source });
    console.log('currentIndex_NonRelational', currentIndex_NonRelational);
  } catch (e) {
    console.warn("[updateIndex][currentIndex_NonRelational]", e);
  }

  try {
    await updateIndexDb_NonRelational({
      tableName: config.signedTableName,
      currentIndex: currentIndex_NonRelational,
      receivedPost: post, source_relation: prefixes.source
    });
  }
  catch (e) {
    console.warn('[updateIndex][updateIndexDb_NonRelational]', e);
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