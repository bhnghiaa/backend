const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: { type: String, require: true },
    email: { type: String, require: true, unique: true },
    password: { type: String, require: true },
    profile: { type: String, default: "https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_640.png" },
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);