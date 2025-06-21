import express from 'express';
import { addBlog, addComment, deleteBlogById, getAllBlogs, getBlogById, getBlogComments, toggelePublish } from '../controllers/blogController.js';
import upload from '../middlewares/multer.js'; // Assuming you have a middleware for handling file uploads
import auth from '../middlewares/auth.js';



const blogRouter = express.Router();

blogRouter.post('/add',upload.single('image'), auth,addBlog);
blogRouter.get('/all', getAllBlogs);
blogRouter.get('/:blogId', getBlogById);
blogRouter.post('/delete', deleteBlogById);
blogRouter.post('/toggle-publish/:id', auth, toggelePublish);

blogRouter.post('/add-comment', addComment);
blogRouter.post('/comments', getBlogComments);





export default blogRouter