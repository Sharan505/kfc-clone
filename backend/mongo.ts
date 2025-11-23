import dotenv from 'dotenv';
dotenv.config();
import { MongoClient, ServerApiVersion, Db, MongoClientOptions } from 'mongodb';

// Replace these with your actual MongoDB credentials
const username = process.env.MONGOBD_USERNAME;
const password = process.env.MONGODB_PASSWORD;
const cluster = 'kfcmain.iytk1eg';
const dbName = 'kfcmain';

const uri = `mongodb+srv://${username}:${password}@${cluster}.mongodb.net/${dbName}?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const clientOptions: MongoClientOptions = {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
    allowPartialTrustChain: undefined,
    ALPNProtocols: undefined,
    ca: undefined,
    cert: undefined,
    checkServerIdentity: undefined,
    ciphers: undefined,
    crl: undefined,
    ecdhCurve: undefined,
    key: undefined,
    minDHSize: undefined,
    passphrase: undefined,
    pfx: undefined,
    rejectUnauthorized: undefined,
    secureContext: undefined,
    secureProtocol: undefined,
    servername: undefined,
    session: undefined,
    autoSelectFamily: undefined,
    autoSelectFamilyAttemptTimeout: undefined,
    keepAliveInitialDelay: undefined,
    family: undefined,
    hints: undefined,
    localAddress: undefined,
    localPort: undefined,
    lookup: undefined
};

class MongoDBConnection {
  private static instance: MongoDBConnection;
  private client: MongoClient;
  private db: Db | null = null;

  private constructor() {
    this.client = new MongoClient(uri, clientOptions);
  }

  public static getInstance(): MongoDBConnection {
    if (!MongoDBConnection.instance) {
      MongoDBConnection.instance = new MongoDBConnection();
    }
    return MongoDBConnection.instance;
  }

  public async connect(): Promise<Db> {
    try {
      if (!this.db) {
        await this.client.connect();
        // Test the connection
        await this.client.db(dbName).command({ ping: 1 });
        console.log('Successfully connected to MongoDB!');
        this.db = this.client.db(dbName);
      }
      return this.db;
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
      await this.client.close();
      throw error;
    }
  }

  public async close(): Promise<void> {
    try {
      if (this.client) {
        await this.client.close();
        this.db = null;
        console.log('MongoDB connection closed');
      }
    } catch (error) {
      console.error('Error closing MongoDB connection:', error);
      throw error;
    }
  }
}

export default MongoDBConnection;