import mongoose from "mongoose";

const { Schema } = mongoose;
const { Types: { ObjectId }, } = Schema;

const historySchema = new Schema({
    // 헌혈 타입 (WB: 전혈, PB: 혈소판, PLB: 혈장)
    type: {
        type: String,
        enum: ['WB', 'PB', 'PLB'],
        required: true,
    },
    date: {
        type: Date,
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
  }, { versionKey: false } // 데이터 삽입 시 __v 칼럼 생성 X);
);
const History = mongoose.model('History', historySchema);
export default History;