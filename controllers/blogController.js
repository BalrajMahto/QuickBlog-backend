import fs from 'fs';
import ImageKit from 'imagekit';
import imagekit from '../configs/imageKit.js';
import Blog from '../models/Blog.js';

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