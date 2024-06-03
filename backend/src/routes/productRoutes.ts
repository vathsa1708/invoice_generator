import express from 'express';
import Product from '../models/Product';

const router = express.Router();

// Route to save products
router.post('/products', async (req, res) => {
  try {
    const { userId, products } = req.body;

    await Product.insertMany(products.map((product: any) => ({ ...product, userId })));

    res.status(201).send('Products saved successfully');
  } catch (error) {
    console.error('Error saving products:', error);
    res.status(500).send('Error saving products');
  }
});

export default router;
