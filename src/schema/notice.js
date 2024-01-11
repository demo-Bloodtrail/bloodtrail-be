import mongoose from "mongoose";

const { Schema } = mongoose;
const { Types: { ObjectId }, } = Schema;

const noticeSchema = new Schema({
    // 알림 내용
    content: {
        type: String,
        required: true,
    },
    // 알림 클릭 시 넘어갈 url
    url: {
        type: String,
        required: true,
    },
    // 알림 대상
    user: {
        type: ObjectId,
        ref: 'User',
        required: true,
    },
    created_at: {
        type: Date,
        requried: true,
        default: Date.now,
    },
});

const Notice = mongoose.model('Notice', noticeSchema);
export default Notice;