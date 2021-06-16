
module.exports.isUniqLogin = async (
) => {
    const data = req.body;
    const isLoginExist = await isFreeLogin({ login: data.login, next });
    res.send({ isFreeLogin: isLoginExist });
};