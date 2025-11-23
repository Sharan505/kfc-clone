import express, { Request, Response, NextFunction } from 'express';
import { MongoClient, Db, ObjectId, Collection, Document } from 'mongodb';
import dotenv from 'dotenv';
import cors from 'cors';
import bcrypt from 'bcrypt';

dotenv.config();

// Interface for Menu Item
interface MenuItem {
  _id?: string;
  category: string;
  title: string;
  image: string;
  type: string;
  items: string;
}

interface Offers {
  _id?: string;
  title: string;
  desc: string;
  valid_till: string;
  terms: string[];
  image: string;
}

// Add this to your server.ts or a new file like interfaces/User.ts
export interface User {
  _id?: string;
  firstName: string;
  lastName: string;
  mobileNo: string;
  email: string;
  address: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

interface OrderItem {
  itemId: string;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  _id?: ObjectId;
  userId: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'on the way' | 'delivered';
  deliveryAddress: string;
  phoneNumber: string;
  createdAt: Date;
  updatedAt: Date;
}

const corsOptions = {
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next();
});
app.use(express.json());


const saltRounds = 10;

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/kfc';
if (!MONGODB_URI) {
  console.error('MongoDB connection string is not defined in environment variables');
  process.exit(1);
}

let client: MongoClient;
let db: Db;

// Connect to MongoDB
let ordersCollection: Collection<Document>;
async function connectToDatabase() {
  try {
    client = new MongoClient(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
    });

    await client.connect();
    db = client.db('kfc');
    ordersCollection = db.collection("kfc-orders");
    console.log('Successfully connected to MongoDB');

    // Verify the connection
    await db.command({ ping: 1 });
    console.log('MongoDB connection is healthy');

    const collections = await db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name));

    return db;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  }
}

// User Authentication Routes
app.post('/api/orders', async (req, res) => {
  try {
    const { address, phone, userId, items, total } = req.body;

    // Input validation
    if (!address || !phone || !userId || !items || !total) {
      return res.status(400).json({
        success: false,
        message: 'Address, phone, userId, items, and total are required'
      });
    }

    // Create order with items from request
    const order = {
      userId: new ObjectId(userId),
      items: items.map((item: any) => ({
        itemId: new ObjectId(item.itemId),
        title: item.title,
        amount: item.amount,
        quantity: item.quantity,
        image: item.image,
        category: item.category,
        type: item.type,
        items: item.items
      })),
      total,
      address,
      phoneNumber: phone,
      status: 'pending',
      createdAt: new Date()
    };

    // Save order to database
    const result = await db.collection('kfc-orders').insertOne(order);

    // Clear user's cart after successful order
    await db.collection('kfc-users').updateOne(
      { _id: new ObjectId(userId) },
      { $set: { cart: [] } }
    );

    res.status(201).json({
      success: true,
      order: {
        ...order,
        _id: result.insertedId
      }
    });

  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order'
    });
  }
});

app.put('/api/users/:userId/cart', async (req, res) => {
  try {
    const { userId } = req.params;
    const { cart } = req.body;

    if (!userId || !cart) {
      return res.status(400).json({
        success: false,
        message: 'User ID and cart are required'
      });
    }

    await db.collection('kfc-users').updateOne(
      { _id: new ObjectId(userId) },
      { $set: { cart } }
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Error updating cart:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update cart'
    });
  }
});

// Add route to get user's orders
app.get('/api/orders/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    const orders = await db.collection('kfc-orders')
      .find({ userId: new ObjectId(userId) })
      .sort({ createdAt: -1 })
      .toArray();

    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders'
    });
  }
});

// Login endpoint
app.post('/api/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    if (!db) {
      throw new Error('Database not connected');
    }

    // Find user by email
    const user = await db.collection('kfc-users').findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const { password: _, ...userData } = user;

    res.status(200).json({
      message: 'Login successful',
      user: userData,
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Internal server error'
    });
  }
});

app.post('/api/register', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { firstName, lastName, mobileNo, email, address, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    if (!db) {
      throw new Error('Database not connected');
    }

    // Check if user already exists
    const existingUser = await db.collection('kfc-users').findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = {
      firstName,
      lastName,
      mobileNo,
      email,
      address,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('kfc-users').insertOne(newUser);

    res.status(201).json({
      message: "User registered successfully",
      userId: result.insertedId
    });

  } catch (error) {
    console.error('Registration error:', error);
    next(error);
  }
});

// Test connection endpoint
app.get('/api/test-connection', async (req: Request, res: Response) => {
  try {
    if (!db) {
      throw new Error('Database not connected');
    }

    const collections = await db.listCollections().toArray();
    res.json({
      status: 'success',
      database: db.databaseName,
      collections: collections.map(c => c.name),
      connection: 'active'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get all menu items
app.get('/api/menu', async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!db) {
      throw new Error('Database not connected');
    }

    const menuItems = await db.collection<MenuItem>('kfc-menu').find({}).toArray();
    res.json(menuItems);
  } catch (error) {
    next(error);
  }
});

app.get('/api/offers', async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!db) {
      throw new Error('Database not connected');
    }

    const offers = await db.collection<Offers>('kfc-offers').find({}).toArray();
    res.json(offers);
  } catch (error) {
    next(error);
  }
});


// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'OK',
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    timestamp: new Date().toISOString()
  });

  res.status(500).json({
    status: 'error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error',
    timestamp: new Date().toISOString()
  });
});

// Start the server
async function startServer() {
  try {
    await connectToDatabase();

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down server...');

  try {
    if (client) {
      await client.close();
      console.log('MongoDB connection closed');
    }
    console.log('Server stopped');
    process.exit(0);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
});

// Start the application
startServer().catch(error => {
  console.error('Fatal error during startup:', error);
  process.exit(1);
});

export default app;