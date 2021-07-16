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

const generateSubscribed = ({addresses}) => {
    
    if(!Array.isArray(addresses)){
        return [];
    }
    
   const subscribed = addresses.map(adr => {
        return {
            address: adr,
            url: `${config.publicApiHost}/${adr}`
        };
    })
    
    return subscribed;
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
    } else {
        const addresses = getAddresses({ users: usersData });
        subscribedList = addresses.map(adr => {
            return ({
                url: `${config.publicApiHost}/${adr}`,
            });
        });
    }
    return subscribedList;
};


const updateUserConfig = async ({ currentUserData }) => {
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
        usersData = [currentUserData];
        
    }   usersData.push(currentUserData)
    
    return usersData;
}


const addNewUserToConfig = async ({ address }) => {
    let subscribed;
    // try {
    //     subscribed = await getSubscribed({});
       
    // } catch (e) {
    //     console.warn("[_utils][subscribed][addNewUserToConfig]", e);
    // }
    
    const currentUserData = {
            address: address,
            url: `${config.publicApiHost}/${address}`
        };
        
        console.log('currentUserData', currentUserData)
    try {
        subscribed = await updateUserConfig({ currentUserData });
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


module.exports = { getSubscribed, addNewUserToConfig, getAddresses, generateSubscribed };