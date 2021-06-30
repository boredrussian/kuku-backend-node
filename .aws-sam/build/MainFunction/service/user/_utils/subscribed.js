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

const getSubscribed = async () => {
    let usersData, subscribedList;

    try {
        const usersConfigJson = await getObject({
            bucket: config.bucket,
            key: config.configFile,
        });
        usersData = parseJson(usersConfigJson);
    } catch (e) {
        console.warn("putObject-error", e);
    }

    const addresses = getAddresses({ users: usersData });
    if (!Array.isArray(addresses)) {
        return [];
    }
    subscribedList = addresses.map(adr => {
        return ({
            url: `${config.publicApiHost}/${adr}`
        });
    });

    return subscribedList;
};


const updateUserConfig = async ({ address }) => {
    let subscribed;
    let usersConfig = [];
    try {
        const usersConfigJson = await getObject({
            bucket: config.bucket,
            key: config.configFile,
        });
        usersConfig = parseJson(usersConfigJson);
        subscribed = await getSubscribed({ usersConfig });
        const userConfigData = {
            address: address,
            subscribed: subscribed
        };
        usersConfig.push(userConfigData);
    } catch (e) {
        console.warn("[_utils][subscribed][getObject]", e);
    }
    try {
        await putObjectS3({
            bucket: config.bucket,
            key: config.configFile,
            data: stringify(usersConfig),
            type: "application/json",
        });
    } catch (e) {
        console.warn("[_utils][subscribed][putObjectS3]", e);
    }
    return subscribed;
};


module.exports = { getSubscribed, updateUserConfig };