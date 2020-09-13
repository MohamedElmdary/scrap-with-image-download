const { existsSync, mkdirSync } = require('fs');

function createNotExistsDir(path) {
    if (!existsSync(path)) {
        mkdirSync(path);
        return true;
    }
    return false;
}

module.exports = createNotExistsDir;
