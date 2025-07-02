const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const nodemailer = require('nodemailer');
const multer = require('multer');
const path = require('path');
require('dotenv').config(); // For managing environment variables

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Atlas Connection
mongoose.connect(process.env.MONGO_URI, {
    // These options work well with MongoDB Atlas
    serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
})
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => console.error('Could not connect to MongoDB Atlas:', err));

// Schemas
const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 }
});

const Counter = mongoose.model('Counter', counterSchema);

const drinkSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  category: String,
  imageUrl: String
});

const mainDishSchema = new mongoose.Schema({
  title: String,
  price: Number,
  imageSrc: String
});

const sideDishSchema = new mongoose.Schema({
  title: String,
  price: Number,
  imageSrc: String
});

const orderSchema = new mongoose.Schema({
  orderId: { type: String, default: () => Math.random().toString(36).substr(2, 9) },
  customerEmail: String,
  customerName: String,
  items: [{
    title: String,
    quantity: Number,
    price: Number,
    specialInstructions: String,
    spiceLevel: String,
    sugar: String,
    iced: Boolean,
    toppings: String
  }],
  total: Number,
  paymentMethod: String,
  status: {
    type: String,
    enum: ['pending', 'completed'],
    default: 'pending'
  },
  createdAt: { type: Date, default: Date.now }
});

// Models
const Drink = mongoose.model('Drink', drinkSchema);
const MainDish = mongoose.model('MainDish', mainDishSchema);
const SideDish = mongoose.model('SideDish', sideDishSchema);
const Order = mongoose.model('Order', orderSchema);

// Routes
app.get('/api/drinks', async (req, res) => {
  try {
    const drinks = await Drink.find();
    res.json(drinks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/main-dishes', async (req, res) => {
  try {
    const mainDishes = await MainDish.find();
    res.json(mainDishes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/side-dishes', async (req, res) => {
  try {
    const sideDishes = await SideDish.find();
    res.json(sideDishes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/orders', async (req, res) => {
    try {
        const orders = await Order.find();
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// CRUD endpoints for Drinks
app.post('/api/drinks', async (req, res) => {
    try {
        const drink = new Drink(req.body);
        const savedDrink = await drink.save();
        res.status(201).json(savedDrink);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.put('/api/drinks/:id', async (req, res) => {
    try {
        const updatedDrink = await Drink.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedDrink) {
            return res.status(404).json({ message: 'Drink not found' });
        }
        res.json(updatedDrink);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.delete('/api/drinks/:id', async (req, res) => {
    try {
        const deletedDrink = await Drink.findByIdAndDelete(req.params.id);
        if (!deletedDrink) {
            return res.status(404).json({ message: 'Drink not found' });
        }
        res.json({ message: 'Drink deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// CRUD endpoints for Main Dishes
app.post('/api/main-dishes', async (req, res) => {
    try {
        const mainDish = new MainDish(req.body);
        const savedMainDish = await mainDish.save();
        res.status(201).json(savedMainDish);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.put('/api/main-dishes/:id', async (req, res) => {
    try {
        const updatedMainDish = await MainDish.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedMainDish) {
            return res.status(404).json({ message: 'Main dish not found' });
        }
        res.json(updatedMainDish);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.delete('/api/main-dishes/:id', async (req, res) => {
    try {
        const deletedMainDish = await MainDish.findByIdAndDelete(req.params.id);
        if (!deletedMainDish) {
            return res.status(404).json({ message: 'Main dish not found' });
        }
        res.json({ message: 'Main dish deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// CRUD endpoints for Side Dishes
app.post('/api/side-dishes', async (req, res) => {
    try {
        const sideDish = new SideDish(req.body);
        const savedSideDish = await sideDish.save();
        res.status(201).json(savedSideDish);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.put('/api/side-dishes/:id', async (req, res) => {
    try {
        const updatedSideDish = await SideDish.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedSideDish) {
            return res.status(404).json({ message: 'Side dish not found' });
        }
        res.json(updatedSideDish);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.delete('/api/side-dishes/:id', async (req, res) => {
    try {
        const deletedSideDish = await SideDish.findByIdAndDelete(req.params.id);
        if (!deletedSideDish) {
            return res.status(404).json({ message: 'Side dish not found' });
        }
        res.json({ message: 'Side dish deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.patch('/order/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
        id,
        { status },
        { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Multer configuration for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== '.pdf') {
      return cb(new Error('Only PDFs are allowed'), false);
    }
    cb(null, true);
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB file size limit
});

// Nodemailer transporter
app.post('/api/send-order-email', upload.single('pdf'), async (req, res) => {
  try {
    const { customerEmail, orderId, customerName } = req.body;

    // Validate input
    if (!customerEmail || !req.file) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    let order;
    if (orderId) {
      order = await Order.findById(orderId);
      if (order) {
        order.customerEmail = customerEmail;
        await order.save();
      }
    }

    // Configure email transporter for Gmail with proper security settings
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // Use TLS
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD
      }
    });

    // Verify transporter connection
    await transporter.verify();

    // Prepare email content
    const mailOptions = {
      from: `"KaiXin Restaurant" <${process.env.EMAIL_USER}>`,
      to: customerEmail,
      subject: 'Your Order Confirmation from KaiXin',
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>Order Confirmation</title>
        </head>
        <body style="font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f4f4f4;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
                <div style="text-align: center; border-bottom: 2px solid #dc143c; padding-bottom: 20px; margin-bottom: 20px;">
                    <h1 style="color: #dc143c; margin: 0;">Order Confirmation</h1>
                </div>
                <div style="color: #333333;">
                    <p style="font-size: 16px;">Dear ${customerName || 'Valued Customer'},</p>
                    <p style="font-size: 16px;">Thank you for your order at KaiXin Restaurant! Your order receipt is attached to this email.</p>
                    <p style="font-size: 16px;">We are preparing your order with care and attention to detail.</p>
                </div>
                <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #dddddd; color: #777777;">
                    <p>&copy; 2024 KaiXin Restaurant. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
      `,
      attachments: [{
        filename: 'KaiXin_Receipt.pdf',
        content: req.file.buffer,
        contentType: 'application/pdf'
      }]
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.status(200).json({
      message: 'Email sent successfully',
      customerEmail: customerEmail
    });

  } catch (error) {
    console.error('Email sending error:', error);
    res.status(500).json({
      message: 'Failed to send order email',
      error: error.message
    });
  }
});

// Debug endpoint to check environment setup (remove in production)
app.get('/api/admin/debug', (req, res) => {
  res.json({
    mongoUriSet: !!process.env.MONGO_URI,
    emailUserSet: !!process.env.EMAIL_USER,
    emailPasswordSet: !!process.env.EMAIL_APP_PASSWORD,
    adminPasswordSet: !!process.env.ADMIN_PASSWORD,
    adminPasswordLength: process.env.ADMIN_PASSWORD?.length || 0,
    nodeEnv: process.env.NODE_ENV,
    port: process.env.PORT
  });
});

// Admin authentication endpoint
app.post('/api/admin/login', async (req, res) => {
  try {
    const { password } = req.body;

    console.log('Admin login attempt:');
    console.log('- Received password length:', password?.length || 0);
    console.log('- Expected password length:', process.env.ADMIN_PASSWORD?.length || 0);
    console.log('- Environment ADMIN_PASSWORD is set:', !!process.env.ADMIN_PASSWORD);

    if (!password) {
      console.log('- Error: No password provided');
      return res.status(400).json({ message: 'Password is required' });
    }

    // Check against environment variable
    if (password === process.env.ADMIN_PASSWORD) {
      console.log('- Success: Password match');
      res.status(200).json({ 
        success: true, 
        message: 'Authentication successful' 
      });
    } else {
      console.log('- Error: Password mismatch');
      res.status(401).json({ 
        success: false, 
        message: 'Invalid password' 
      });
    }
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    const { customerEmail, customerName, items, total, paymentMethod } = req.body;

    // Get the next sequence number
    const counter = await Counter.findByIdAndUpdate(
      { _id: 'orderId' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    const orderId = counter.seq.toString().padStart(5, '0');

    // Save order to database
    const newOrder = new Order({
      customerEmail,
      customerName,
      items,
      total,
      paymentMethod
    });
    await newOrder.save();

    res.status(201).json(newOrder);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Failed to create order', error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
