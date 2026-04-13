# My Inventory App

A full inventory management app built with React Native (Expo) and Node.js + MySQL.

## Features
- View all inventory items
- Search items by name
- Filter by category
- Add new items
- Edit existing items
- Delete items
- Track stock levels (color coded: red = 0, orange = low, green = ok)
- Manage categories

## Setup

### Backend
1. `npm install`
2. Create MySQL database: `CREATE DATABASE inventory_db;`
3. Update password in `server.js` if needed
4. `node server.js` → runs on port 3002

### Mobile App
1. `cd mobile`
2. `npm install`
3. `npx expo start`
4. Scan QR code with Expo Go
