const Place = require("../models/Places");
const Country = require('../models/Country');

module.exports = {
    addPlaces: async (req, res, next) => {
        const { countryName, description, imageUrl, location, title, rating, review, latitude, longitude, contact_id } = req.body;

        try {
            // Find the country by name instead of ID
            const relatedCountry = await Country.findOne({ country: countryName });

            if (relatedCountry) {
                const newPlace = new Place({
                    country_id: relatedCountry._id,  // Use the _id of the found country
                    description,
                    imageUrl,
                    location,
                    contact_id,
                    title,
                    rating,
                    review,
                    latitude,
                    longitude
                });

                await newPlace.save();

                // Add the new Place to the list of popular places of the found country
                relatedCountry.popular.push(newPlace._id);
                await relatedCountry.save();  // Save the updated country information
                res.status(201).send({ message: "Place added successfully and country updated", place: newPlace });
            } else {
                res.status(404).send({ message: "Country not found" });
            }
        } catch (error) {
            return next(error);
        }
    },


    getPlaces: async (req, res, next) => {
        try {
            const limitParams = req.query.limit;
            let query = Place.find({}, '_id review rating imageUrl title country_id location');

            if (limitParams !== 'all') {
                const limit = parseInt(limitParams) || 5;
                query = query.limit(limit);
            }

            const places = await query.exec();

            res.status(200).json({ places })

        } catch (error) {
            return next(error)
        }
    },

    getPlace: async (req, res, next) => {
        const placeId = req.params.id;

        try {

            const place = await Place.findById(placeId, { createdAt: 0, updatedAt: 0, __v: 0 })
                .populate({
                    path: 'popular',
                    select: 'title rating review imageUrl location'
                });

            res.status(200).json({ place })

        } catch (error) {
            return next(error)
        }
    },

    getPlacesByCountry: async (req, res, next) => {
        const countryId = req.params.id;
        try {

            const places = await Place.find({ country_id: countryId }, { createdAt: 0, updatedAt: 0, __v: 0 })

            if (places.length === 0) {
                return res.status(200).json([])
            }

            res.status(200).json({ places })

        } catch (error) {
            return next(error)
        }
    },


    search: async (req, res, next) => {
        try {
            const results = await Place.aggregate(
                [
                    {
                        $search: {
                            index: "places",
                            text: {
                                query: req.params.key,
                                path: {
                                    wildcard: "*"
                                }
                            }
                        }
                    }
                ]
            )
            res.status(200).json(results)
        } catch (error) {
            return next(error)
        }
    },



}