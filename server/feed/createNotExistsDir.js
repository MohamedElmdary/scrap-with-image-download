const { existsSync, mkdirSync } = require('fs');

function createNotExistsDir(path) {
    if (!existsSync(path)) {
        mkdirSync(path);
    }
}

module.exports = createNotExistsDir;
