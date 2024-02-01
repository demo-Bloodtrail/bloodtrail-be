import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const { Types: { ObjectId } } = Schema;

// const PostType = ['FREE', 'HONOR', 'CERTIFIY', 'INFO'];

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
        type: [String], // S3 upload url
    },
    types: {
        type: String,
        required: true,
    },
    like_users: [{ // 좋아요를 누를 때 접속자의 아이디에 따라 리스트에 추가하여 좋아요를 취소할 경우 조회하여 해결
        type: ObjectId,
        default: [],
        ref: "User",
    }],
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