// const ArticlesService = {
//   getAllArticles(db) {
//     return db
//       .select('*')
//       .from('blogful_articles');
//   },
//   insertArticle(db, newArticle) {
//     return db
//       .insert(newArticle)
//       .into('blogful_articles')
//       .returning('*')
//       .then(rows => {
//         return rows[0];
//       });
//   },
//   getById(db, id) {
//     return db
//       .select('*')
//       .from('blogful_articles')
//       .where({ id: id })
//       .first();
//   },
//   deleteArticle(db, id) {
//     return db
//       .from('blogful_articles')
//       .where({ id })
//       .delete();
//   },
//   updateArticle(db, id, newData) {
//     return db
//       .from('blogful_articles')
//       .where({ id })
//       .update(newData);
//   }
// };

// module.exports = ArticlesService;

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