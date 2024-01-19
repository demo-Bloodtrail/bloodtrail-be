import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const { Types: { ObjectId } } = Schema;

const ReportSchema = new Schema({
    type: {
        type: (String, ObjectId),
        required: true,
    },
    claim_info: {
        type: (['UNHEALTHY', 'FINANCE', 'FRAUD', 'ABUSE', 'ETC'], ObjectId),
        required: true,
    },
    claimer: {
        type: ObjectId,
        required: true,
        ref: 'User',
    },
    created_at: {
        type: Date,
        required: true,
        defualt: Date.now,
    },
}, { versionKey: false } // 데이터 삽입 시 __v 칼럼 생성 X
);

const Report = mongoose.model("Report", ReportSchema);
export default Report;