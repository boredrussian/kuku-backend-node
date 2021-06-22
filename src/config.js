exports.config = {
    bucket: 'kuku-staging',
    savePostFile: 'public/file_storage',
    region: "us-west-2",
    indexTableName: "signed-index",
    userTableName: "users",
    jwtSecret: "JWT_SECRET_ACCESS"
};
exports.httpApi = {
    savePost: {
        method: 'post',
        path: '/post'
    },
    getIndex: {
        method: 'get',
        path: '/book'
    },
    register: {
        method: 'post',
        path: '/register'
    },
    registerCheckLogin: {
        method: 'post',
        path: '/register/checkLogin'
    },
    exchangeEphemeralKeysFirstStepLogin: {
        method: 'post',
        path: '/login/exchangeEphemeralKeys'
    },
    validateSessionProofsSecondStepLogin: {
        method: 'post',
        path: '/login/validateSessionProofs'
    },
    GetUserThirdStepLogin: {
        method: 'post',
        path: '/login/getUserToken'
    },
    GetUser: {
        method: 'post',
        path: '/user'
    },
};