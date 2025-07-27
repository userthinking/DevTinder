import mongoose from "mongoose";

const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: ["interested", "ignored", "accepted", "rejected"],
            message: `{VALUE} is incorrect status type`
        }
    }
}, { timestamps: true })

connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 })

connectionRequestSchema.pre('save', function (next) {
    if (this.fromUserId.equals(this.toUserId)) {
        throw new Error("Cannot send connection request to your self")
    }
    next()
})

const ConnectionRequest = mongoose.model('ConnectionRequest', connectionRequestSchema)

export default ConnectionRequest