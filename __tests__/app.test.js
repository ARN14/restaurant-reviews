const request = require('supertest');
const app = require('../app');
const { db } = require('../db/connection');
const data = require('../db/data/index');
const { seed } = require("../db/seed");


beforeEach(() => {
    return seed(data);
})


afterAll(() => {
    db.end();
});


describe('GET api', () => {
    test('return 200 status code', () => {
        return request(app).get('/api').expect(200)
    });


    test('should return an object containing a message to the user', () => {
        return request(app).get('/api').expect(200).then((response) => {
            expect(response.body).toEqual({ message: 'Hello and welcome to the restaurant reviews API! Feel free to browse restaurants, add or delete, or post reviews.' })
        })
    });
});


describe('GET api/restaurants', () => {
    test('return 200 status code', () => {
        return request(app).get('/api/restaurants').expect(200)
    });


    test('should return a key of restaurants with an array with length 8', () => {
        return request(app).get('/api/restaurants').then((response) => {
            expect(response.body.hasOwnProperty('restaurants')).toBe(true)
            expect(response.body.restaurants.length).toBe(8)
            expect(Array.isArray(response.body.restaurants)).toBe(true);
        })
    });


    test("restaurants contain a key of average_rating", () => {
        return request(app).get("/api/restaurants").then((response) => {
            expect(response.body.restaurants[0].hasOwnProperty("average_rating")).toBe(true);
        })
    })
});


describe("POST api/restaurants", () => {
    test("should return inserted restaurant", () => {
        return request(app).post('/api/restaurants')
            .send({
                "restaurant_name": "The Codfather",
                "area_id": 2,
                "cuisine": "British",
                "website": "www.thecodfather.com"
            })
            .then(({ body }) => {
                expect(body).toEqual({
                    "restaurant": {
                        "restaurant_id": 9,
                        "restaurant_name": "The Codfather",
                        "area_id": 2,
                        "cuisine": "British",
                        "website": "www.thecodfather.com"
                    }
                });
            })
    })
})


describe("DELETE api/restaurants/:restaurant_id", () => {
    test("should return 204 status code", () => {
        return request(app).delete('/api/restaurants/1').expect(204);
    })


    test("should delete the restaurant", () => {
        return request(app).get('/api/restaurants')
            .then((response) => {
                expect(response.body.restaurants.length).toBe(8)
                return request(app).delete('/api/restaurants/1').expect(204)
                    .then(() => {
                        return request(app).get('/api/restaurants').then((response) => {
                            expect(response.body.restaurants.length).toBe(7)
                        });
                    });
            });
    })
})


describe('PATCH /api/restaurants/:restaurant_id', () => {
    test('should return 200 status when passed in object with rest_id', () => {
        return request(app).patch('/api/restaurants/1').send({ area_id: 2 })
            .expect(200)
    });


    test('should return 200 status + correct object when passed in object with rest_id', () => {
        return request(app).patch('/api/restaurants/3').send({ area_id: 2 })
            .expect(200).then((response) => {
                expect(response.body).toEqual({
                    "restaurant": {
                        "restaurant_id": 3,
                        "restaurant_name": "Rudys Pizza",
                        "area_id": 2,
                        "cuisine": "Neapolitan Pizzeria",
                        "website": "http://rudyspizza.co.uk/"
                    }
                })
            })
    });


    describe("error handling", () => {
        test("should return 400 status code when body is empty", () => {
            return request(app).patch('/api/restaurants/1').expect(400)
                .then((response) => {
                    expect(response.body).toEqual(
                        {
                            msg: "Body must contain key of area_id"
                        })
                });
        })


        test("should return status code 400 when given an invalid id", () => {
            return request(app).patch("/api/restaurants/cheese").send({ area_id: 2 }).expect(400)
                .then((response) => {
                    expect(response.body).toEqual(
                        {
                            msg: "Invalid restaurant ID"
                        })
                })
        })


        test("should return status code 404 when id is not found", () => {
            return request(app).patch("/api/restaurants/100").send({ area_id: 2 }).expect(404)
                .then((response) => {
                    expect(response.body).toEqual(
                        {
                            msg: "restaurant ID not found"
                        })
                })
        })
    })
});


describe("GET api/areas/:area_id/restaurants", () => {
    test("should return 200 status code", () => {
        return request(app).get('/api/areas/1/restaurants').expect(200);
    })


    test("should return an object with key of area", () => {
        return request(app).get('/api/areas/1/restaurants').then((response) => {
            expect(response.body.hasOwnProperty("area")).toBe(true);
        });
    })


    test("area object should contain area table keys of area_id, area_name", () => {
        return request(app).get('/api/areas/1/restaurants').then((response) => {
            expect(response.body.area.hasOwnProperty("area_id")).toBe(true);
            expect(response.body.area.hasOwnProperty("area_name")).toBe(true);
        });
    })


    test("area object should contain keys for total_restaurants, and restaurants", () => {
        return request(app).get('/api/areas/1/restaurants').then((response) => {
            expect(response.body.area.hasOwnProperty("total_restaurants")).toBe(true);
            expect(response.body.area.hasOwnProperty("restaurants")).toBe(true);
        });
    })
})


describe("POST api/ratings", () => {
    test("should return 200 status code", () => {
        return request(app).post('/api/ratings').expect(200)
            .send({
                "restaurant_id": 1,
                "rating": 5,
            })
    })


    test("returns error when body does not contain correct keys", () => {
        return request(app).post('/api/ratings').expect(400)
            .send({
                1: "Hello",
                "2": 1,
            })
            .then(({ body }) => {
                console.log("Body is:", body)
                expect(body).toEqual({
                    "msg": "Your rating must contain the following keys: 'restaurant_id', 'rating'"
                });
            })
    })


    test("Returns rating back to user with successful submission", () => {
        return request(app).post('/api/ratings')
            .send({
                "restaurant_id": 1,
                "rating": 5,
            })
            .then(({ body }) => {
                expect("rating" in body).toBe(true);
                expect(Object.keys(body.rating)).toEqual(["rating_id", "restaurant_id", "rating"])
            })
    })
})
