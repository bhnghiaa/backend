const mongoose = require("mongoose");

const PlaceSchema = new mongoose.Schema({
    country_id: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    contact_id: { type: String, required: true },
    imageUrl: { type: String, required: true },
    rating: { type: Number, required: true },
    review: { type: String, required: true },
    location: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    popular: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Hotel",
        }
    ],

}, { timestamps: true });

PlaceSchema.post('save', function (doc, next) {
    const Country = require('./Country'); // import the Country model

    // update the popular field in the Country document
    Country.updateOne(
        { $push: { popular: doc.title } },
        function (err) {
            if (err) {
                console.log(err);
                next(err);
            } else {
                next();
            }
        }
    );
});


module.exports = mongoose.model("Place", PlaceSchema);