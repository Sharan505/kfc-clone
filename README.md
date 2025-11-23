# KFC Clone

A full-stack KFC clone application built with React, TypeScript, Node.js, Express, and MongoDB.

## Features

- Browse KFC menu items and offers
- User authentication (signup/login)
- Shopping cart functionality
- Responsive design
- Modern UI with Tailwind CSS

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v18 or later)
- npm (v9 or later) or yarn
- MongoDB (local or MongoDB Atlas)
- Git

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Sharan505/kfc-clone.git
cd kfc-clone
```

### 2. Set Up Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Set up environment variables:
   Create a `.env` file in the `backend` directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```
   - Replace `your_mongodb_connection_string` with your MongoDB connection string (local or MongoDB Atlas)
   - Replace `your_jwt_secret_key` with a secure secret key for JWT

4. Start the backend server:
   ```bash
   # Development mode with auto-reload
   npm run dev
   
   # Production mode
   npm run build
   npm start
   ```
   The backend server will be running at `http://localhost:5000`

### 3. Set Up Frontend

1. Open a new terminal and navigate to the project root directory:
   ```bash
   cd kfc-clone
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```
   The frontend will be available at `http://localhost:5173`

## Project Structure

```
kfc-clone/
├── backend/               # Backend server code
│   ├── node_modules/      # Backend dependencies
│   ├── src/               # Source files
│   ├── .env               # Environment variables
│   ├── package.json       # Backend dependencies and scripts
│   └── server.ts          # Main server file
├── public/               # Static files
├── src/                  # Frontend source code
│   ├── components/       # Reusable React components
│   ├── pages/            # Page components
│   ├── App.tsx           # Main App component
│   └── main.tsx          # Entry point
├── .gitignore
├── package.json          # Frontend dependencies and scripts
├── tsconfig.json         # TypeScript configuration
└── README.md             # This file
```

## Available Scripts

### Frontend
- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run preview` - Preview the production build
- `npm run lint` - Run ESLint

### Backend
- `npm run dev` - Start the development server with auto-reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Start the production server

## Environment Variables

### Backend (`.env`)
- `PORT` - Port number for the backend server (default: 5000)
- `MONGODB_URI` - MongoDB connection string

## Acknowledgments

- [KFC](https://www.kfc.com/) for the inspiration
- All the open-source libraries and tools used in this project
