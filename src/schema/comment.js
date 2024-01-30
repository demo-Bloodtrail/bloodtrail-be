import mongoose from 'mongoose';
const { Schema } = mongoose;
const { Types: { ObjectId } } = Schema;


const CommentSchema = new Schema({
  post: {
    type: ObjectId,
    required: true,
    ref: "Post",
  },
  commenter: {
    id: {
      type: ObjectId,
      required: true,
      ref: 'User'
    },
    nickname: String
  },
  comment: {
    type: String,
    required: true,
  },
  // report_count: {
  //   type: Number,
  //   default: true
  // },
  created_at: {
    type: Date,
    default: Date.now,
  },
}, { versionKey: false } // 데이터 삽입 시 __v 칼럼 생성 X
);

const Comment = mongoose.model("Comment", CommentSchema);
export default Comment;