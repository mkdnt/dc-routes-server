# DC Routes

## Server

<p>This app offers various running routes in the Washington, DC, area. Choose which part of DC you want to run in, how far you want to run, or what type of route you want to run. You can also add your own routes to the list to help expand our database of DC running routes.</p>

## [DC Routes](https://dc-routes-client.vercel.app/)

<img align='center' src='https://mkdnt.github.io/dc-routes-client/readme_images/list.jpeg' />
<img align='center' src='https://mkdnt.github.io/dc-routes-client/readme_images/route.jpeg' />

<br/>
<p>This is the server side of the application which uses Node and Express to build the API. For the database setup I am using PostgreSQL and Knex to make queries.
 I have incorporated full testing for all of the endpoints in a separate test folder.</p>
<br/>
<p>This is the back end of a fullstack app, using Heroku for server hosting and Vercel for client hosting.</p>
<br/>
<br/>
<p>For API calls, the main endpoint is '/api'.</p>
<br/>
<ul>
<li>/route - Will allow you to GET all routes from the DB or POST to the routes list in the DB</li>
<li>/route/byid/:routeId - Will allow you to GET, PATCH, or DELETE a route by ID from the DB</li>
<li>Other endpoints, such as /route/byarea or /route/bytype are in the server and have been tested, but are not active. These will be deployed in the future when client-side components are refactored and new functionality is introduced.</li>
</ul>

<p>Please see the link below for DC Routes Client repository.</p>

### [DC Routes Client](https://github.com/mkdnt/dc-routes-client)
