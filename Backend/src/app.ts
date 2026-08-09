import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import pinoHttp from 'pino-http';
import { logger } from './utils/logger';
import { errorHandler } from './middlewares/errorMiddleware';
import authRoutes from './routes/authRoutes';
import tipePropertiRoutes from './routes/tipePropertiRoutes';
import fasilitasRoutes from './routes/fasilitasRoutes';
import propertiRoutes from './routes/propertiRoutes';
import tipeKamarRoutes from './routes/tipeKamarRoutes';
import tipeKasurRoutes from './routes/tipeKasurRoutes';
import paketHargaRoutes from './routes/paketHargaRoutes';
import unitKamarRoutes from './routes/unitKamarRoutes';
import searchRoutes from './routes/searchRoutes';
import pemesananRoutes from './routes/pemesananRoutes';
import pembayaranRoutes from './routes/pembayaranRoutes';
import ulasanRoutes from './routes/ulasanRoutes';
const app = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Setup Pino HTTP logger
app.use(pinoHttp({ logger }));

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/tipe-properti', tipePropertiRoutes);
app.use('/api/v1/fasilitas', fasilitasRoutes);
app.use('/api/v1/properti', propertiRoutes);
app.use('/api/v1/tipe-kamar', tipeKamarRoutes);
app.use('/api/v1/tipe-kasur', tipeKasurRoutes);
app.use('/api/v1/paket-harga', paketHargaRoutes);
app.use('/api/v1/unit-kamar', unitKamarRoutes);
app.use('/api/v1/search', searchRoutes);
app.use('/api/v1/pemesanan', pemesananRoutes);
app.use('/api/v1/pembayaran', pembayaranRoutes);
app.use('/api/v1/ulasan', ulasanRoutes);

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'success', message: 'Server is healthy' });
});

// Handle 404
app.use((req: Request, res: Response) => {
  res.status(404).json({ status: 'error', message: `Route ${req.originalUrl} not found` });
});

// Global Error Handler
app.use(errorHandler);

export default app;
