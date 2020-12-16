drop table if exists route_type;
drop table if exists difficulty;
drop table if exists dc_area;
drop table if exists routes;

create table if not exists dc_area (
    id integer primary key generated by default as identity,
    dc_area_name text not null
);

create table if not exists difficulty (
    id integer primary key generated by default as identity,
    difficulty_name text not null
);

create table if not exists route_type (
    id integer primary key generated by default as identity,
    route_type_name text not null
);

CREATE TABLE if not exists routes (
    id integer primary key generated by default as identity,
    route_name text not null,
    dc_area integer references dc_area(id) not null,
    distance integer not null,
    difficulty integer references difficulty(id) not null,
    route_type integer references route_type(id) not null,
    route_description text not null
);