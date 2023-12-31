const express = require('express');
const router = express.Router();
const C_products  = require('../controllers/products'); 
const Products = require('../data/products'); 
const adminAuthMiddleware = require('../middleware/adminAuth'); // Import your admin authentication middleware


router.get('/api/average-prices', C_products.getAveragePricesByCategory);

// get all products 
router.get("/api/store-products", (req, res) => {
    C_products.getAll()
      .then((data) => {
        res.json(data);
      })
      .catch((error) => {
        console.error('Error fetching store products data:', error);
        res.status(500).json({ error: 'Failed to fetch store products' });
      });
  });

 // Get details for a single product by ID
router.get("/api/store-products/:productId", (req, res) => {
  const productId = req.params.productId;
  
  C_products.getProductById(productId)
    .then((product) => {
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json(product);
    })
    .catch((error) => {
      console.error('Error fetching product details:', error);
      res.status(500).json({ error: 'Failed to fetch product details' });
    });
}); 

// update a product 
router.put("/api/store-products/:productId", adminAuthMiddleware, async (req, res) => {
  const productId = req.params.productId;
  const updatedProductData = req.body;
  try {
      const updatedProduct = await C_products.updateProduct(productId, updatedProductData);
      res.json({ message: 'Product updated successfully', product: updatedProduct });
  } catch (error) {
      console.error('Error updating product:', error);
      res.status(500).json({ error: 'Failed to update product' });
  }
});

// delete a product
router.delete('/api/store-products/:productId', adminAuthMiddleware, async (req, res) => {
  const productId = req.params.productId;
  try {
    const deletedProduct = await C_products.deleteProduct(productId);
    if (deletedProduct) {
      res.json({ success: true, message: 'Product deleted successfully' });
    } else {
      res.status(404).json({ success: false, message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting product' });
  }
});

// Add a single product manually
router.post('/api/store-products', adminAuthMiddleware, async (req, res) => {
    const { name, image, brand, category, price, countInStock, rating, numReviews, description, color,popularity} = req.body;
  
    try {
      const newProduct = await C_products.addProduct(name, image, brand, category, price, countInStock, rating, numReviews, description, color,popularity);
      res.json({ message: 'Product added successfully', product: newProduct });
    } catch (error) {
      console.error('Error adding product:', error);
      res.status(500).json({ error: 'Failed to add product' });
    }
  });
  
  // Add products from data file
  router.post('/api/store-products/bulk', async (req, res) => {
    try {
      const result = await C_products.addProductsFromData(Products); // Use your products data file
      res.json(result);
    } catch (error) {
      console.error('Error adding products from data:', error);
      res.status(500).json({ error: 'Failed to add products from data' });
    }
  });

module.exports = router;