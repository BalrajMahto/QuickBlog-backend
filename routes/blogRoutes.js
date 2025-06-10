import express from 'express';
import { addBlog } from '../controllers/blogController.js';
import upload from '../middlewares/multer.js'; // Assuming you have a middleware for handling file uploads
import auth from '../middlewares/auth.js';

const blogRouter = express.Router();

blogRouter.post('/add',upload.single('image'), auth,addBlog);

export default blogRouter 