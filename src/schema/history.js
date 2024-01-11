import mongoose from "mongoose";

const { Schema } = mongoose;
const { Types: { ObjectId }, } = Schema;

const historySchema = new Schema({
    // 헌혈 타입 (전혈, 성분)
    type: {
        type: String,
        enum: ['WB', 'AP'],
        required: true,
    },
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
    updated_at: {
        type: Date,
        required: true,
        default: Date.now,
    },
});

const History = mongoose.model('History', historySchema);
export default History;