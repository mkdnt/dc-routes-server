const dcAreaService = {
    getById(knex, id) {
        return knex.from('dc_area').select('*').where('id', id).first()
    },
}

module.exports = dcAreaService