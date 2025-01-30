import express from 'express';
import { createProduct, deleteProduct, getProductById, getProducts, getProductsByCategory, getProductsByCategoryForHome, getProductsByUser, updateProduct } from '../controllers/product.controller.js';
// import { Product } from '../models/product.model.js';
import verifyToken  from '../middlewares/isAuthenthicated.js'
import parser from '../middlewares/uploadMiddleware.js';

const router = express.Router();

// router.route('/create-product').post(verifyToken , createProduct); // Apply middleware here
router.post("/create", parser.single("image"), createProduct);
router.route('/all-products').get(getProducts); // No need for authentication here, as this might be public
router.route('/:id').get(getProductById); // If needed, apply authentication for product details (optional)
router.route('/update-product/:id').put(parser.single("image"), updateProduct); // Apply middleware her
router.route('/delete-product/:id').delete(verifyToken, deleteProduct); // Apply middleware her
router.route('/home/:category').post(getProductsByCategoryForHome); // You can leave this public or apply middleware if needed
router.route('/:category').post(getProductsByCategory); 
router.route('/user/products').get(verifyToken, getProductsByUser);

export default router;
