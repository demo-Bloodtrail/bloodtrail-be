import mongoose from 'mongoose';
const Schema = mongoose.Schema;


const ReportSchema = new Schema({
    type: {
        type: (String, Schema.Types.ObjectId),
        required: true,
    },
    claim_info: {
        type: (['UNHEALTHY', 'FINANCE', 'FRAUD', 'ABUSE', 'ETC'], Schema.Types.ObjectId),
        required: true,
    },
    claimer: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    created_at: {
        type: Date,
        required: true,
        defualt: Date.now,
    }

});

const Report = mongoose.model("Report", ReportSchema);
export default Report;