exports.config = {
    bucket: 'kuku-staging',
    savePostFile: 'public/file_storage',
    saveImgFile: 'public/static/img',
    configFile: 'public/config.json',
    region: "us-west-2",
    indexTableName: "signed-index",
    userTableName: "users",
    jwtSecret: "JWT_SECRET_ACCESS",
    publicApiHost: "https://v6i481ta1m.execute-api.us-west-2.amazonaws.com/prod"
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
    getUserThirdStepLogin: {
        method: 'post',
        path: '/login/getUserToken'
    },
    getUser: {
        method: 'post',
        path: '/user'
    },
    getSubscribed: {
        method: 'get',
        path: '/subscribed'
    },
    fileUpload: {
        method: 'post',
        path: '/file/upload'
    },
};