
import { Queue, Worker } from 'bullmq';
import Redis from 'ioredis';
import { sendToMeta } from '../services/metaPixel';

// Configuração do Redis
const redisConfig = {
  connection: process.env.REDIS_URL 
    ? { url: process.env.REDIS_URL }
    : { host: 'localhost', port: 6379 }
};

// Instanciando a conexão Redis para BullMQ
const connection = new Redis(redisConfig.connection);

// Criando a fila para eventos CAPI (Conversions API)
export const queue = new Queue('capi', {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000
    }
  }
});

console.log('Fila CAPI inicializada');

// Exportando a conexão para uso em outros lugares se necessário
export { connection as redisConnection };
