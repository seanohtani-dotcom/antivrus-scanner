import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import fileUpload from 'express-fileupload';
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

app.use(cors());
app.use(express.json());
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: './temp/'
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
