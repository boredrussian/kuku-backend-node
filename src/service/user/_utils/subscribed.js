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
        console.log('userData-----userData', usersData);
    } catch (e) {
        console.warn("[updateUserConfig]", e);
    }


    if (!Array.isArray(usersData) || usersData === []) {
        const currentUserData = {
            address: currentUserData.address,
            subscribed: []
        }
        usersData = [currentUserData]
    } else if (Array.isArray(usersData)) {
        usersData.map(data => data.subscribed.push({ url: `${config.publicApiHost}/${currentUserData.address}` }));
    }
    usersData.push(currentUserData)
    return usersData;
}


const addNewUserToConfig = async ({ address }) => {
    let subscribed, currentUserData, newConfig;
    try {
        subscribed = await getSubscribed({});
        currentUserData = {
            address: address,
            subscribed: subscribed
        };

        console.log('https://localhost:3000/----------subscribed', subscribed)
        console.log('https://localhost:3000/----------currentUserData', currentUserData)
    } catch (e) {
        console.warn("[_utils][subscribed][addNewUserToConfig]", e);
    }
    try {
        newConfig = await updateUserConfig({ currentUserData });
        console.log('newConfig[updateUserConfig]', newConfig);
    } catch (e) {
        console.warn("[_utils][subscribed][addNewUserToConfig]", e);
    }


    console.log('newConfig---newConfig---newConfig---newConfig', newConfig);

    try {
        await putObjectS3({
            bucket: config.bucket,
            key: config.configFile,
            data: stringify(newConfig),
            // data: stringify([]),
            type: "application/json",
        });
    } catch (e) {
        console.warn("[_utils][subscribed][putObjectS3]", e);
    }
    return subscribed;
};


module.exports = { getSubscribed, addNewUserToConfig };