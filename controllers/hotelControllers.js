const Hotel = require('../models/Hotel')

module.exports = {
    addHotel: async (req, res, next) => {
        const {
            country_id,
            title,
            description,
            contact,
            imageUrl,
            rating,
            location,
            price,
            facilities,
        } = req.body;

        try {
            const newHotel = new Hotel({
                country_id,
                title,
                description,
                contact,
                imageUrl,
                rating,
                location,
                price,
                facilities,
            })

            await newHotel.save();

            res.status(201).json({ status: true })
        } catch (error) {
            return next(error)
        }
    },

    getHotelsByCountry: async (req, res, next) => {
        const countryId = req.params.id;
        const limitParam = req.query.limit;

        const limit = parseInt(limitParam)

        try {
            const hotels = await Hotel.find({ country_id: countryId }, '_id review rating imageUrl title country_id location')
                .limit(limit)

            if (hotels.length === 0) {
                return res.status(200).json([]);
            }

            res.status(200).json({ hotels })
        } catch (error) {
            return next(error)
        }
    },

    getAllHotels: async (req, res, next) => {
        try {
            const hotels = await Hotel.find({}, '_id review imageUrl title country_id location');

            if (hotels.length === 0) {
                return res.status(200).json([]);
            }

            res.status(200).json({ hotels });
        } catch (error) {
            return next(error);
        }
    },

    getHotelById: async (req, res, next) => {
        const hotelId = req.params.id


        try {
            const hotel = await Hotel.findById(hotelId)
                .populate({
                    path: 'reviews',
                    options: { sort: { updatedAt: -1 }, limit: 2 },
                    select: 'rating review updatedAt user',

                    populate: {
                        path: 'user',
                        model: 'User',
                        select: 'username profile'
                    }
                })

            if (!hotel) {
                return res.status(404).json({ status: false, message: "Hotel does not exist" })
            }

            res.status(200).json(hotel)
        } catch (error) {
            return next(error)
        }
    },

    deleteHotel: async (req, res, next) => {
        try {
            const hotel = await Hotel.findByIdAndDelete(req.params.id);
            if (!hotel) return next(new Error('Hotel not found'));
            res.status(200).json({ status: true });
        } catch (error) {
            return next(error);
        }
    },
    editHotel: async (req, res, next) => {
        try {
            const updatedHotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!updatedHotel) return next(new Error('Hotel not found'));
            res.status(200).json(updatedHotel);
        } catch (error) {
            return next(error);
        }
    },

    search: async (req, res, next) => {
        try {
            const results = await Hotel.aggregate(
                [
                    {
                        $search: {
                            index: "hotels",
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