const parseJson = require("parse-json");
const { config } = require("../../../config");
const stringify = require('fast-json-stable-stringify');
const { putObjectS3, getObject } = require("../../../lib/s3");

const getAddresses = ({ users }) => {
    let addresses;

    if (Array.isArray(users)) {
        addresses = users.map(srcString => {
            return srcString.address;
        });
    }
    return addresses;
};

const getUserSourcesArr = ({ users }) => {
    let sources;

    if (Array.isArray(users)) {
        sources = users.map(user => {
            return user.source;
        });
    }
    return sources;
};

const generateSubscribed = ({ usersList }) => {
    if (!Array.isArray(usersList)) {
        return [];
    }

    console.warn('[subscribed][generateSubscribed][usersList - signature]', usersList);
    const newUsers = usersList.map(user => {
        
        return {
            address: user.address,
            source: user.source,
            url: `${config.publicApiHost}/${user.address}`
        }
    });
    return newUsers;
}


 



const getSubscribed = async ({ userAddress = '' }) => {
    let usersData, subscribedList;

    try {
        const usersConfigJson = await getObject({
            bucket: config.bucket,
            key: config.configFile,
        });
        usersData = parseJson(usersConfigJson);
    } catch (e) {
        console.warn("[subscribed][getSubscribed]", e);
    }

    if (!Array.isArray(usersData)) {
        return [];
    }
    
    if (userAddress) {
      
        const currentUserData = usersData.find(data => data.address === userAddress);
        subscribedList = currentUserData.subscribed;
    } 
    
    return usersData;
};



const updateUserConfig = async ({ userSource }) => {
    let usersData = [], subscribedList;
    try {
        const usersConfigJson = await getObject({
            bucket: config.bucket,
            key: config.configFile,
        });
        usersData = parseJson(usersConfigJson);
    } catch (e) {
        console.warn("[updateUserConfig]", e);
    }

    if (!Array.isArray(usersData) || usersData === []) {
        usersData = [userSource];

    } usersData.push(userSource)

    return usersData;
}


const addNewUserToConfig = async ({ source }) => {
    let subscribed;

    // const currentUserSource = {
    //     address: source.address,
    //     source: source,
    //     url: `${config.publicApiHost}/${source.address}`,
    // };


    try {
        subscribed = await updateUserConfig({ userSource: source });
        console.log('newConfig[updateUserConfig]', subscribed);
    } catch (e) {
        console.warn("[_utils][subscribed][addNewUserToConfig]", e);
    }

    try {
        await putObjectS3({
            bucket: config.bucket,
            key: config.configFile,
            data: stringify(subscribed),
            // data: stringify([]),
            type: "application/json",
        });
    } catch (e) {
        console.warn("[_utils][subscribed][putObjectS3]", e);
    }
    return subscribed;
};

const updateUserSourceInConfig = async ({ source }) => {
    let subscribed, usersData;

    try {
        const usersConfigJson = await getObject({
            bucket: config.bucket,
            key: config.configFile,
        });
        usersData = parseJson(usersConfigJson);

    } catch (e) {
        console.warn("[subscribed][getSubscribed]", e);
    }


    const newUsersData = usersData.map(user => {
        if (user.source.address === source.address) {
            user.source = source
        }
        return user
    });


    try {
        await putObjectS3({
            bucket: config.bucket,
            key: config.configFile,
            data: stringify(newUsersData),
            type: "application/json",
        });
    } catch (e) {
        console.warn("[_utils][subscribed][putObjectS3]", e);
    }

    return subscribed;
};


const getSubscribedFromIndex = (userList) => {
    if(!Array.isArray(userList)){
        return [];
    }
  return userList.map(user => parseJson(user.sourceJson));
}



module.exports = {
    getSubscribed, addNewUserToConfig,
    getAddresses, generateSubscribed,
    getUserSourcesArr, updateUserSourceInConfig, getSubscribedFromIndex
};