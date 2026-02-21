import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import fileUpload from 'express-fileupload';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import scanRoutes from './routes/scan.js';
import threatRoutes from './routes/threats.js';
import systemRoutes from './routes/system.js';
import monitorRoutes from './routes/monitor.js';
import { initDatabase } from './db/init.js';
import { fileMonitor } from './services/fileMonitor.js';

dotenv.config();

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false, // Allow for development
  crossOriginEmbedderPolicy: false
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

app.use('/api/', limiter);

// CORS configuration
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: './temp/',
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max file size
  abortOnLimit: true,
  safeFileNames: true,
  preserveExtension: true
}));

// Routes
app.use('/api/scan', scanRoutes);
app.use('/api/threats', threatRoutes);
app.use('/api/system', systemRoutes);
app.use('/api/monitor', monitorRoutes);

// WebSocket for real-time updates
wss.on('connection', (ws) => {
  console.log('Client connected');
  ws.on('close', () => console.log('Client disconnected'));
});

// Make WebSocket available to routes and file monitor
app.set('wss', wss);
fileMonitor.setWebSocketServer(wss);

const PORT = process.env.PORT || 5000;

async function start() {
  await initDatabase();
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

start();
