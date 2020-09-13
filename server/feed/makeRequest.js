const query = require('./query');
const { request } = require('graphql-request');

function makeRequest(type, category) {
    return request('https://pickbazar-api.now.sh/shop/graphql', query, {
        type,
        category,
        offset: 0,
        limit: 20,
    });
}

module.exports = makeRequest;
