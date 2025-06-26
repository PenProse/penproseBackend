const { setUser } = require('../MiddleWares/Auth');
const {UsersModel, BlogModel, ReviewModel, CommentsModel, ArticlesModel} = require('../Model/Model')
const { cloudinary } = require('./CloudsConfig')
const bcrypt = require('bcrypt');

// hash password
const hashPassword = async (plainPassword) => {
    const saltRounds = 10;
    const hashed = await bcrypt.hash(plainPassword, saltRounds);
    return hashed;
};

// Compare password
const comparePassword = async (plainPassword, hashedPassword) => {
    const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
    return isMatch;
};

const handleSignup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const file = req.files?.file;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: 'Profile image is required',
      });
    }

    const existingUser = await UsersModel.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists',
      });
    }

    const hashedPassword = await hashPassword(password);

    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      folder: 'Users Images',
    });

    if (!result) {
      return res.status(500).json({
        success: false,
        message: 'Image upload failed',
      });
    }

    const newUser = new UsersModel({
      name,
      email,
      password: hashedPassword,
      profileImage: {
        public_url: result.public_id,
        secure_url: result.secure_url,
      },
    });

    await newUser.save();

    return res.status(201).json({
      success: true,
      message: 'Registered successfully',
    });
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal Server Error',
    });
  }
};

const handleLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await UsersModel.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Compare password
    const isMatch = await comparePassword(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Generate token
    const token = setUser(user);

    // Set cookie with Partitioned attribute manually
    res.setHeader('Set-Cookie', `uid=${token}; HttpOnly; Secure; SameSite=None; Partitioned; Path=/`);

    // Success
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      LoginUser: user,
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};


const handlePostBlog = async (req, res) => {
  try {
    const { title, description } = req.body;
    const file = req.files?.file;

    // Validate required fields
    if (!title || !description || !file) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, and image are required.',
      });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      folder: 'Blogs Images',
      use_filename: true,
      unique_filename: false,
    });

    // Create new blog entry
    const newBlog = new BlogModel({
      title,
      description,
      blogImage: {
        secure_url: result.secure_url,
        public_url: result.public_id,
      },
    });

    await newBlog.save();

    res.status(201).json({
      success: true,
      message: 'Blog posted successfully',
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Internal Server Error',
    });
  }
};

const handleShowBlogs = async (req, res) => {
  try {
    const Blogs = await BlogModel.find({})
    res.json({
      Blogs
    })
  } catch (error) {
    res.json({
      'message': error.message
    })
  }
}

const handleDeleteBlog = async (req, res) => {
  const id = req.params.id;

  try {
    const deleteBlog = await BlogModel.findByIdAndDelete(id);

    if (!deleteBlog) {
      return res.json({
        success: false,
        message: 'Blog not found',
      });
    }

    // Delete image from Cloudinary
    const result = await cloudinary.uploader.destroy(deleteBlog.blogImage.public_url);

    // Delete all related comments
    await CommentsModel.deleteMany({ blog: id });

    if (result.result === 'ok') {
      return res.json({
        success: true,
        message: 'Blog and related comments deleted successfully',
      });
    } else {
      return res.json({
        success: false,
        message: 'Blog deleted but image not removed from Cloudinary',
      });
    }

  } catch (error) {
    res.json({
      success: false,
      message: error.message || 'Internal Server Error',
    });
  }
};

const handlePostComment = async (req, res) => {
  const { blogid, userid, comment } = req.body;

  if (!blogid || !userid || !comment) {
    return res.status(400).json({
      success: false,
      message: 'All fields (blogid, userid, comment) are required.',
    });
  }

  try {
    const newComment = new CommentsModel({
      blog: blogid,
      user: userid,
      text: comment,
    });

    await newComment.save();

    return res.status(201).json({
      success: true,
      message: 'Comment successfully posted.',
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error.',
    });
  }
};

const handleShowComments = async (req, res) => {
  const blogId = req.params.id;

  try {
    const comments = await CommentsModel.find({ blog: blogId })
      .populate('user') // you can add fields like 'avatar' too
      .sort({ createdAt: -1 }); // optional: newest comments first

    res.status(200).json({
      success: true,
      comments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch comments',
    });
  }
};

const handleDeleteComment = async(req, res) => {
  const id = req.params.id

  try {
    const deleteComment = await CommentsModel.findByIdAndDelete(id)
    if(deleteComment) {
      res.json({
        'success': true,
        'message': 'Comment deleted Successfully'
      })
    }
  } catch (error) {
    res.json({
      'success': false,
      'message': error.message || 'Internal Server Error'
    })
  }

}


const handlePostReview = async(req, res) => {
  try {
    const { rating, message, userId } = req.body;
    // Validate inputs
    if (!userId || !rating || !message?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
      });
    }

    // Check if the user has already submitted a review
    const existingReview = await ReviewModel.findOne({ user: userId });

    if (existingReview) {
      return res.status(409).json({
        success: false,
        message: 'You have already given us a rating. Thank you!',
      });
    }

    // Create and save new review
    const newReview = await ReviewModel.create({
      user: userId,
      rating,
      comment: message,
    });

    return res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      review: newReview,
    });

  } catch (error) {
    console.error('Error posting review:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};

const handleShowReviews = async(req, res) => {
  try {
    const Reviews = await ReviewModel.find({}).populate('user')
    res.json({
      Reviews
    })
  } catch (error) {
    res.json({
      'message': error.message
    })
  }
}

const handleDeleteReview = async (req, res) => {
  const reviewId = req.params.id;

  try {
    const deletedReview = await ReviewModel.findByIdAndDelete(reviewId);

    if (!deletedReview) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting review:', error.message);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};

const handleShowUsers = async(req, res) => {
  try {
    const Users = await UsersModel.find({})
    res.json({
      Users
    })
  } catch (error) {
    res.json({
      'message': error.message
    })
  }
}

const handleDeleteUser = async (req, res) => {
  const userId = req.params.id;

  try {
    // Check if user exists
    const user = await UsersModel.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Prevent deletion if the user is an ADMIN
    if (user.role === 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Cannot delete admin user' });
    }

    // Delete user's image from Cloudinary if available
    const publicId = user.profileImage?.public_url;
    if (publicId) {
      await cloudinary.uploader.destroy(publicId);
    }

    // Delete all comments made by the user
    await CommentsModel.deleteMany({ user: userId });

    // Delete all reviews made by the user
    await ReviewModel.deleteMany({ user: userId });

    // Delete the user
    await UsersModel.findByIdAndDelete(userId);

    res.json({
      success: true,
      message: 'User, their image, comments, and reviews deleted successfully',
    });

  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ success: false, message: 'Server error while deleting user' });
  }
};

const handlePostArticle = async (req, res) => {
  const { title, description } = req.body;

  // Basic validation
  if (!title || !description) {
    return res.status(400).json({
      success: false,
      message: 'Title and description are required.',
    });
  }

  try {
    const newArticle = await ArticlesModel.create({ title, description });

    return res.status(201).json({
      success: true,
      message: 'Article posted successfully.',
    });
  } catch (error) {
    console.error('Error posting article:', error.message);

    return res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again later.',
    });
  }
};

const handleShowArticles = async(req, res) => {
  try {
    const Articles = await ArticlesModel.find({})
    res.json({
      Articles
    })
  } catch (error) {
    res.json({
      'message': error.message
    })
  }
}

const handleDelelteArticle = async (req, res) => {
  const id = req.params.id

  try {
    const deleteArticle = await ArticlesModel.findByIdAndDelete(id)
    if(deleteArticle) {
      res.json({
        'success': true,
        'message': 'Article Deleted Successfully'
      })
    }
  } catch (error) {
    res.json({
      'success': false,
      'message': 'Something Went Wrong'
    })
  }

}







module.exports = {
    handleSignup,
    handleLogin,
    handlePostBlog,
    handleShowBlogs,
    handleDeleteBlog,
    handlePostComment,
    handleShowComments,
    handleDeleteComment,
    handlePostReview,
    handleShowReviews,
    handleDeleteReview,
    handleShowUsers,
    handleDeleteUser,
    handlePostArticle,
    handleShowArticles,
    handleDelelteArticle
}