const makeRequest = require('./makeRequest');
const downloadImage = require('./downloadImage');
const types = require('./types');

async function feed(type, categories) {
    const promises = [];
    for (const category of categories) {
        const req = makeRequest(type, category);
        promises.push(req);
    }
    const data = await Promise.all(promises);
    const items = data.map((v) => v.products.items).flat(Infinity);
    items.forEach(async ({ image: url, slug, id }) => {
        if (await downloadImage(url, `${slug}-${id}`, type)) {
            // should save data to sqlite her
        }
    });
}

for (const type of Object.keys(types)) {
    const categories = types[type];
    feed(type, categories);
}
