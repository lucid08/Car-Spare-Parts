import express from "express";
// import { Product } from '../models/product.model.js';
import verifyToken from "../middlewares/isAuthenthicated.js";
import { addToCart, checkout, clearCart, decrementCartItem, getCart, removeFromCart, updateCartItemQuantity } from "../controllers/cart.controller.js";

const router = express.Router();
router.route("/add").post(verifyToken, addToCart);
router.route("/remove-item").delete(verifyToken, removeFromCart);
router.route("/get-cart").get(verifyToken, getCart);
router.route("/update-item").put(verifyToken, updateCartItemQuantity);
router.route("/clear-cart").delete(verifyToken, clearCart);
router.route("/checkout").post(verifyToken, checkout);
router.route("/decrement-item").patch(verifyToken, decrementCartItem);
export default router;
