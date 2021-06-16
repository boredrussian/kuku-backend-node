
const { config } = require('../../../../config');
const { getIndex } = require('../../../../dataBase/post/get');
const { putFirstDataPost } = require('../../../../dataBase/post/put');
const { updateIndexDb } = require('../../../../dataBase/post/update');


exports.updateIndex = async ({ post }) => {
  let currentIndex;
  try {
    currentIndex = await getIndex({ tableName: config.indexTableName, address: post.source.address });
  } catch (e) {
    console.warn("[updateIndex][getIndex]", e);
  }

  if (!currentIndex) {
    try {
      await putFirstDataPost({
        tableName: config.indexTableName,
        post
      });
    }
    catch (e) {
      console.warn('[updateIndex][putFirstData]', e);
    }

  } else {
    try {
      await updateIndexDb({ tableName: config.indexTableName, currentIndex, receivedPost: post });
    }
    catch (e) {
      console.warn('[updateIndex][updateIndexDb]', e);
    }
  }



};