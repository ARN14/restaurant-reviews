const {fetchRestaurants, postNewRestaurant, removeRestaurant, updateAreaId, fetchRestByAreaId, addNewRating} = require('./model')


module.exports.getStatus = (request, response) => {
    response.status(200).send({message: "Hello and welcome to the restaurant reviews API! Feel free to browse restaurants, add or delete, or post reviews."})
}


module.exports.getRestaurants = (request, response) => {
    fetchRestaurants().then((selectQuery) => {
        response.status(200).send({restaurants: selectQuery.rows})
    })
}


module.exports.postRestaurant = (request, response) => {
    const restaurant = request.body;
    postNewRestaurant(restaurant)
    .then(({ rows : [newRestaurant] }) => {
        response.status(201).send({restaurant: newRestaurant});
    })
}


module.exports.postRating = (request, response) => {
    const rating = request.body;
    addNewRating(rating)
    .then(([statusCode, responseObject]) => {
        response.status(statusCode).send(responseObject);
    })
    .catch(([statusCode, responseObject]) => {
        response.status(statusCode).send(responseObject);
    })
}


module.exports.deleteRestaurant = (request, response) => {
    const restaurantId = request.params.restaurant_id;
    removeRestaurant(restaurantId).then(() => {
        response.status(204).send();
    })
}


module.exports.patchRestaurant = (request, response, next) => {
    if (request.body.hasOwnProperty('area_id')) {
    const restaurantId = request.params.restaurant_id;
    const {area_id} = request.body
    updateAreaId(restaurantId, area_id)
    .then((updatedRestaurant) => {
        response.status(200).send({restaurant: updatedRestaurant[0]})
    })
    .catch((error) => {
        next(error);
    })
}
    else {
        return next({status: 400, msg: "Body must contain key of area_id"})
        }
}


module.exports.getRestByAreaId = (request, response) => {
    const areaId = request.params.area_id;
    fetchRestByAreaId(areaId).then((data) => {
        response.status(200).send({"area": data});
    })
    
}
