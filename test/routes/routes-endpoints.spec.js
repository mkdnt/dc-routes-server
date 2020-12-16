const { expect } = require('chai')
const knex = require('knex')
const supertest = require('supertest')
const app = require('../../src/app')
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

    describe(`GET /api/route`, () => {
        context(`Given no routes`, () => {
            it(`responds with 200 and an empty list`, () => {
                return supertest(app)
                    .get('/api/route')
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
                    .get('/api/route')
                    .expect(200, testRoutes)
            })
        })
    })

    describe(`GET /api/route/:route_id`, () => {
        context(`Given no routes`, () => {
            it(`responds with 404`, () => {
                const routeId = 123456
                return supertest(app)
                    .get(`/api/route/${routeId}`)
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
                    .get(`/api/route/${routeId}`)
                    .expect(200, expectedRoute)
            })
        })

        context(`Given an XSS attack route`, () => {
            const maliciousRoute = {
                id: 911,
                route_name: `Malicious attack from <script>alert("xss");</script>`,
                dc_area: 'Northeast DC',
                distance: 8,
                difficulty: 'High',
                route_type: 'Trail/Path',
                route_description: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`
            }

            beforeEach('insert malicious route', () => {
                return db
                    .into('routes')
                    .insert([maliciousRoute])
            })

            it('removes XSS attack content', () => {
                return supertest(app)
                    .get(`/api/route/${maliciousRoute.id}`)
                    .expect(200)
                    .expect(res => {
                        expect(res.body.route_name).to.eql(`Malicious attack from &lt;script&gt;alert("xss");&lt;/script&gt;`)
                        expect(res.body.route_description).to.eql(`Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`)
                    })
            })
        })
    })

    describe(`POST /api/route`, () => {
        it(`creates a route, responding with 201 and the new route`, function() {
            const newRoute = {
                route_name: 'Test Route',
                dc_area: 'Southeast DC',
                distance: 10,
                difficulty: 'High',
                route_type: 'Trail/Path',
                route_description: 'Route description to test...'
            }
            return supertest(app)
                .post('/api/route')
                .send(newRoute)
                .expect(201)
                .expect(res => {
                    expect(res.body.route_name).to.eql(newRoute.route_name)
                    expect(res.body.dc_area).to.eql(newRoute.dc_area)
                    expect(res.body.distance).to.eql(newRoute.distance)
                    expect(res.body.difficulty).to.eql(newRoute.difficulty)
                    expect(res.body.route_type).to.eql(newRoute.route_type)
                    expect(res.body.route_description).to.eql(newRoute.route_description)
                    expect(res.body).to.have.property('id')
                    expect(res.headers.location).to.eql(`/api/route/${res.body.id}`)
                })
                .then(postRes => 
                    supertest(app)
                        .get(`/api/route/${postRes.body.id}`)
                        .expect(postRes.body)
                    )
        })

        const requiredFields = ['route_name', 'dc_area', 'distance', 'difficulty', 'route_type', 'route_description']

        requiredFields.forEach(field => {
            const newRoute = {
                route_name: 'Test Route',
                dc_area: 'Southeast DC',
                distance: 10,
                difficulty: 'High',
                route_type: 'Trail/Path',
                route_description: 'Route description to test...'
            }

            it(`responds with 400 and an error message when the '${field}' is missing`, () => {
                delete newRoute[field]

                return supertest(app)
                .post('/api/route')
                .send(newRoute)
                .expect(400, {
                    error: { message: `Missing '${field}' in request body` }
                })
            })

        })
        
    })

    describe(`DELETE /api/route/:route_id`, () => {
        context('Given no route', () => {
            it(`responds with 404`, () => {
                const routeId = 123456
                return supertest(app)
                    .delete(`/api/route/${routeId}`)
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

            it('responds with 204 and removes the route', () => {
                const idToRemove = 2
                const expectedRoutes = testRoutes.filter(route => route.id !== idToRemove)
                return supertest(app)
                    .delete(`/api/route/${idToRemove}`)
                    .expect(204)
                    .then(res =>
                        supertest(app)
                        .get('/api/route')
                        .expect(expectedRoutes)
                    )
            })
        })
    })

    describe(`PATCH /api/route/:route_id`, () => {
        context('Given no route', () => {
            it('responds with 404', () => {
                const routeId = 123456
                return supertest(app)
                    .patch(`/api/route/${routeId}`)
                    .expect(404, {error: {message: `Route doesn't exist`}})
            })
        })

        context('Given there are routes in the database', () => {
            const testRoutes = makeRoutesArray()

            beforeEach('insert articles', () => {
                return db
                    .into('routes')
                    .insert(testRoutes)
            })

            it('responds with 204 and updates the article', () => {
                const idToUpdate = 2
                const updateRoute = {
                    route_name: 'Updated Route',
                    dc_area: 'Southeast DC',
                    distance: 10,
                    difficulty: 'High',
                    route_type: 'Trail/Path',
                    route_description: 'Route description to update...'
                }
                const expectedRoute = {
                    ...testRoutes[idToUpdate -1],
                    ...updateRoute
                }
                return supertest(app)
                    .patch(`/api/route/${idToUpdate}`)
                    .send(updateRoute)
                    .expect(204)
                    .then(res => 
                        supertest(app)
                            .get(`/api/route/${idToUpdate}`)
                            .expect(expectedRoute)
                    )
            })

            it('responds with 400 when no required fields are supplied', () => {
                const idToUpdate = 2
                return supertest(app)
                    .patch(`/api/route/${idToUpdate}`)
                    .send({irrelevantField: 'foo'})
                    .expect(400, { error: {message: `Request body must contain route name, DC area, distance, difficulty, route type, or description`}})
            })

            it('responds with 204 when updating only a subset of the fields', () => {
                const idToUpdate = 2
                const updateRoute = {
                    route_name: 'Updated Route',
                }
                const expectedRoute = {
                    ...testRoutes[idToUpdate -1],
                    ...updateRoute
                }
                return supertest(app)
                    .patch(`/api/route/${idToUpdate}`)
                    .send({
                        ...updateRoute,
                        fieldToIgnore: 'should not be in GET response'
                    })
                    .expect(204)
                    .then(res =>
                        supertest(app)
                        .get(`/api/route/${idToUpdate}`)
                        .expect(expectedRoute)    
                    )
            })
        })
    })
})