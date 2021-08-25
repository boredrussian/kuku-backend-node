
const { config, prefixes } = require('../../../../config');
const { getIndex_NonRelational } = require('../../../../dataBaseNonRelational/index/get');
const { updateIndexDb_NonRelational } = require('../../../../dataBaseNonRelational/index/update');

exports.updateIndex = async ({ post, indexAddress }) => {
  let currentIndex_NonRelational;

  try {
    currentIndex_NonRelational = await getIndex_NonRelational({ tableName: config.signedTableName, address: indexAddress, sourceRelation: prefixes.source });
    } catch (e) {
    console.warn("[updateIndex][currentIndex_NonRelational]", e);
  }

  try {
    await updateIndexDb_NonRelational({
      tableName: config.signedTableName,
      currentIndex: currentIndex_NonRelational,
      receivedPost: post,
      address: indexAddress, 
      sourceRelation: prefixes.source
    });
  }
  catch (e) {
    console.warn('[updateIndex][updateIndexDb_NonRelational]', e);
  }


};


