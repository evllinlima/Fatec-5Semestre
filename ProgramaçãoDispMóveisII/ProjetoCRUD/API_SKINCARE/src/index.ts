import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config';
import authRoutes from './routes/auth';
import productsRoutes from './routes/products';
import routineStepsRoutes from './routes/routineSteps';

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/routineSteps', routineStepsRoutes);

// Verificação de saúde
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'API funcionando', timestamp: new Date() });
});

// Conectar ao MongoDB
async function connectDatabase() {
  try {
    await mongoose.connect(config.MONGODB_URI);
    console.log('✅ MongoDB conectado com sucesso');
  } catch (error) {
    console.error('❌ Erro ao conectar ao MongoDB:', error);
    process.exit(1);
  }
}

// Iniciar servidor
async function startServer() {
  try {
    await connectDatabase();

    app.listen(config.PORT, () => {
      console.log(`🚀 Servidor rodando em http://localhost:${config.PORT}`);
      console.log(`📝 Ambiente: ${config.NODE_ENV}`);
    });
  } catch (error) {
    console.error('Erro ao iniciar servidor:', error);
    process.exit(1);
  }
}

startServer();

export default app;
