import mongoose from 'mongoose';
const Schema = mongoose.Schema;


const PostSchema = new Schema({
    writer: {
        type: Schema.Types.ObjectId, // 확인해보기
        required: true,
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
        type: ['FREE', 'HONOR', 'CERTIFIY', 'INFO'],
        required: true,
    },
    likes: {
        type: Number,
        required: true,
        default: 0,
    },
    status: {
        type: Boolean,
        required: true,
        default: true,
    },
    watch_count: {
        type: Number,
        required: true,
        default: 0,
    },
    created_at: {
        type: Date,
        required: true,
        defualt: Date.now,
    },
    updated_at: {
        type: Date,
        required: true,
        defualt: Date.now,
    },
});


const Post = mongoose.model("Post", PostSchema);
export default Post;