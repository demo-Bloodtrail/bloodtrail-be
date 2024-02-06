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
    },
    crew_leader: {
        type: ObjectId,
        ref: 'User',
        required: true,
    },
    crew_member: {
        type: [ObjectId],
        ref: 'User',
        required: true,
    },
    crew_count: { // 크루 인원수
        type: Number,
        required: true,
        default: 1,
    },
    // 목표 헌혈 포인트 & 참여율
    goal: {
        type: [Number], // (Number, Number)
        required: true,
    },
    // 현재 헌혈 포인트 & 참여율
    now: {
        type: [Number], // (Number, Number)
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    // 크루 채팅방
    chat: {
        type: String,
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