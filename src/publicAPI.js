const { getItems, getItem } = require('./db');

module.exports.getPosts = async ({ address, createdBefore, createdAfter }) => {
    // DB:
    //    posts-from-[address] / post-[createdAt]-[address] - postJSON, replies count, likes count, reposts count
    //     - GET /posts?createdBefore=?&createdAfter=? for a particular timestamp range (createdAt)
    //   - of several source addresses: &address=<comma-separated list of addresses>
    //   - OR with a particular tag: &tag=<tag>
    //   - OR replies to a specific post hash: &replyTo=<hash>
    let posts = [];
    let params = {};
    if(createdBefore) params.toSK = 'post-' + createdBefore;
    if(createdAfter) params.fromSK = 'post-' + createdAfter;
    if(address) {
        const addresses = address.split(',');
        const postArrays = (await Promise.allSettled(addresses.map(
            address => getItems({...params,  PK: "posts-from-" + address })))
        ).map(a => a.value);
        postArrays.forEach(arr => {posts.push(...arr)});
        posts = posts.map(p => { return {post: p.post, postStats: p.postStats}});
    }
    return posts;
};

const getDefaultAddresses = async() => {
    return ['1EQBTachaCgQtBR1dJodJEEgD5mKAyUrEv'];
}

module.exports.getSources = async ({ event }) => {
    const addresses = 'address' in event ? event.address.split(',') : await getDefaultAddresses();
        
    const sources = (
        await Promise.allSettled(addresses.map(address => getItem({ PK: "all-sources", SK: "source-" + address })))
    ).map(src => src.value);
    return sources.filter(i => i); 
};
