import { Cart } from "../models/cart.model.js";
import { Product } from "../models/product.model.js";
import { User } from "../models/user.model.js";
import { Order } from "../models/order.model.js";

export const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user.id;

  try {
    // Find the product by ID
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if the creator is attempting to add their own product to the cart
    if (product.creator.toString() === userId) {
      return res.status(403).json({
        message: "You cannot add your own product to the cart.",
      });
    }

    // Check if requested quantity exceeds stock
    if (quantity > product.stockQuantity) {
      return res.status(400).json({
        message: `Only ${product.stockQuantity} units of ${product.title} are available.`,
      });
    }

    // Find the user's cart or create a new one if it doesn't exist
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [], totalPrice: 0 });
    }

    // Check if the product already exists in the cart
    const existingItemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (existingItemIndex >= 0) {
      const existingItem = cart.items[existingItemIndex];
      const newQuantity = existingItem.quantity + quantity;

      // Check if the new quantity exceeds stock
      if (newQuantity > product.stockQuantity) {
        return res.status(400).json({
          message: `Adding this quantity exceeds stock for ${product.title}.`,
        });
      }

      // Update the quantity and recalculate totalPrice for the item
      existingItem.quantity = newQuantity;
      existingItem.totalPrice = existingItem.quantity * product.price;
    } else {
      // Add the new item to the cart
      cart.items.push({
        product: productId,
        quantity,
        price: product.price,
        totalPrice: quantity * product.price,
      });
    }

    // Recalculate the total price of the cart
    cart.totalPrice = cart.items.reduce(
      (total, item) => total + item.totalPrice,
      0
    );

    // Save the updated cart
    await cart.save();

    res.status(200).json({ message: "Item added to cart", cart });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ message: "Something went wrong", error });
  }
};


export const removeFromCart = async (req, res) => {
  const { productId } = req.body;
  const userId = req.user.id;

  try {
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    cart.totalPrice = cart.items.reduce((total, item) => total + item.price, 0);

    await cart.save();
    res.status(200).json({ message: "Item removed from cart", cart });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
};

export const getCart = async (req, res) => {
  const userId = req.user.id;

  try {
    const cart = await Cart.findOne({ user: userId }).populate("items.product"); // Populate product details if needed
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
};

export const updateCartItemQuantity = async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user.id;

  try {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const item = cart.items.find(
      (item) => item.product.toString() === productId
    );
    if (!item) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    item.quantity = quantity;
    item.price = quantity * (await Product.findById(productId)).price;

    cart.totalPrice = cart.items.reduce((total, item) => total + item.price, 0);
    await cart.save();

    res.status(200).json({ message: "Cart item updated", cart });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
};

export const clearCart = async (req, res) => {
  const userId = req.user.id;

  try {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = [];
    cart.totalPrice = 0;

    await cart.save();
    res.status(200).json({ message: "Cart cleared", cart });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
};

export const checkout = async (req, res) => {
  const userId = req.user.id;
  try {
    const cart = await Cart.findOne({ user: userId }).populate("items.product");
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Validate stock before proceeding with the checkout
    for (const item of cart.items) {
      const product = await Product.findById(item.product._id);
      if (!product || item.quantity > product.stockQuantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${product.title}. Available: ${product.stockQuantity}`,
        });
      }
    }

    // Deduct stock from products
    for (const item of cart.items) {
      const product = await Product.findById(item.product._id);
      product.stockQuantity -= item.quantity;
      await product.save();
    }

    const order = new Order({
      user: userId,
      items: cart.items,
      totalPrice: cart.totalPrice,
      shippingAddress: req.body.shippingAddress, // Example input
      status: "Pending",
    });

    await order.save();

    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();

    res.status(200).json({ message: "Order placed successfully", order });
  } catch (error) {
    console.log(error);
    
    res.status(500).json({ message: "Something went wrong", error});
  }
};

export const decrementCartItem = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming you have middleware to extract user info from the token
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ error: "Product ID is required" });
    }

    // Find the user's cart
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    // Find the item in the cart
    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ error: "Item not found in cart" });
    }

    // Get the item and price
    const item = cart.items[itemIndex];
    const itemPrice = item.price; // The price of the item

    // Ensure the item price is a valid number
    if (isNaN(itemPrice) || itemPrice <= 0) {
      return res.status(400).json({ error: "Invalid item price" });
    }

    // Decrement the quantity or remove the item
    if (item.quantity > 1) {
      item.quantity -= 1; // Decrease quantity
    } else {
      cart.items.splice(itemIndex, 1); // Remove the item if quantity is 0
    }

    // Recalculate the total price for this item (quantity * price)
    item.totalPrice = item.quantity * itemPrice;

    // Recalculate the total cart price
    const totalCartPrice = cart.items.reduce((acc, item) => {
      return acc + item.quantity * item.price; // Sum up each item's total price
    }, 0);

    // Update the cart's total price
    cart.totalPrice = totalCartPrice;

    // Save the updated cart
    const updatedCart = await cart.save();

    // Return the updated item or cart
    const updatedItem =
      updatedCart.items.find((item) => item.product.toString() === productId) ||
      null;

    res.status(200).json({
      message: "Item updated successfully",
      updatedItem,
      cart: updatedCart,
    });
  } catch (error) {
    console.error("Error updating cart:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
