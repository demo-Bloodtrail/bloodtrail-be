import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const { Types: { ObjectId } } = Schema;

// ReportType = ['UNHEALTHY', 'FINANCE', 'FRAUD', 'ABUSE', 'ETC'];

const ReportSchema = new Schema({
    info: {
        detail: {
            type: String,
            required: true
        },
        about: {
            type: String,
            required: true
        }
    },
    post_info: {
        type: ObjectId,
        ref: "Post"
    },
    chat_info: {
        type: ObjectId,
        ref: "Chat"
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