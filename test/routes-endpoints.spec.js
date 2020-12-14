const { expect } = require('chai')
const knex = require('knex')
const supertest = require('supertest')
const app = require('../src/app')
const { makeRoutesArray } = require('./routes.fixtures')

describe.only('Routes Endpoints', function() {
    let db

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL,
        })
        app.set('db', db)
    })

    after('disconnect from db', () => db.destroy())

    before('clean the table', () => db('routes').truncate())

    afterEach('cleanup', () => db('routes').truncate())

    describe(`GET /routes`, () => {
        context(`Given no routes`, () => {
            it(`responds with 200 and an empty list`, () => {
                return supertest(app)
                    .get('/route')
                    .expect(200, [])
            })
        })

        context('Given there are routes in the database', () => {
            const testRoutes = makeRoutesArray()

            beforeEach('insert routes', () => {
                return db
                    .into('routes')
                    .insert(testRoutes)
            })

            it('responds with 200 and with all of the routes', () => {
                return supertest(app)
                    .get('/route')
                    .expect(200, testRoutes)
            })
        })
    })

    describe(`GET /route/:route_id`, () => {
        context(`Given no routes`, () => {
            it(`responds with 404`, () => {
                const routeId = 123456
                return supertest(app)
                    .get(`/route/${routeId}`)
                    .expect(404, {error: {message: `Route doesn't exist`} })
            })
        })

        context('Given there are routes in the database', () => {
            const testRoutes = makeRoutesArray()

            beforeEach('insert routes', () => {
                return db
                    .into('routes')
                    .insert(testRoutes)
            })

            it('responds with 200 and the specified route', () => {
                const routeId = 2
                const expectedRoute = testRoutes[routeId - 1]
                return supertest(app)
                    .get(`/route/${routeId}`)
                    .expect(200, expectedRoute)
            })
        })
    })
})