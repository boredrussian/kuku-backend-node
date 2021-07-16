const getFoldersName = (hash) => {
    return {
        first: hash.slice(0, 2),
        second: hash.slice(2, 4),
        fileName: hash.slice(4),
    };
};
 

module.exports = {
    getFoldersName
}

 