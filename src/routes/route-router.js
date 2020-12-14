const express = require('express')
const routes = require('./store')
const logger = require('./logger')

const routeRouter = express.Router()
const bodyParser = express.json() 

routeRouter
    .route('/route')
    .get((req, res) => {
        res
        .json(routes);
        })
    .post(bodyParser, (req, res) => {
        const {route_name, dc_area, distance, difficulty, route_type, route_description} = req.body;

        if (!route_name) {
            logger.error('Name is required');
            return res
                .status(400)
                .send('Invalid data. Name is required.')
        }
        if (!dc_area) {
            logger.error('DC area is required');
            return res
                .status(400)
                .send('Invalid data. DC area is required.')
        }
        if (!distance) {
            logger.error('Distance is required');
            return res
                .status(400)
                .send('Invalid data. Distance is required.')
        }
        if (!difficulty) {
            logger.error('Difficulty is required');
            return res
                .status(400)
                .send('Invalid data. Difficulty is required.')
        }
        if (!route_type) {
            logger.error('Type is required');
            return res
                .status(400)
                .send('Invalid data. Type is required.')
        }
        if (!route_description) {
            logger.error('Description is required');
            return res
                .status(400)
                .send('Invalid data. Description is required.')
        }

        const route = {
            id,
            route_name,
            dc_area,
            distance,
            difficulty,
            route_type,
            route_description
        }

        routes.push(route)
        logger.info(`Route with id ${id} created`)
        res
            .status(201)
            .location(`http://localhost:9000/route/${id}`)
            .json(route)
    })

routeRouter
    .route('/route/:id')
    .get((req, res) => {
        const { id } = req.params;
        const route = routes.find(r => r.id === id);

        if (!route) {
            logger.error(`Card with id ${id} not found.`);
            return res
                .status(404)
                .send('Route Not Found');
        }

        res.json(route);
        })
    .delete((req, res) => {
        const { id } = req.params;
        const index = routes.findIndex(r => r.id == id)

        if (index === -1) {
            return res
            .status(404)
            .send('Route Not Found')
        }

        routes.splice(index, 1);
        res.send('Route Deleted')
        })

module.exports = routeRouter