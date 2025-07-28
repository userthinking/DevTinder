import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
        minLength: 3,
        maxLength: 50
    },
    lastName: {
        type: String,
        trim: true,
        minLength: 3,
        maxLength: 50
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Email is not valid")
            }
        }
    },
    password: {
        type: String,
        required: true,
        minLength: 4
    },
    age: {
        type: Number,
        min: 18
    },
    gender: {
        type: String,
        enum: {
            values: ["male", "female", "other"],
            message: `{VALUE} is not a valid gender type`
        },
        trim: true,
        lowercase: true,
        // validate(value) {
        //     if (!["male", "female", "others"].includes(value)) {
        //         throw new Error("Gender is not valid")
        //     }
        // }
    },
    photoUrl: {
        type: String,
        default: "https://www.mauicardiovascularsymposium.com/wp-content/uploads/2019/08/dummy-profile-pic-300x300.png",
        validate(value) {
            if (!validator.isURL(value)) {
                throw new Error("Invalid photo URL")
            }
        }
    },
    about: {
        type: String,
        trim: true,
        maxLength: 300
    },
    skills: {
        type: [String],
    }
}, { timestamps: true })

userSchema.methods.getJWT = async function () {
    const token = await jwt.sign({ _id: this._id }, process.env.JWT_SECRET_KEY, { expiresIn: "1d" })
    return token;
}

userSchema.methods.comparePassword = async function (userPassword) {
    const passwordHash = this.password
    const isPasswordValid = await bcrypt.compare(userPassword, passwordHash)
    return isPasswordValid
}

const User = mongoose.model('User', userSchema)

export default User