
const { config, prefixes } = require('../../../../config');
const { getIndex_NonRelational } = require('../../../../dataBaseNonRelational/index/get');
const { updateIndexDb_NonRelational } = require('../../../../dataBaseNonRelational/index/update');
const { isAddArchiveIndex, updateArchiveInIndex } = require('./archive');


exports.updateIndex = async ({ post, indexAddress }) => {
    let currentIndex_NonRelational, isUpdated;
    try {
        currentIndex_NonRelational = await getIndex_NonRelational({
            tableName: config.signedTableName,
            address: indexAddress,
            sourceRelation: prefixes.source,
            allSourcesReletion: prefixes.allSources
        });
    } catch (e) {
        console.warn("[updateIndex][currentIndex_NonRelational]", e);
    }



    if (isAddArchiveIndex({ currentIndex: currentIndex_NonRelational })) {
        try {
            isUpdated = await updateArchiveInIndex({
                currentIndex: currentIndex_NonRelational,
                indexAddress,
                post
            });
        }
        catch (e) {
            console.warn('[updateIndex][updateIndexArchive]', e);
        }
    }
    else {
        try {
            isUpdated = await updateIndexDb_NonRelational({
                tableName: config.signedTableName,
                currentIndex: currentIndex_NonRelational,
                receivedPost: post,
                address: indexAddress,
                sourceRelation: prefixes.source,
                allSourcesReletion: prefixes.allSources
            });

        }
        catch (e) {
            console.warn('[updateIndex][updateIndexDb_NonRelational]', e);
        }
    }

    console.log('[File: updateIndex][Pleace: return isUpdated;]', isUpdated);
    return isUpdated;


};


