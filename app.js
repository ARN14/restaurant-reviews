const express = require('express');
const request = require('supertest');
const {getStatus, getRestaurants, postRestaurant, deleteRestaurant, patchRestaurant, getRestByAreaId} = require('./controller')

const app = express();
app.use(express.json());

module.exports = app;

app.get('/api', getStatus)

app.get('/api/restaurants', getRestaurants)

app.post('/api/restaurants', postRestaurant)

app.delete('/api/restaurants/:restaurant_id', deleteRestaurant)

app.patch('/api/restaurants/:restaurant_id', patchRestaurant)

app.get('/api/areas/:area_id/restaurants', getRestByAreaId)

app.use((err, request, response, next) => {
    if (err.code === "22P02") {
        response.status(400).send({msg: "Invalid restaurant ID"})
    } else {
        next(err);
    }
})

app.use((err, request, response, next) => {
    response.status(err.status).send({msg: err.msg})
    next(err);
})