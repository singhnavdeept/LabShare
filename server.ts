import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import dotenv from 'dotenv';
import { connectDB } from './server/config/db.js';
import authRoutes from './server/routes/auth.routes.js';
import equipmentRoutes from './server/routes/equipment.routes.js';
import requestRoutes from './server/routes/request.routes.js';
import dashboardRoutes from './server/routes/dashboard.routes.js';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(express.json());

  // Database Connection
  await connectDB();

  // API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/equipment', equipmentRoutes);
  app.use('/api/requests', requestRoutes);
  app.use('/api/dashboard', dashboardRoutes);

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', dbConnected: global.dbConnected || false });
  });

  // Vite middleware for development or static serving for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
