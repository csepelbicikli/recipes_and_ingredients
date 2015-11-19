module.exports = {
    identity: 'ingredient',
    connection: 'default',
    attributes: {
        content: {
            type: 'string',
            required: true,
        },
        recipe: {
            model: 'recipe',
        },
    }
}