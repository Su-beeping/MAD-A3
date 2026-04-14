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
  database: 'ticketbooking_db'
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
    CREATE TABLE IF NOT EXISTS events (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(150) NOT NULL,
      description TEXT,
      location VARCHAR(150),
      date DATE NOT NULL,
      time VARCHAR(20),
      category VARCHAR(50),
      standard_price DECIMAL(10,2) DEFAULT 0,
      vip_price DECIMAL(10,2) DEFAULT 0,
      standard_seats INT DEFAULT 0,
      vip_seats INT DEFAULT 0,
      image_url VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.query(`
    CREATE TABLE IF NOT EXISTS bookings (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      event_id INT NOT NULL,
      ticket_type ENUM('standard','vip') DEFAULT 'standard',
      quantity INT DEFAULT 1,
      total_price DECIMAL(10,2) NOT NULL,
      status ENUM('confirmed','cancelled') DEFAULT 'confirmed',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (event_id) REFERENCES events(id)
    )
  `);

  // Sample events
  db.query(`
    INSERT IGNORE INTO events (id, title, description, location, date, time, category, standard_price, vip_price, standard_seats, vip_seats) VALUES
    (1, 'Music Festival 2024', 'A great outdoor music festival', 'City Park', '2024-12-20', '6:00 PM', 'Music', 25.00, 75.00, 100, 20),
    (2, 'Tech Conference', 'Latest in technology and AI', 'Convention Center', '2024-12-25', '9:00 AM', 'Tech', 50.00, 150.00, 200, 50),
    (3, 'Football Match', 'Local championship finals', 'Stadium', '2024-12-28', '4:00 PM', 'Sports', 15.00, 45.00, 500, 100),
    (4, 'Comedy Night', 'Stand up comedy show', 'Comedy Club', '2024-12-30', '8:00 PM', 'Entertainment', 20.00, 60.00, 80, 20)
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

// Events
app.get('/api/events', (req, res) => {
  const search = req.query.search || '';
  const category = req.query.category || '';
  let query = 'SELECT * FROM events WHERE title LIKE ?';
  const params = [`%${search}%`];
  if (category) { query += ' AND category = ?'; params.push(category); }
  query += ' ORDER BY date ASC';
  db.query(query, params, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.post('/api/events', (req, res) => {
  const { title, description, location, date, time, category, standard_price, vip_price, standard_seats, vip_seats } = req.body;
  db.query(`INSERT INTO events (title, description, location, date, time, category, standard_price, vip_price, standard_seats, vip_seats) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [title, description, location, date, time, category, standard_price, vip_price, standard_seats, vip_seats],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Event added', id: result.insertId });
    });
});

app.delete('/api/events/:id', (req, res) => {
  db.query('DELETE FROM events WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Event deleted' });
  });
});

// Bookings
app.post('/api/bookings', (req, res) => {
  const { user_id, event_id, ticket_type, quantity, total_price } = req.body;
  db.query('INSERT INTO bookings (user_id, event_id, ticket_type, quantity, total_price) VALUES (?, ?, ?, ?, ?)',
    [user_id, event_id, ticket_type, quantity, total_price],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Booking confirmed!', id: result.insertId });
    });
});

app.get('/api/bookings/:userId', (req, res) => {
  db.query(`
    SELECT bookings.*, events.title, events.date, events.time, events.location, events.category
    FROM bookings
    JOIN events ON bookings.event_id = events.id
    WHERE bookings.user_id = ?
    ORDER BY bookings.created_at DESC
  `, [req.params.userId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.put('/api/bookings/:id/cancel', (req, res) => {
  db.query('UPDATE bookings SET status = "cancelled" WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Booking cancelled' });
  });
});

const PORT = 3004;
app.listen(PORT, () => console.log(`Ticket Booking server running on port ${PORT}`));
