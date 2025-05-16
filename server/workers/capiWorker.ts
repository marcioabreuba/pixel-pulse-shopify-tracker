
import { Job, Worker } from 'bullmq';
import { redisConnection } from '../queue';
import { sendToMeta } from '../services/metaPixel';

// Criar o worker para processar jobs da fila CAPI
const capiWorker = new Worker(
  'capi', 
  async (job: Job) => {
    const startTime = Date.now();
    console.log(`Processando job ${job.id} - Tipo: ${job.name}`);
    
    try {
      // Obter dados do evento
      const eventData = job.data;
      
      // Enviar evento para o Meta
      const result = await sendToMeta(eventData);
      
      if (!result.success) {
        throw new Error(result.message);
      }
      
      const processingTime = Date.now() - startTime;
      console.log(`Job ${job.id} processado com sucesso em ${processingTime}ms`);
      
      return {
        success: true,
        processingTime,
        message: result.message
      };
    } catch (error) {
      const processingTime = Date.now() - startTime;
      console.error(`Falha ao processar job ${job.id} após ${processingTime}ms:`, error);
      
      throw new Error(`Falha ao enviar evento: ${(error as Error).message}`);
    }
  },
  {
    connection: redisConnection,
    concurrency: 5,
    autorun: true
  }
);

// Evento ativado quando um job é concluído com sucesso
capiWorker.on('completed', (job: Job, returnValue: any) => {
  console.log(`Job ${job.id} concluído: ${returnValue.message}`);
});

// Evento ativado quando um job falha
capiWorker.on('failed', (job: Job | undefined, error: Error) => {
  if (job) {
    console.error(`Job ${job.id} falhou após ${job.attemptsMade} tentativas:`, error.message);
  } else {
    console.error('Um job falhou:', error.message);
  }
});

export { capiWorker };
