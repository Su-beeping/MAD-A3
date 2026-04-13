# E-Commerce App

A simple e-commerce web app built with Node.js, Express, and MySQL.

## Features
- User registration and login
- View products
- Add to cart / remove from cart
- Admin panel to add/delete products

## Setup

1. Install dependencies:
```
npm install
```

2. Create MySQL database:
```sql
CREATE DATABASE ecommerce_db;
```

3. Update your MySQL password in `server.js` (look for `password: ''`)

4. Start the server:
```
npm start
```

5. Open browser at `http://localhost:3001`

## Admin Access
To make a user admin, run this in MySQL:
```sql
UPDATE users SET role='admin' WHERE email='your@email.com';
```
