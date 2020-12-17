const RoutesService = {
    getAllRoutes(knex) {
        return knex.select('*').from('routes')
    },
    
    insertRoute(knex, newRoute) {
        return knex
            .insert(newRoute)
            .into('routes')
            .returning('*')
            .then (rows => {
                return rows[0]
            })
    },

    getById(knex, id) {
        return knex.from('routes').select('*').where('id', id).first()
    },

    getByDcArea(knex, dc_area) {
        return knex.from('routes').select('*').where('dc_area', dc_area)
    },

    deleteRoute(knex, id) {
        return knex('routes')
            .where({id})
            .delete()
    },

    updateRoute(knex, id, newRouteFields) {
        return knex('routes')
            .where({id})
            .update(newRouteFields)
    }
}

module.exports = RoutesService