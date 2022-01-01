exports.config = {
    bucket: 'kuku-staging',
    fileStorage: 'public/file_storage',
    сonfigFile: 'public/config.json',
    region: "us-west-2",
    signedTableName: "signed",
    inboxTableName: "inbox",
    indexTableName: "signed-index",
    userTableName: "users",
    jwtSecret: "JWT_SECRET_ACCESS",
    publicApiHost: "https://v6i481ta1m.execute-api.us-west-2.amazonaws.com/prod"
};


// it is statuses for inbox, use in dynamoDb
// inbox statuses new/rejected/accepted

exports.prefixes = {
    user: 'user',
    subscribed: 'subscribed',
    source: 'source',
    inboxPost: 'inboxpost',
    inbox: 'inbox',
    tag: 'tag',
    allSources: 'all-sources'
    };

exports.httpApi = {
    savePost: {
        method: 'post',
        path: '/post'
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
    userUpdate: {
        method: 'post',
        path: '/user/update'
    },
    userFollow: {
        method: 'post',
        path: '/user/follow'
    },
    fileUpload: {
        method: 'post',
        path: '/file/upload'
    },
    addInbox: {
        method: 'post',
        path: '/inbox'
    },
    updateInboxStatus: {
        method: 'post',
        path: '/inbox/update'
    },
    
    
    getSubscribed: {
        method: 'get',
        path: '/subscribed'
    },
    getInbox: {
        method: 'get',
        path: '/inbox'
    },
};