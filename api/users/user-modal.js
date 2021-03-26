const db = require('../../data/dbConfig');

function findBy(filter) {
    return db('users').select('*').where(filter)
}

function findById(id) {
    return db('users').where({id}).first()
}

async function add(user) {
    const [id] = await db('users').insert(user, 'id')
    return findById(id)
}

module.exports = {
    findBy,
    add
}