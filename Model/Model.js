const mongoose = require("mongoose");
require("dotenv").config();
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Mongodb connected");
  })
  .catch((error) => {
    console.log(error);
  });

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "USER",
      enum: ["USER", "ADMIN"], // optional but good for restricting roles
    },
    profileImage: {
      public_url: {
        type: String,
        required: true,
      },
      secure_url: {
        type: String,
        required: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

const BlogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  blogImage: {
    secure_url: {
      type: String,
      required: true
    },
    public_url: {
      type: String,
      required: true
    }
  }
})

const commentSchema = new mongoose.Schema(
  {
    blog: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blogs',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Users',
      required: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const ReviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Users',
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

const ArticlesSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
}, {timestamps: true}
)

const UsersModel = mongoose.model("Users", UserSchema);
const BlogModel = mongoose.model('Blogs', BlogSchema)
const CommentsModel = mongoose.model('Comments', commentSchema)
const ReviewModel = mongoose.model('Reviews', ReviewSchema)
const ArticlesModel = mongoose.model('Articles', ArticlesSchema)

module.exports = {
  UsersModel,
  BlogModel,
  CommentsModel,
  ReviewModel,
  ArticlesModel

};
