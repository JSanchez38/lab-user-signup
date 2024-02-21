const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
    
        email: {
            type: String,
            required: true,
            unique: true,
        }, 
        password: {
            type: String, 
            required: true,
            minlength: [10, 'Password needs at least 10 chars'],
        }
    }, { timestamps: true }

);

const User = mongoose.model("User", userSchema);
module.exports = User;
