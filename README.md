# Restaurant Reviews API
This is a restaurant rating application, allowing you to add your favourite restaurants, post 5 star ratings, as well as deleting restaurants or modifying by area, and other functionality.  
This program shows off the Express package in Javascript, to setup endpoints to a RESTful API (GET, POST, PATCH, DELETE). It utilises the MVC pattern to delegate app functionality between the model and the controller, and is tested with TDD.   

### MVC Pattern
The `app.js` file contains the api endpoints, and calls the controller depending on requests from the user.    
the `controller.js` recieves the requests from the app, gathers the information from the user, and passes it on to the model by calling the correct function depending on the endpoint, it then returns any output from the model, and passes it to the app to be displayed to the user.  
The `model.js` performs the required logic e.g. adding, removing, editing restaurant entries, and communicates with the database to add, update, or delete entries.

## Available Endpoints
```js
- GET '/api'  
  // Home Page 
```
```js
- GET '/api/restaurants'
  // Get all restaurants
```
```js
- GET '/api/areas/:area_id/restaurants'
  // Get restaurants in a particular area
```
```js
- POST '/api/restaurants'
  // Post a new restaurant, requires a restaurant object in the following format:
  {
    "restaurant_name": "Example",
    "area_id": 1,
    "cuisine": "Example",
    "website": "www.example.com"
  }
```
```js
- POST '/api/ratings'
  // Post you rating to a restaurant, requires sending an object in the following format:
  {
    "restaurant_id": 1,
    "rating": 5,
  }
```
```js
- DELETE '/api/restaurants/:restaurant_id'
  // Specify an id to delete a restaurant
```
```js
- PATCH '/api/restaurants/:restaurant_id'
  // Update a restaurant's location by sending an object with a area_id key to the restaurant with the id specified in the endpoint
```

## Starting the Application
### Requirements:
- Node.js
- Insomnia, or another API testing platform
- Postgres

### Setup:
- Input the following commands in the terminal:
- Initialise a javascript package: `npm init`  
- Install pg-format: `npm install pg-format`
- Install node-postgres: `npm install pg`
- Install Express: `npm install express`
- Setup the SQL tables: `psql -f db/setup-db.sql`
- Seed the database: `PGDATABASE=rated_restaurants node db/run-seed.js`
- for testing:
  - Install Jest: `npm install jest`
  - in the 'package.json' file, in 'scripts', change the value of the 'test' key to `"jest"` (`test: "jest"`)
  - Install Supertest: `npm install supertest`
  - run the tests: `PGDATABASE=rated_restaurants npm test`
- To start up the connection:
  - Start up the connection in your postgres application on the default port (5432)
  - Run `node app.js`, to start the connection, you will get a meassage in the terminal indicating the API is running, this must be constantly running while you are connecting to the API through insomnia
  - In Insomnia, connect to the correct port with a GET request to /api by inputting the following endpoint as a url:`localhost:9090/api`
  - From there you are free to connect to the various endpoints of the application by appending them to the end of the previous url, the available endpoints are listed above
