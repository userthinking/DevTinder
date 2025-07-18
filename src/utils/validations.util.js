import User from "../models/user.model.js"

const validateUserSignUpData = async (req) => {
    const { firstName, emailId } = req.body

    if (!firstName) {
        throw new Error("First Name is required")
    }

    const emailExists = await User.findOne({ emailId })
    if (emailExists) {
        throw new Error("Email already exists")
    }
}

const validateProfileEditData = (req) => {
    const allowedEditFields = ["firstName", "lastName", "photoUrl", "gender", "age", "about", "skills"]

    const isEditAllowed = Object.keys(req.body).every((field) => allowedEditFields.includes(field))

    return isEditAllowed
}

export { validateUserSignUpData, validateProfileEditData }