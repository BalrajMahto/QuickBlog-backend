import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import connectDB from './configs/db.js';
import { Admin } from 'mongodb';
import adminRouter from './routes/adminRoutes.js';
import blogRouter from './routes/blogRoutes.js';





const app = express();
await connectDB()

//middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use('/api/admin', adminRouter);
app.use('/api/blog', blogRouter);


const PORT = process.env.PORT || 5000;


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Export the app for testing purposes
export default app;