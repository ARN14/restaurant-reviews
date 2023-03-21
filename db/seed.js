const format = require('pg-format');
const { db } = require('./connection');

const seed = ({ areas, ratings, restaurants }) => {
  return db
    .query(`DROP TABLE IF EXISTS ratings;`)
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS restaurants;`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS areas;`);
    })
    .then(() => {
      return db.query(`CREATE TABLE areas (
      area_id SERIAL PRIMARY KEY,
      area_name VARCHAR(40) NOT NULL
  );`);
    })
    .then(() => {
      return db.query(`CREATE TABLE restaurants (
        restaurant_id SERIAL PRIMARY KEY,
        restaurant_name VARCHAR(40) NOT NULL,
        area_id INT REFERENCES areas(area_id),
        cuisine VARCHAR(40),
        website VARCHAR(40)
);`);
    })
    .then(() => {
      return db.query(`CREATE TABLE ratings (
      rating_id SERIAL PRIMARY KEY,
      restaurant_id INT,
      FOREIGN KEY (restaurant_id) REFERENCES restaurants(restaurant_id) ON DELETE CASCADE,
      rating INT CHECK (rating >= 1 AND rating <= 5)
  );`);
    })
    .then(() => {
      const formattedAreas = areas.map((area) => [area.area_name]);
      const queryStr = format(
        `
      INSERT INTO areas
      (area_name)
      VALUES %L
      RETURNING *`,
        formattedAreas
      );
      return db.query(queryStr);
    })
    .then(({ rows: areas }) => {
      const formattedRestaurants = restaurants.map((restaurant) => {
        const { restaurant_name, area_name, cuisine, website } = restaurant;
        const { area_id } = areas.find((area) => area.area_name === area_name);
        return [restaurant_name, area_id, cuisine, website];
      });

      const queryStr = format(
        `
      INSERT INTO restaurants
        (restaurant_name, area_id, cuisine, website)
      VALUES
        %L
      RETURNING *;
      `,
        formattedRestaurants
      );
      return db.query(queryStr);
    })
    .then(({ rows: restaurants }) => {
      const formattedRatings = ratings.map((ratingData) => {
        const { rating, restaurant_name } = ratingData;
        const { restaurant_id } = restaurants.find(
          (restaurant) => restaurant.restaurant_name === restaurant_name
        );
        return [restaurant_id, rating];
      });

      const queryStr = format(
        `
      INSERT INTO ratings
        (restaurant_id, rating)
      VALUES
        %L;`,
        formattedRatings
      );
      return db.query(queryStr);
    })

    .catch((err) => {
      console.log(err);
    });
};

module.exports = { seed };
