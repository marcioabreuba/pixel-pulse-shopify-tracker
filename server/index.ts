
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import healthzRouter from './routes/healthz';
import trackRouter from './routes/track';

const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas
app.use('/healthz', healthzRouter);
app.use('/track', trackRouter);

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
}

export default app; // Exporta para testes
