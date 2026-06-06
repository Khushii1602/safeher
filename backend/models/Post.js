import mongoose from "mongoose"

const commentSchema = new mongoose.Schema(
  {
    // We store a random anonymous name, not the real user
    anonName: { type: String, required: true },
    content:  { type: String, required: true, trim: true },
    userId:   { type: String, required: true },
  },
  { timestamps: true }
)

const postSchema = new mongoose.Schema(
  {
    // Never store real name — only anonymous name
    anonName: {
      type: String,
      required: true,
    },
    // We store userId only to prevent double-liking
    // Never expose this in API responses
    userId: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: [true, "post content is required"],
      trim: true,
      maxlength: [1000, "post cannot exceed 1000 characters"],
    },
    category: {
      type: String,
      required: true,
      enum: [
        "seeking support",
        "sharing my story",
        "legal question",
        "safety tip",
        "mental health",
        "celebrating wins",
        "general",
      ],
    },
    likes: {
      // Array of userIds who liked — prevents double likes
      type: [String],
      default: [],
    },
    comments: {
      type: [commentSchema],
      default: [],
    },
    isModerated: {
      // True if flagged for review
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
)

const Post = mongoose.model("Post", postSchema)
export default Post