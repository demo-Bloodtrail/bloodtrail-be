import mongoose from 'mongoose';
const { Schema } = mongoose;
const { Types: { ObjectId } } = Schema;


const CommentSchema = new Schema({
  commenter: {
    type: ObjectId,
    required: true,
    ref: 'User',
  },
  comment: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});


const Comment = mongoose.model("Comment", CommentSchema);
export default Comment;