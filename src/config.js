exports.config = {
    bucket: 'kuku-staging',
    savePostFile: 'public/file_storage',
    region: "us-west-2",
    indexTableName: "signed-index",
    userTableName: "user"
}
exports.configApi = {
    savePost: {
        method: 'post',
        path: '/post'
    },
    getIndex: {
        method: 'get',
        path: '/book'
    },

}