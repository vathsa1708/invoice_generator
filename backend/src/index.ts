import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productRoutes';
import invoiceRoutes from './routes/invoiceRoutes';

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = 'mongodb://localhost:27017/invoice-generator';

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', authRoutes);
app.use('/api', productRoutes);
app.use('/api', invoiceRoutes);

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });
