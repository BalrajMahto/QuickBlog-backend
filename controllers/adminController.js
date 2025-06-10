import jwt from 'jsonwebtoken';


export const adminLogin = (req, res) => {
    try{
        const { email, password } = req.body;
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            // Generate JWT token
            const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1d' });
            return res.status(200).json({ token, message: "Login successful" });
        } else {
            return res.status(401).json({ message: "Invalid credentials" });
        }
    }catch (error) {
        console.error("Admin login error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}