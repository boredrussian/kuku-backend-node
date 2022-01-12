const { getItems, getItem } = require('./db');

module.exports.getPosts = async ({ event }) => {
    // DB:
    //    posts-from-[address] / post-[createdAt]-[address] - postJSON, replies count, likes count, reposts count
    //     - GET /posts?createdBefore=?&createdAfter=? for a particular timestamp range (createdAt)
    //   - of several source addresses: &address=<comma-separated list of addresses>
    //   - OR with a particular tag: &tag=<tag>
    //   - OR replies to a specific post hash: &replyTo=<hash>
    let posts = [];
    let params = {};
    if('createdBefore' in event) params.toSK = 'post-' + event.createdBefore;
    if('createdAfter' in event) params.fromSK = 'post-' + event.createdAfter;
    if('address' in event) {
        const addresses = event.address.split(',');
        const postArrays = (await Promise.allSettled(addresses.map(
            address => getItems({...params,  PK: "posts-from-" + address })))
        ).map(src => src.value);
        postArrays.forEach(arr => {posts.push(...arr)});
    }
    return posts;
};

getDefaultAddresses = async() => {
    return ['1EQBTachaCgQtBR1dJodJEEgD5mKAyUrEv'];
}

module.exports.getSources = async ({ event }) => {
    const addresses = 'address' in event ? event.address.split(',') : await getDefaultAddresses();
        
    const sources = (
        await Promise.allSettled(addresses.map(address => getItem({ PK: "all-sources", SK: "source-" + address })))
    ).map(src => src.value);
    return sources.filter(i => i); 
};
