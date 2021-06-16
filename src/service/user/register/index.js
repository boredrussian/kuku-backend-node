const { makeToken } = require("../../../lib/jwt");
const parseJson = require("parse-json");
const { config } = require("../../../config");
/* import {
    createTable,
    putData,
    isFreeLogin,
    //   deleteTable,
} from "../../../dataBase/user/userDb"; */
// import { access } from "node:fs";





module.exports.register = async ({ event }) => {

    let body, response, post, addToIndex, isValid = true;

    try {
        const body = parseJson(event.body);
        ({ address, encryptedWif, login, salt, verifier } = body);
    } catch (e) {
        console.warn('[savePost][parseJson]', e)
    }
    //   TODO: add validation

    const accessToken = makeToken({ type: "access" });

    console.log('accessToken', accessToken);
    console.log('body', body);

    try {
        /*     await putData({
                tableName: config.userTableName,
                address: address,
                encryptedWif: encryptedWif,
                salt: salt,
                privateKey: data.privateKey,
                verifier: data.verifier,
                login: data.login,
                accessToken,
            }); */

        /*        const resData = {
                   accessToken,
                   address: data.address,
                   name: data.login,
                   wif: data.wif,
               }; */

        // res.send(resData);
    } catch (e) {
        console.warn("[register]", e);
    }
};