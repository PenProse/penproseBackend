const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const fileUpload = require("express-fileupload");
const cors = require('cors')
const app = express();
require('dotenv').config()

const PORT = process.env.PORT;

// middlewares
app.use(cors({
  origin: "https://penprose.github.io",
  credentials: true,
  methods: ['POST', 'DELETE', 'GET']
}))
app.use(bodyParser.json()); // Parse JSON request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(fileUpload({useTempFiles: true}));

// importing routes
const signup = require('./Views/Signup')
const Login = require('./Views/Login');
const logout = require('./Views/Logout')
const verifyLogin = require('./Views/VerifyLogin')
const blogPost = require('./Views/PostBlog')
const showBlogs = require('./Views/ShowBlogs')
const DeleteBlog = require('./Views/DeleteBlog')
const postComment = require('./Views/PostComment')
const showComments = require('./Views/ShowComments')
const deleteComment = require('./Views/DeleteComment')
const PostReview = require('./Views/PostReview')
const showReviews = require('./Views/ShowReviews')
const deleteReview = require('./Views/DeleteReview')
const showUsers = require('./Views/ShowUsers')
const deleteUser = require('./Views/DeleteUser')

// Routes
app.get('/', (req, res) => {
  res.send('Middlewares are working!');
});

// non protected routes
app.use('/api', signup)
app.use('/api', showBlogs)
app.use('/api', Login)
app.use('/api', showComments)
app.use('/api', showReviews)

// protected routes
app.use('/api', verifyLogin)
app.use('/api', logout)
app.use('/api', blogPost)
app.use('/api', DeleteBlog)
app.use('/api', postComment)
app.use('/api', deleteComment)
app.use('/api', PostReview)
app.use('/api', deleteReview)
app.use('/api', showUsers)
app.use('/api', deleteUser)






app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
