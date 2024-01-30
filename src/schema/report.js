import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const { Types: { ObjectId } } = Schema;

// const claim_type = ['UNHEALTHY', 'FINANCE', 'FRAUD', 'ABUSE', 'ETC'];

const ReportSchema = new Schema({
    claim_info: {
        target: {
            type: String,
            required: true,
        },
        reaseon: {
            type: String,
            required: true,
        }
    },
    post_id: {
        type: ObjectId,
        required: true,
        unique: true,
        ref: 'Post'
    },
    comment_id: {
        type: ObjectId,
        required: true,
        unique: true,
        ref: 'Comment'
    },
    claimer: {
        type: ObjectId,
        required: true,
        ref: 'User',
    },
    created_at: {
        type: Date,
        defualt: Date.now,
    },
}, { versionKey: false } // 데이터 삽입 시 __v 칼럼 생성 X
);

const Report = mongoose.model("Report", ReportSchema);
export default Report;