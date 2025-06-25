import fs from 'fs';
import ImageKit from 'imagekit';
import imagekit from '../configs/imageKit.js';
import Blog from '../models/Blog.js';
import Comment from '../models/Comment.js';



export const addBlog = async (req, res) => {
    try {
        const { title, subTitle, description, category, isPublished } = JSON.parse(req.body.blog);
        const imageFile = req.file ;
         //check if the all file is provided
        if (!title || !description || !category || !imageFile) {
            return res.status(400).json({ success:false, message: "All fields are required" });

        }

        const fileBuffer = fs.readFileSync(imageFile.path);

        // Upload the image to ImageKit
        const response = await imagekit.upload({
            file: fileBuffer, // the file buffer
            fileName: imageFile.originalname, // the name of the file
            folder: "/blog_images" // optional folder name
        });

        //optimize through imagekit
        const optimizedImageUrl = imagekit.url({
            path : response.filePath, // the path returned by ImageKit
            transformation: [{
                quality:'auto',
                format: 'webp',
                width:'1280',
            }]
        });

        await Blog.create({
            title,
            subTitle,
            description,
            category,
            image: optimizedImageUrl,
            isPublished
        });

        res.json({ success: true, message: "Blog added successfully" });
        

    } catch (error) {
        res.json({ success: false, message: error.message });

    }
}

export const getAllBlogs = async (req, res) => {
    try{
        const blogs = await Blog.find({ isPublished: true })
        res.json({ success: true, blogs });
    }
    catch (error) {
        res.json({ success: false, message: error.message });
    }
}

export const getBlogById = async (req, res) => {
    try {
        const { blogId } = req.params;
        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).json({ success: false, message: "Blog not found" });
        }
        res.json({ success: true, blog }); // <-- return the single blog
    }
    catch (error) {
        res.json({ success: false, message: error.message });
    }
}

export const deleteBlogById = async (req, res) => {
    try {
        const { id } = req.params;
        await Blog.findByIdAndDelete(id);

//delete all comments associated with the blog
        await Comment.deleteMany({ blog: id });

        res.json({ success: true, message: "Blog deleted successfully" });
    }
    catch (error) {
        res.json({ success: false, message: error.message });
    }

}

export const togglePublish = async (req, res) => {
    try {
        const { id } = req.params;
        const blog = await Blog.findById(id);
        blog.isPublished = !blog.isPublished;
        await blog.save();
        res.json({ success: true, message: "Blog publish status toggled successfully" });
    }
    catch (error) {
        res.json({ success: false, message: error.message });
    }
}


export const addComment = async (req, res) => {
    try{
        const{blog,name,content} = req.body;
        await Comment.create({
            blog,
            name,
            content,
            isApproved: false
        });
        res.json({ success: true, message: "Comment added successfully" });

    }catch (error) {
        res.json({ success: false, message: error.message });
    }

}

export const getBlogComments = async (req, res) => {
    try {
        const{blogId} = req.body;
        const comments = await Comment.find({ blog: blogId, isApproved: true }).sort({ createdAt: -1 });
    }
    catch (error) {
        res.json({ success: false, message: error.message });
    }
}
        