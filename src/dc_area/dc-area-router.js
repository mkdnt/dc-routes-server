const express = require('express')
const dcAreaService = require('./dc-area-service')

const dcAreaRouter = express.Router()

dcAreaRouter
    .route('/:dc_area_id')
    .all((req, res, next) => {
        dcAreaService.getById(req.app.get('db'), req.params.dc_area_id)
            .then(area => {
            if (!area) {
                return res.status(404).json({
                error: { message: `DC Area doesn't exist` }
                })
            }
            res.area = area
            next()
            })
            .catch(next)
            })
    .get((req, res, next) => {
        res.json({
                id: res.route.id,
                dc_area_name: res.dc_area.dc_area_name
        })
    })        

module.exports = dcAreaRouter