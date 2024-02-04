import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const { Types: { ObjectId } } = Schema;

const ReportSchema = new Schema({
    claim_info: {
        target: {
            type: String,
            required: true,
        },
        reason: {
            type: String,
            required: true,
        }
    },
    post_id: {
        type: ObjectId,
        unique: false,
        ref: 'Post'
    },
    comment_id: {
        type: ObjectId,
        unique: false,
        ref: 'Comment'
    },
    chat_id: {
        type: ObjectId,
        unique: false,
        ref: 'Chat'
    },
    claimer: {
        type: ObjectId,
        required: true,
        unique: false,
        ref: 'User',
    },
    target_user: {
        type: ObjectId,
        unique: false,
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