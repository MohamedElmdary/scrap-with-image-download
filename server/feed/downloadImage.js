const axios = require('axios');
const { createWriteStream } = require('fs');
const { join } = require('path');
const createNotExistsDir = require('./createNotExistsDir');

async function downloadImage(url, name, type) {
    try {
        const { data } = await axios({
            method: 'GET',
            url,
            responseType: 'stream',
        });

        /* create data/images folder if not found */
        const dir = join(__dirname, '..', 'data');
        createNotExistsDir(dir);
        const images = join(dir, 'images');
        createNotExistsDir(images);
        const typePath = join(images, type);
        createNotExistsDir(typePath);

        /* save image to images folder */
        const path = join(typePath, `${name}.jpg`);
        const stream = createWriteStream(path);
        data.pipe(stream);

        return true;
    } catch {
        return false;
    }
}

module.exports = downloadImage;
