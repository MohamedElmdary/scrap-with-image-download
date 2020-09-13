const createNotExistsDir = require('./createNotExistsDir');
const { join } = require('path');
const makeRequest = require('./makeRequest');
const downloadImage = require('./downloadImage');
const getTypes = require('./getTypes');
const knex = require('../dbConnection');

async function feed(type, categories) {
    const promises = [];
    for (const category of categories) {
        const req = makeRequest(type, category);
        promises.push(req);
    }
    const data = await Promise.all(promises);
    data.forEach(({ products: { items } }, i) => {
        const category = categories[i];
        items.forEach(async (item) => {
            const {
                id,
                title,
                unit,
                slug,
                price,
                salePrice,
                description,
                discountInPercent,
                image,
                gallery,
            } = item;
            console.log('... from category `' + category + '`');
            const path = await downloadImage(image, `${slug}-${id}`, type);
            if (path) {
                await knex('Product').insert({
                    id,
                    title,
                    unit,
                    price,
                    salePrice,
                    description,
                    discountInPercent,
                    image: path,
                    gallery: JSON.stringify(gallery.map((v) => v.url)),
                    category,
                });
            }
        });
    });
}

(async () => {
    if (!createNotExistsDir(join(__dirname, '..', 'data'))) {
        return;
    }

    console.log('creating database.');
    // prettier-ignore
    await knex
        .schema
        .createTable('Product', (table) => {
            table.integer('id');
            table.string('title');
            table.string('unit');
            table.double('price');
            table.double('salePrice');
            table.string('description');
            table.double('discountInPercent');
            table.string('image');
            table.string('gallery');
            table.string('category');
            table.string('type');
        });

    console.log('getting types.');
    const types = await getTypes();

    console.log('getting data.');
    for (const type of Object.keys(types)) {
        const categories = types[type];
        feed(type, categories);
    }
})();
