const Review = require("../models/Review");
const Hotel = require("../models/Hotel");

module.exports ={
    addReview: async (req, res, next)=> {
        const user = req.user.id;
        const {place, review, rating} =req.body

        try {

            const existingReview = await Review.findOne({place, user});

            if(existingReview){
                existingReview.rating = rating,
                existingReview.review = review,

                await existingReview.save();
            }else{
                const newReview = new Review({
                    place,
                    review,
                    rating,
                    user
                })
    
                await newReview.save();

                const hotel = await Hotel.findById(place)
                hotel.reviews.push(newReview._id)

                await hotel.save();
            }
            
            res.status(200).json({status: true})
        } catch (error) {
            return next(error)
        }
    },


    getReviews: async (req, res, next)=> {
        const placeId = req.params.id;

        try {
            const places = await Review.find({place: placeId}, {createdAt: 0, __v: 0})
            .populate({
                path: 'user',
                select: "username profile"
            })
           
            res.status(200).json(places)
        } catch (error) {
            return next(error)
        }
    }
}