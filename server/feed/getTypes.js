const { gql, request } = require('graphql-request');

const query = gql`
    query {
        categories(type: "grocery") {
            title
            slug
            children {
                title
                slug
            }
        }
    }
`;

const mainTypes = [
    'grocery',
    'makeup',
    'bags',
    'clothing',
    'furniture',
    'book',
    'medicine',
];

async function getTypes() {
    const types = {};

    for await (const type of mainTypes) {
        // prettier-ignore
        const { categories } = await request('https://pickbazar-api.now.sh/shop/graphql', 
            query, 
            { type },
        );

        types[type] = categories
            .map((category) => {
                if (category.children && category.children.length) {
                    return category.children.map((child) => child.slug);
                }
                return category.slug;
            })
            .flat(Infinity);
    }

    return types;
}

module.exports = getTypes;
