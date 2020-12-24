const path = require('path')
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
        const {route_name, dc_area, distance, difficulty, route_type, route_description, editable} = req.body
        const newRoute = {route_name, dc_area, distance, difficulty, route_type, route_description, editable}

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
                .location(path.posix.join(req.originalUrl + `/byid/${route.id}`))
                .json(route)
            })
            .catch(next)
        })

routeRouter
    .route('/byarea/:dc_area')
    .get((req, res, next) => {
        RoutesService.getByDcArea(req.app.get('db'), req.params.dc_area)
        .then(routes => {
            if (req.params.dc_area != 'Northeast' && req.params.dc_area != 'Southeast' && req.params.dc_area != 'Northwest' && req.params.dc_area != 'Southwest') {
                return res.status(404).json({error: { message: `DC Area doesn't exist - must be Northeast, Southeast, Southwest, or Northwest`}})
            }
            res.json(routes)
        })
        .catch(next)
    })

routeRouter
    .route('/bydifficulty/:difficulty')
    .get((req, res, next) => {
        RoutesService.getByDifficulty(req.app.get('db'), req.params.difficulty)
        .then(routes => {
            if (req.params.difficulty != 'Low' && req.params.difficulty != 'Medium' && req.params.difficulty != 'High') {
                return res.status(404).json({error: { message: `Difficulty doesn't exist - must be Low, Medium, or High` }})
            }
            res.json(routes)
        })
        .catch(next)
    })

routeRouter
    .route('/bytype/:route_type')
    .get((req, res, next) => {
        RoutesService.getByRouteType(req.app.get('db'), req.params.route_type)
        .then(routes => {
            if (req.params.route_type != 'City Streets' && req.params.route_type != 'Residential' && req.params.route_type != 'Trail/Path') {
                return res.status(404).json({error: {message: `Type doesn't exist - must be City Streets, Residential, or Trail/Path` }})
            }
            res.json(routes)
        })
        .catch(next)
    })    

routeRouter
    .route('/byid/:routeId')
    .all((req, res, next) => {
        RoutesService.getById(req.app.get('db'), req.params.routeId)
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
                id: res.route.id,
                route_name: xss(res.route.route_name),
                dc_area: res.route.dc_area,
                distance: res.route.distance,
                difficulty: res.route.difficulty,
                route_type: res.route.route_type,
                route_description: xss(res.route.route_description),
                editable: res.route.editable
        })
    })        
    .delete((req, res, next) => {
        RoutesService.deleteRoute(req.app.get('db'), req.params.routeId)      
            .then(() => {
                res.status(204).end()
            })
            .catch(next)
    })
    .patch(jsonParser, (req, res, next) => {
        const {route_name, dc_area, distance, difficulty, route_type, route_description, editable} = req.body
        const routeToUpdate = {route_name, dc_area, distance, difficulty, route_type, route_description, editable}

        const numberOfValues = Object.values(routeToUpdate).filter(Boolean).length
        if (numberOfValues === 0) {
            return res.status(400).json({
                error: { message: `Request body must contain route name, DC area, distance, difficulty, route type, or description` }
            })
        }

        RoutesService.updateRoute(
            req.app.get('db'),
            req.params.routeId,
            routeToUpdate
        )
            .then(numRowsAffected => {
                res.status(204).end()
            })
            .catch(next)
    })

module.exports = routeRouter