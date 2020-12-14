function makeRoutesArray() {
    return [
            {
            id: 1,
            route_name: 'Test Route 1',
            dc_area: 'Northeast DC',
            distance: 8,
            difficulty: 'Medium',
            route_type: 'City Streets',
            route_description: 'Describing what the route is like to run along.'
        },
        {
            id: 2,
            route_name: 'Test Route 2',
            dc_area: 'Northwest DC',
            distance: 4,
            difficulty: 'Low',
            route_type: 'Residential',
            route_description: 'This is the second test route.'
        },
        {
            id: 3,
            route_name: 'Test Route 3',
            dc_area: 'Southeast DC',
            distance: 10,
            difficulty: 'High',
            route_type: 'Trail/Path',
            route_description: 'Yet one more description to test...'
        }
        ];
}

module.exports = {
    makeRoutesArray,
}