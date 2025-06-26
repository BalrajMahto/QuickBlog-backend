import jwt from 'jsonwebtoken';
import Blog from '../models/Blog.js';
import Comment from '../models/Comment.js';

// Admin login
export const adminLogin = (req, res) => {
    try {
        const { email, password } = req.body;
        if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD || !process.env.JWT_SECRET) {
            return res.status(500).json({ message: "Server misconfiguration: missing admin credentials or JWT secret." });
        }
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            // Add more data to the token payload
            const payload = {
                email,
                isAdmin: true,
                timestamp: Date.now()
            };
            const token = jwt.sign(payload, process.env.JWT_SECRET, { 
                expiresIn: '1d',
                algorithm: 'HS256'
            });
            return res.status(200).json({ success: true, token, message: "Login successful" });
        } else {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }
    } catch (error) {
        console.error("Admin login error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get all blogs for admin
export const getAllBlogsAdmin = async (req, res) => {
    try {
        const blogs = await Blog.find({}).sort({ createdAt: -1 });
        res.json({ success: true, blogs });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Get all comments
export const getAllComments = async (req, res) => {
    try {
        const comments = await Comment.find({}).populate("blog").sort({ createdAt: -1 });
        res.json({ success: true, comments });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Dashboard stats
export const getDashboard = async (req, res) => {
  
    try {
        const recentBlogs = await Blog.find({}).sort({ createdAt: -1 }).limit(5);
        const blogs = await Blog.countDocuments();
        const comments = await Comment.countDocuments();
        const drafts = await Blog.countDocuments({ isPublished: false });
        res.json({ success: true,  dashboardData: {recentBlogs,blog: blogs,comments,drafts} });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};


// Delete comment by ID
export const deleteCommentById = async (req, res) => {
    try {
        const { id } = req.body;
        await Comment.findByIdAndDelete(id);
        res.json({ success: true, message: "Comment deleted successfully" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Approve comment
export const approveComment = async (req, res) => {
    try {
        const { id } = req.body;
        const comment = await Comment.findById(id);
        if (!comment) {
            return res.status(404).json({ success: false, message: "Comment not found" });
        }
        comment.isApproved = true;
        await comment.save();
        res.json({ success: true, message: "Comment approved successfully" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

