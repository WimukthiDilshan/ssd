require('dotenv').config(); // Load environment variables from .env
const mysql = require('mysql2');
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { execFile } = require('child_process');
const path = require('path');

const cron = require('node-cron');



const userRoutes = require("./route/UserRoutes");
const feedbackRoutes = require("./route/FeedbackRoutes");
const inventoryItemRoutes = require("./route/InventoryItemRoutes");
const purchaseRoutes = require("./route/PurchaseRoutes");
const inventoryStockRoutes = require("./route/InventoryStockRoutes");
const productRoutes = require("./route/ProductRoutes");
const InventoryReleaseRoutes = require("./route/InventoryReleaseRoutes");
const OrderRoutes = require("./route/OrderRoutes");
const productLogRoutes = require("./route/ProductLogRoutes");
const recipeRoutes = require("./route/recipeRoutes");
const paymentRoutes = require("./route/paymentRoutes");
const saleRoutes = require("./route/saleRoutes");
const productInventoryReleaseRoutes = require("./route/ProductInventoryReleaseRoutes");
const predictSalesRoute = require('./route/predictSales');

const app = express();

app.disable('x-powered-by');
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Referrer-Policy', 'no-referrer');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    next();
});

// Other middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// CORS configuration - Must be before other middleware
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
  }));

// Create MySQL Connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

const PORT = process.env.PORT || 3000;

// Connect to MySQL
db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('Connected to MySQL Database');
});

// Pass `db` to routes
app.use((req, res, next) => {
    req.db = db;
    next();
});

// Routes
app.use("/api/users", userRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/inventory-items", inventoryItemRoutes);
app.use("/api/purchases", purchaseRoutes);
app.use("/api/inventory-stocks", inventoryStockRoutes);
app.use("/api/products", productRoutes);
app.use("/api/inventory-releases", InventoryReleaseRoutes);
app.use("/api/orders", OrderRoutes);
app.use("/api/production-logs", productLogRoutes);
app.use("/api/recipes", recipeRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/sales", saleRoutes);
app.use("/api/production-inventory-releases", productInventoryReleaseRoutes);
app.use('/api', predictSalesRoute);


const { authenticateUser, authorizeRole } = require('./middleware/AuthMiddleware');
const aiAccess = [authenticateUser, authorizeRole(['admin', 'manager'])];
const aiScript = (filename) => path.resolve(__dirname, 'AI_MODEL_REAL_ONE', filename);
const pythonExecutable = process.env.PYTHON_EXECUTABLE || (process.platform === 'win32' ? 'python' : 'python3');
const validDate = (value) => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`)) && new Date(`${value}T00:00:00Z`).toISOString().slice(0, 10) === value;

app.get('/train-model', ...aiAccess, (req, res) => {
  execFile(pythonExecutable, [aiScript('train_model.py')], { timeout: 10 * 60 * 1000 }, (err, stdout, stderr) => {
    if (err) {
      console.error('Model training failed:', stderr || err.message);
      return res.status(500).json({ error: 'Model training failed' });
    }
    console.log(stdout);
    res.json({ message: 'Model trained successfully!' });
  });
});

app.get('/predict', ...aiAccess, (req, res) => {
  const { date } = req.query;
  if (!validDate(date)) return res.status(400).json({ error: 'A valid date in YYYY-MM-DD format is required' });
  execFile(pythonExecutable, [aiScript('predict.py'), date], { timeout: 60 * 1000 }, (err, stdout, stderr) => {
    if (err) {
      console.error('Sales prediction failed:', stderr || err.message);
      return res.status(500).json({ error: 'Prediction failed' });
    }
    try {
      res.json(JSON.parse(stdout));
    } catch (error) {
      res.status(500).json({ error: 'Failed to parse model response' });
    }
  });
});

// Deployment files do not define a timezone; schedule explicitly uses Asia/Colombo.
cron.schedule('0 2 * * *', () => {
  execFile(pythonExecutable, [aiScript('train_model.py')], { timeout: 10 * 60 * 1000 }, (err, stdout, stderr) => {
    if (err) {
      console.error('Scheduled model training failed:', stderr || err.message);
      return;
    }
    console.log('Scheduled model training completed:', stdout);
  });
}, { timezone: 'Asia/Colombo' });
// Start Express Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});

// Close the connection when the app exits
process.on("SIGINT", () => {
    db.end((err) => {
        if (err) console.log("Error closing MySQL connection:", err);
        console.log("MySQL connection closed.");
        process.exit();
    });
});

