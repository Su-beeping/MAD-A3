const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '12361224',
  database: 'ecommerce_db'
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
    return;
  }
  console.log('Connected to MySQL database');
  initDB();
});

// Create tables if they don't exist
function initDB() {
  db.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(100) NOT NULL,
      role ENUM('user','admin') DEFAULT 'user',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.query(`
    CREATE TABLE IF NOT EXISTS products (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      description TEXT,
      price DECIMAL(10,2) NOT NULL,
      image_url VARCHAR(255),
      stock INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.query(`
    CREATE TABLE IF NOT EXISTS cart (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      product_id INT NOT NULL,
      quantity INT DEFAULT 1,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (product_id) REFERENCES products(id)
    )
  `);

  // Insert sample products
  db.query(`
    INSERT IGNORE INTO products (id, name, description, price, image_url, stock) VALUES
    (1, 'Laptop', 'High performance laptop', 999.99, 'https://via.placeholder.com/200', 10),
    (2, 'Phone', 'Latest smartphone', 699.99, 'https://via.placeholder.com/200', 20),
    (3, 'Headphones', 'Noise cancelling headphones', 199.99, 'https://via.placeholder.com/200', 15),
    (4, 'Keyboard', 'Mechanical keyboard', 89.99, 'https://via.placeholder.com/200', 30),
    (5, 'Mouse', 'Wireless mouse', 49.99, 'https://via.placeholder.com/200', 25)
  `);
}

// ---- USER ROUTES ----

// Register
app.post('/api/register', (req, res) => {
  const { name, email, password } = req.body;
  db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
    [name, email, password],
    (err, result) => {
      if (err) return res.status(400).json({ error: 'Email already exists' });
      res.json({ message: 'User registered successfully', userId: result.insertId });
    });
});

// Login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  db.query('SELECT * FROM users WHERE email = ? AND password = ?',
    [email, password],
    (err, results) => {
      if (err || results.length === 0)
        return res.status(401).json({ error: 'Invalid email or password' });
      res.json({ message: 'Login successful', user: results[0] });
    });
});

// ---- PRODUCT ROUTES ----

// Get all products
app.get('/api/products', (req, res) => {
  db.query('SELECT * FROM products', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Add product (admin)
app.post('/api/products', (req, res) => {
  const { name, description, price, image_url, stock } = req.body;
  db.query('INSERT INTO products (name, description, price, image_url, stock) VALUES (?, ?, ?, ?, ?)',
    [name, description, price, image_url, stock],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Product added', productId: result.insertId });
    });
});

// Delete product (admin)
app.delete('/api/products/:id', (req, res) => {
  db.query('DELETE FROM products WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Product deleted' });
  });
});

// ---- CART ROUTES ----

// Get cart for a user
app.get('/api/cart/:userId', (req, res) => {
  db.query(`
    SELECT cart.id, products.name, products.price, products.image_url, cart.quantity
    FROM cart
    JOIN products ON cart.product_id = products.id
    WHERE cart.user_id = ?
  `, [req.params.userId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Add to cart
app.post('/api/cart', (req, res) => {
  const { user_id, product_id, quantity } = req.body;
  db.query('INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)',
    [user_id, product_id, quantity || 1],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Added to cart' });
    });
});

// Remove from cart
app.delete('/api/cart/:id', (req, res) => {
  db.query('DELETE FROM cart WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Removed from cart' });
  });
});

const PORT = 3001;
app.listen(PORT, () => console.log(`E-Commerce server running on port ${PORT}`));
