const express = require('express')
const RoutesService = require('./routes-service')
const xss = require('xss')

const routeRouter = express.Router()
const jsonParser = express.json()

routeRouter
    .route('/')
    .get((req, res, next) => {
    RoutesService.getAllRoutes(req.app.get('db'))
        .then(routes => {
        res.json(routes)
        })
        .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
        const {route_name, dc_area, distance, difficulty, route_type, route_description} = req.body
        const newRoute = {route_name, dc_area, distance, difficulty, route_type, route_description}

        for (const [key, value] of Object.entries(newRoute)) {
            if (value == null) {
                return res.status(400).json({
                    error: { message: `Missing '${key}' in request body`}
                })
            }
        }

        RoutesService.insertRoute(
            req.app.get('db'),
            newRoute
        )
            .then(route => {
            res
                .status(201)
                .location(`/route/${route.id}`)
                .json(route)
            })
            .catch(next)
        })

routeRouter
    .route('/:route_id')
    .all((req, res, next) => {
        RoutesService.getById(req.app.get('db'), req.params.route_id)
            .then(route => {
            if (!route) {
                return res.status(404).json({
                error: { message: `Route doesn't exist` }
                })
            }
            res.route = route
            next()
            })
            .catch(next)
            })
    .get((req, res, next) => {
        res.json({
                id: route.id,
                route_name: xss(route.route_name),
                dc_area: route.dc_area,
                distance: route.distance,
                difficulty: route.difficulty,
                route_type: route.route_type,
                route_description: xss(route.route_description)
        })
    })        
    .delete((req, res, next) => {
        RoutesService.deleteRoute(
            req.app.get('db'),
            req.params.route_id
        )
            .then(() => {
                res.status(204).end()
            })
            .catch(next)
    })

module.exports = routeRouter