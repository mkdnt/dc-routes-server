
const RoutesService = require('../src/routes/routes-service')
const knex = require('knex')
const { expect } = require('chai')

describe(`Routes service object`, function() {
    let db
    let testRoutes = [
        {
            id: 1,
            route_name: 'Test Route 1',
            dc_area: 'Northeast',
            distance: 8,
            difficulty: 'Medium',
            route_type: 'City Streets',
            route_description: 'Describing what the route is like to run along.'
        },
        {
            id: 2,
            route_name: 'Test Route 2',
            dc_area: 'Northwest',
            distance: 4,
            difficulty: 'Low',
            route_type: 'Residential',
            route_description: 'This is the second test route.'
        },
        {
            id: 3,
            route_name: 'Test Route 3',
            dc_area: 'Southeast',
            distance: 10,
            difficulty: 'High',
            route_type: 'Trail/Path',
            route_description: 'Yet one more description to test...'
        },
        {
            id: 4,
            route_name: 'Test Route 4',
            dc_area: 'Southwest',
            distance: 10,
            difficulty: 'High',
            route_type: 'Trail/Path',
            route_description: 'And one last(?) description...'
        }
    ]

    before(() => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL,
        })
    })

    before(() => db('routes').truncate())

    afterEach(() => db('routes').truncate())

    after(() => db.destroy())

    context(`Given 'routes' has data`, () => {
        beforeEach(() => {
        return db
            .into('routes')
            .insert(testRoutes)
        })

        it(`getAllRoutes() resolves all routes from 'routes' table`, () => {
            return RoutesService.getAllRoutes(db)
                .then(actual => {
                    expect(actual).to.eql(testRoutes)
                })
        })

        it(`getById() resolves a route by id from 'routes' table`, () => {
            const thirdId = 3
            const thirdTestRoute = testRoutes[thirdId - 1]
            return RoutesService.getById(db, thirdId)
                .then(actual => {
                    expect(actual).to.eql({
                        id: thirdId,
                        route_name: thirdTestRoute.route_name,
                        dc_area: thirdTestRoute.dc_area,
                        distance: thirdTestRoute.distance,
                        difficulty: thirdTestRoute.difficulty,
                        route_type: thirdTestRoute.route_type,
                        route_description: thirdTestRoute.route_description,
                    })
                })
        })

        it(`getByDcArea() resolves a route by dc_area from 'routes' table`, () => {
            const dc_area = 'Northeast'
            const expectedRoutes = testRoutes.filter(route => route.dc_area == dc_area)
            return RoutesService.getByDcArea(db, dc_area)
                .then(actual => expect(actual).to.eql(expectedRoutes))
        })

        it(`getByDifficulty() resolves a route by difficulty from 'routes' table`, () => {
            const difficulty = 'Medium'
            const expectedRoutes = testRoutes.filter(route => route.difficulty == difficulty)
            return RoutesService.getByDifficulty(db, difficulty)
                .then(actual => expect(actual).to.eql(expectedRoutes))
        })

        it(`getByRouteType() resolves a route by type from 'routes' table`, () => {
            const route_type = 'City Streets'
            const expectedRoutes = testRoutes.filter(route => route.route_type == route_type)
            return RoutesService.getByRouteType(db, route_type)
                .then(actual => expect(actual).to.eql(expectedRoutes))
        })

        it(`deleteRoute() removes a route by id from 'routes table`, () => {
            const routeId = 3
            return RoutesService.deleteRoute(db, routeId)
                .then(() => RoutesService.getAllRoutes(db))
                .then(allRoutes => {
                    const expected = testRoutes.filter(route => route.id !== routeId)
                    expect(allRoutes).to.eql(expected)
                })
        })

        it(`updateRoute() updates a route from the 'routes' table`, () => {
            const idOfRouteToUpdate = 3
            const newRouteData = {
                route_name: 'Updated Route',
                dc_area: 'Southwest DC',
                distance: 10,
                difficulty: 'High',
                route_type: 'Trail/Path',
                route_description: 'Updated route description...'
            }
            return RoutesService.updateRoute(db, idOfRouteToUpdate, newRouteData)
                .then(() => RoutesService.getById(db, idOfRouteToUpdate))
                .then(route => {
                    expect(route).to.eql({
                        id: idOfRouteToUpdate,
                        ...newRouteData,
                    })
                })
        })
    })

    context(`Given 'routes' has no data`, () => {
        it(`getAllRoutes() resolves an empty array`, () => {
            return RoutesService.getAllRoutes(db)
                .then(actual => {
                    expect(actual).to.eql([])
                })
        })

        it(`insertRoute() inserts a new route and resolves the new route with an 'id'`, () => {
            const newRoute = {
            route_name: 'Test New Route',
            dc_area: 'Southwest DC',
            distance: 10,
            difficulty: 'High',
            route_type: 'Trail/Path',
            route_description: 'Testing new route...'
            }
            return RoutesService.insertRoute(db, newRoute)
                .then(actual => {
                    expect(actual).to.eql({
                        id: 1,
                        route_name: newRoute.route_name,
                        dc_area: newRoute.dc_area,
                        distance: newRoute.distance,
                        difficulty: newRoute.difficulty,
                        route_type: newRoute.route_type,
                        route_description: newRoute.route_description,
                    })
                })
        })
    })
})
