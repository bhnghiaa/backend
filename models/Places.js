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
    const Country = mongoose.model('Country');

    Country.findById(doc.country_id, function (err, country) {
        if (err) {
            console.log(err);
            next(err);
        } else if (country) {
            country.popular.push(doc._id);
            country.save(next);  // Lưu country với popular đã được cập nhật
        } else {
            next(new Error('Associated country not found'));
        }
    });
});
module.exports = mongoose.model("Place", PlaceSchema);