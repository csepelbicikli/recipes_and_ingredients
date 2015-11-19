module.exports = {
    identity: 'recipe',
    connection: 'default',
    attributes: {
        date: {
            type: 'datetime',
            defaultsTo: function () { return new Date(); },
            required: true,
        },
        status: {
            type: 'string',
            enum: ['uj', 'modositva', 'elfogadott', 'elutasitott', 'dijazott'],
            required: true,
        },
        name: {
            type: 'string',
            required: true,
        },
        description: {
            type: 'string',
            required: true,
        },
        
        user: {
            model: 'user',
        },
    }
}