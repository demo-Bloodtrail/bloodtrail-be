import mongoose from "mongoose";

const { Schema } = mongoose;
const { Types: { ObjectId }, } = Schema;

const crewSchema = new Schema({
    crew_name: {
        type: String,
        required: true,
    },
    crew_image: {
        type: String,
        required: true,
    },
    crew_leader: {
        type: String,
        required: true,
    },
    crew_member: {
        type: [ObjectId],
        ref: 'User',
        required: true,
    },
    crew_count: {
        type: Number,
        required: true,
        default: 1,
    },
    // 목표 헌혈 포인트
    goal: {
        type: [Number], // (Number, Number)
        required: true,
    },
    // 현재 헌혈 포인트
    now: {
        type: [Number], // (Number, Number)
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

const Crew = mongoose.model('Crew', crewSchema);
export default Crew;