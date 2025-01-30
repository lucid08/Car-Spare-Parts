import cloudinary from "../config/cloudinaryConfig.js";
import { Product } from "../models/product.model.js";
import jwt from "jsonwebtoken";

export const createProduct = async (req, res) => {
  try {
    const { title, price, description, stockQuantity, category } = req.body;
    
    // Validate input fields (image will now come from `req.file`)
    if (!title || !price || !description || !stockQuantity || !category) {
      return res
        .status(400)
        .json({ message: "All fields are required except image" });
    }

    // Handle image upload
    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }
    const filePath = req.file.path;
    const uploadResult = await cloudinary.uploader
      .upload(filePath, {
        folder: "product",
      })
      .catch((error) => {
        console.log(error);
      });


    // Extract the JWT token from the authorization header
    const token = req.headers.authorization?.split(" ")[1]; // Bearer token
    if (!token) {
      return res
        .status(401)
        .json({ message: "Authorization token is required" });
    }

    // Verify and decode the token to get the userId
    let decodedToken;
    try {
      decodedToken = jwt.verify(token, process.env.JWT_SECRET); // Replace with your secret key
    } catch (error) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
    const userId = decodedToken.id; // Assuming `userId` is stored in the JWT

    // Create a new product instance with the creator field
    const newProduct = new Product({
      title,
      price,
      description,
      stockQuantity,
      category,
      image: uploadResult.secure_url, // Use the uploaded image path
      creator: userId, // Set the creator to the logged-in user's ID
    });

    // Save the product to the database
    const savedProduct = await newProduct.save();

    res.status(201).json({
      message: "Product created successfully",
      product: savedProduct,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to create product",
      error: error.message,
    });
  }
};

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json({ products });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch products", error: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ product });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch product", error: error.message });
  }
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;

  // Extract the token from the Authorization header
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Authorization token is required" });
  }

  try {
    // Verify and decode the token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.id; // Assuming `userId` is in the token payload

    // Fetch the product by ID
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if the user is the creator of the product
    if (product.creator.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Unauthorized to update this product" });
    }

    // Handle image upload if a new file is provided
    if (req.file) {
      const filePath = req.file.path;

      // Upload new image to Cloudinary
      const uploadResult = await cloudinary.uploader.upload(filePath, {
        folder: "product",
      });

      // Delete the old image from Cloudinary
      const oldImagePublicId = product.image.split("/").slice(-2).join("/").split(".")[0];
      await cloudinary.uploader.destroy(oldImagePublicId);

      // Update the image URL in the request body
      req.body.image = uploadResult.secure_url;
    }

    // Update the product fields
    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    // Return the updated product
    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  // Extract the token from the Authorization header
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Authorization token is required" });
  }

  try {
    // Verify and decode the token
    let decodedToken;
    try {
      decodedToken = jwt.verify(token, process.env.JWT_SECRET); // Ensure JWT_SECRET is set in your environment
    } catch (error) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    const userId = decodedToken.id; // Assuming `id` represents the user ID in the token payload
    console.log("User ID from token:", userId);

    // Fetch the product by ID
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    if (product.creator === undefined) {
      return res
        .status(403)
        .json({
          message: "Unauthorized: Only the creator can delete this product",
        });
    }

    console.log("Product creator ID:", product.creator.toString());

    // Check if the user is the creator of the product
    if (product.creator.toString() !== userId) {
      return res
        .status(403)
        .json({
          message: "Unauthorized: Only the creator can delete this product",
        });
    }

    // Delete the product
    await product.deleteOne();

    // Respond with a success message
    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const searchProducts = async (req, res) => {
  try {
    const { query } = req.query;
    const products = await Product.find({
      $text: { $search: query },
    });
    res.status(200).json({ products });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to search products", error: error.message });
  }
};

export const getProductsByCategoryForHome = async (req, res) => {
  try {
    const { category } = req.params; // Extract category from route parameter
    console.log("Category from params:", category);

    const products = await Product.find({ category }).limit(3);

    if (!products) {
      return res.status(404).json({ message: "No products found" });
    }

    return res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return res
      .status(500)
      .json({ message: "Failed to fetch product", error: error.message });
  }
};

export const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params; // Extract category from route parameter
    console.log("Category from params:", category);

    const products = await Product.find({ category });

    if (!products) {
      return res.status(404).json({ message: "No products found" });
    }

    return res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return res
      .status(500)
      .json({ message: "Failed to fetch product", error: error.message });
  }
};

export const getProductsByUser = async (req, res) => {
  try {
    // Get the userId from the request (e.g., from req.user or query params)
    const userId = req.user.id; // Assuming authentication middleware sets req.user

    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }
console.log(userId);

    // Fetch products created by the user
    const products = await Product.find({ creator: userId });

    // Check if products exist
    if (!products || products.length === 0) {
      return res.status(404).json({ message: "No products found for this user." });
    }

    // Return the products
    res.status(200).json({ products });
  } catch (error) {
    console.error("Error fetching products:", error.message);
    res.status(500).json({ message: "Server error. Unable to fetch products." });
  }
};