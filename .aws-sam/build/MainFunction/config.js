exports.config = {
    bucket: 'kuku-staging',
    savePostFile: 'public/file_storage',
    region: "us-west-2",
    indexTableName: "signed-index",
    userTableName: "users",
    jwtSecret: "JWT_SECRET_ACCESS"
};
exports.configApi = {
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
    checkLogin: {
        method: 'post',
        path: 'register/checkLogin'
    },
};