const db = require('./dbConnection');

db('Product')
    .select('*')
    .then((data) => {
        console.log(data);
    });

// console.log('Init Commit');
