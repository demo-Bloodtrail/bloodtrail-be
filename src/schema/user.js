import mongoose from "mongoose";

const { Schema } = mongoose;
const { Types: { ObjectId }, } = Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    name: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
        unique: true,
    },
    birth: {
        type: Date,
        required: true,
    },
    profile_image: {
        type: String,
    },
    user_id: {
        type: String,
        required: true,
        unique: true,
    },
    pwd: {
        type: String,
        required: true,
    },
    // 포인트
    point: {
        type: Number,
        default: 0,
    },
    // 포인트에 대한 배지
    badge: {
        type: String,
    },
    // 프리미엄 결제 여부
    premium: {
        type: Boolean,
        required: true,
    },
    // 소속 크루
    crew: {
        type: ObjectId,
        ref: 'Crew',
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    updated_at: {
        type: Date,
        default: Date.now,
    },
});

const User = mongoose.model('User', userSchema);
export default User;