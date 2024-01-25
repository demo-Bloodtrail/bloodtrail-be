import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const { Types: { ObjectId } } = Schema;

const PostSchema = new Schema({
    writer: {
        id: {
            type: ObjectId,
            required: true,
            ref: "User",
        },
        nickname: String,
    },
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    image: {
        type: String, // S3 upload url
    },
    types: {
        type: String,
        required: true,
    },
    likes: {
        type: Number,
        default: 0,
    },
    status: {
        type: Boolean,
        default: true,
    },
    watch_count: {
        type: Number,
        default: 0,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    updated_at: {
        type: Date,
        default: Date.now,
    },
}, { versionKey: false } // 데이터 삽입 시 __v 칼럼 생성 X
);


const Post = mongoose.model("Post", PostSchema);
export default Post;