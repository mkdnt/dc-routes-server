SELECT *
FROM routes JOIN difficulty on routes.difficulty = difficulty.id;

SELECT *
FROM routes JOIN dc_area on routes.dc_area = dc_area.id;

SELECT *
FROM routes JOIN route_type on routes.route_type = route_type.id;