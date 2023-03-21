const { db } = require('./db/connection')


module.exports.fetchRestaurants = () => {
  let sqlString = 'SELECT A.restaurant_id, A.restaurant_name, A.area_id, A.cuisine, A.website, ROUND(AVG(B.rating),1) AS average_rating  FROM restaurants A JOIN ratings B ON A.restaurant_id = B.restaurant_id GROUP BY A.restaurant_id;'
  return db.query(sqlString)
}


module.exports.postNewRestaurant = (restaurant) => {
  const restaurantData = [
    restaurant.restaurant_name,
    restaurant.area_id,
    restaurant.cuisine,
    restaurant.website
  ]
  return db.query('INSERT INTO restaurants (restaurant_name, area_id, cuisine, website) VALUES ($1, $2, $3, $4) RETURNING *;', restaurantData)
}


module.exports.removeRestaurant = (restaurantId) => {
  const id = [restaurantId]
  return db.query('DELETE FROM restaurants WHERE restaurant_id = $1', id)
}


module.exports.updateAreaId = (restaurantId, areaId) => {
  const restAndAreaID = [
    restaurantId,
    areaId
  ]

  return db.query(`UPDATE restaurants
SET 
area_id = $2
WHERE restaurant_id = $1 
RETURNING *;`, restAndAreaID)
    .then(({ rows }) => {
      if (rows.length !== 0) {
        return rows
      } else {
        return Promise.reject({ status: 404, msg: "restaurant ID not found" })
      }
    })
}


module.exports.fetchRestByAreaId = (areaId) => {
  const data = [areaId];
  return db.query('SELECT * FROM areas WHERE area_id = $1;', data)
    .then((areaData) => {
      let restaurantData = db.query('SELECT * FROM restaurants WHERE area_id = $1;', data)
      return Promise.all([areaData, restaurantData])
        .then(([areaData, restaurantData]) => {
          return {
            area_id: areaData.rows[0].area_id,
            area_name: areaData.rows[0].area_name,
            total_restaurants: restaurantData.rows.length,
            restaurants: restaurantData.rows
          }
        })
    });
}