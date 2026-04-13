const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '12361224',
  database: 'restaurant_db'
});

db.connect((err) => {
  if (err) { console.error('Database connection failed:', err); return; }
  console.log('Connected to MySQL database');
  initDB();
});

function initDB() {
  db.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(100) NOT NULL,
      role ENUM('user','admin') DEFAULT 'user'
    )
  `);

  db.query(`
    CREATE TABLE IF NOT EXISTS menu_items (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      description TEXT,
      price DECIMAL(10,2) NOT NULL,
      category VARCHAR(50),
      available BOOLEAN DEFAULT true
    )
  `);

  db.query(`
    CREATE TABLE IF NOT EXISTS orders (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      total DECIMAL(10,2) NOT NULL,
      status ENUM('pending','preparing','ready','delivered') DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  db.query(`
    CREATE TABLE IF NOT EXISTS order_items (
      id INT AUTO_INCREMENT PRIMARY KEY,
      order_id INT NOT NULL,
      menu_item_id INT NOT NULL,
      quantity INT DEFAULT 1,
      price DECIMAL(10,2) NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders(id),
      FOREIGN KEY (menu_item_id) REFERENCES menu_items(id)
    )
  `);

  db.query(`
    CREATE TABLE IF NOT EXISTS bookings (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      name VARCHAR(100) NOT NULL,
      date DATE NOT NULL,
      time VARCHAR(20) NOT NULL,
      guests INT NOT NULL,
      status ENUM('pending','confirmed','cancelled') DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  // Sample menu items
  db.query(`
    INSERT IGNORE INTO menu_items (id, name, description, price, category) VALUES
    (1, 'Margherita Pizza', 'Classic tomato and mozzarella', 12.99, 'Pizza'),
    (2, 'Pepperoni Pizza', 'Pepperoni with cheese', 14.99, 'Pizza'),
    (3, 'Chicken Burger', 'Grilled chicken burger', 9.99, 'Burgers'),
    (4, 'Beef Burger', 'Juicy beef patty', 11.99, 'Burgers'),
    (5, 'Caesar Salad', 'Fresh romaine lettuce', 7.99, 'Salads'),
    (6, 'Pasta Carbonara', 'Creamy pasta with bacon', 13.99, 'Pasta'),
    (7, 'Cheesecake', 'New York style cheesecake', 5.99, 'Desserts'),
    (8, 'Cola', 'Chilled soft drink', 2.99, 'Drinks')
  `);
}

// Auth
app.post('/api/register', (req, res) => {
  const { name, email, password } = req.body;
  db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
    [name, email, password], (err, result) => {
      if (err) return res.status(400).json({ error: 'Email already exists' });
      res.json({ message: 'Registered successfully', userId: result.insertId });
    });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  db.query('SELECT * FROM users WHERE email = ? AND password = ?',
    [email, password], (err, results) => {
      if (err || results.length === 0)
        return res.status(401).json({ error: 'Invalid email or password' });
      res.json({ message: 'Login successful', user: results[0] });
    });
});

// Menu
app.get('/api/menu', (req, res) => {
  const category = req.query.category || '';
  let query = 'SELECT * FROM menu_items WHERE available = true';
  const params = [];
  if (category) { query += ' AND category = ?'; params.push(category); }
  db.query(query, params, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.post('/api/menu', (req, res) => {
  const { name, description, price, category } = req.body;
  db.query('INSERT INTO menu_items (name, description, price, category) VALUES (?, ?, ?, ?)',
    [name, description, price, category], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Menu item added', id: result.insertId });
    });
});

app.delete('/api/menu/:id', (req, res) => {
  db.query('DELETE FROM menu_items WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Menu item deleted' });
  });
});

// Orders
app.post('/api/orders', (req, res) => {
  const { user_id, items, total } = req.body;
  db.query('INSERT INTO orders (user_id, total) VALUES (?, ?)',
    [user_id, total], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      const orderId = result.insertId;
      const orderItems = items.map(item => [orderId, item.id, item.quantity, item.price]);
      db.query('INSERT INTO order_items (order_id, menu_item_id, quantity, price) VALUES ?',
        [orderItems], (err2) => {
          if (err2) return res.status(500).json({ error: err2.message });
          res.json({ message: 'Order placed', orderId });
        });
    });
});

app.get('/api/orders/:userId', (req, res) => {
  db.query(`
    SELECT orders.*, 
    GROUP_CONCAT(menu_items.name SEPARATOR ', ') as items
    FROM orders
    LEFT JOIN order_items ON orders.id = order_items.order_id
    LEFT JOIN menu_items ON order_items.menu_item_id = menu_items.id
    WHERE orders.user_id = ?
    GROUP BY orders.id
    ORDER BY orders.created_at DESC
  `, [req.params.userId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Bookings
app.post('/api/bookings', (req, res) => {
  const { user_id, name, date, time, guests } = req.body;
  db.query('INSERT INTO bookings (user_id, name, date, time, guests) VALUES (?, ?, ?, ?, ?)',
    [user_id, name, date, time, guests], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Table booked!', id: result.insertId });
    });
});

app.get('/api/bookings/:userId', (req, res) => {
  db.query('SELECT * FROM bookings WHERE user_id = ? ORDER BY created_at DESC',
    [req.params.userId], (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    });
});

const PORT = 3003;
app.listen(PORT, () => console.log(`Restaurant server running on port ${PORT}`));
