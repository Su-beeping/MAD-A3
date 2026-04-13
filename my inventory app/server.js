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
  database: 'inventory_db'
});

db.connect((err) => {
  if (err) { console.error('Database connection failed:', err); return; }
  console.log('Connected to MySQL database');
  initDB();
});

function initDB() {
  db.query(`
    CREATE TABLE IF NOT EXISTS categories (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL UNIQUE
    )
  `);

  db.query(`
    CREATE TABLE IF NOT EXISTS items (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      description TEXT,
      quantity INT DEFAULT 0,
      price DECIMAL(10,2) DEFAULT 0,
      category_id INT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES categories(id)
    )
  `);

  // Sample categories
  db.query(`
    INSERT IGNORE INTO categories (id, name) VALUES
    (1, 'Electronics'), (2, 'Clothing'), (3, 'Food'), (4, 'Furniture'), (5, 'Other')
  `);

  // Sample items
  db.query(`
    INSERT IGNORE INTO items (id, name, description, quantity, price, category_id) VALUES
    (1, 'Laptop', 'Dell Laptop 15 inch', 10, 999.99, 1),
    (2, 'T-Shirt', 'Cotton white t-shirt', 50, 19.99, 2),
    (3, 'Rice 5kg', 'Basmati rice 5kg bag', 100, 8.99, 3),
    (4, 'Office Chair', 'Ergonomic office chair', 5, 299.99, 4)
  `);
}

// Get all items with category name
app.get('/api/items', (req, res) => {
  const search = req.query.search || '';
  const category = req.query.category || '';
  let query = `
    SELECT items.*, categories.name as category_name 
    FROM items 
    LEFT JOIN categories ON items.category_id = categories.id
    WHERE items.name LIKE ?
  `;
  const params = [`%${search}%`];
  if (category) { query += ' AND items.category_id = ?'; params.push(category); }
  db.query(query, params, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Get single item
app.get('/api/items/:id', (req, res) => {
  db.query('SELECT * FROM items WHERE id = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results[0]);
  });
});

// Add item
app.post('/api/items', (req, res) => {
  const { name, description, quantity, price, category_id } = req.body;
  db.query('INSERT INTO items (name, description, quantity, price, category_id) VALUES (?, ?, ?, ?, ?)',
    [name, description, quantity, price, category_id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Item added', id: result.insertId });
    });
});

// Update item
app.put('/api/items/:id', (req, res) => {
  const { name, description, quantity, price, category_id } = req.body;
  db.query('UPDATE items SET name=?, description=?, quantity=?, price=?, category_id=? WHERE id=?',
    [name, description, quantity, price, category_id, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Item updated' });
    });
});

// Delete item
app.delete('/api/items/:id', (req, res) => {
  db.query('DELETE FROM items WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Item deleted' });
  });
});

// Get all categories
app.get('/api/categories', (req, res) => {
  db.query('SELECT * FROM categories', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Add category
app.post('/api/categories', (req, res) => {
  const { name } = req.body;
  db.query('INSERT INTO categories (name) VALUES (?)', [name], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Category added', id: result.insertId });
  });
});

const PORT = 3002;
app.listen(PORT, () => console.log(`Inventory server running on port ${PORT}`));
