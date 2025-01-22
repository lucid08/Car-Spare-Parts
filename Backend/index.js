import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoute from './routes/user.route.js';
import productRoute from './routes/product.route.js';
import cartRoute from './routes/cart.route.js';
import connectDB from './config/db.js';

dotenv.config({});

const app = express();
app.use('/uploads', express.static('uploads')); 
app.get("/home", (req, res) => {
    return res.status(200).json({
        message: "Welcome to the home page!",
        success:true
    });
});


const corsOptions = {
    origin: "http://localhost:5173",
    credentials: true,
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());
app.use(cors(corsOptions));
const PORT = process.env.PORT || 3000;

app.use("/api/v1/user",userRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/cart", cartRoute);

app.listen(PORT,() => { 
    connectDB();
    console.log(`listening on ${PORT}`);
});