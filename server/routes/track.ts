
import { Router } from 'express';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { queue } from '../queue';

const router = Router();

// Schema Zod para validação da payload
const TrackEventSchema = z.object({
  event_name: z.string(),
  event_time: z.number().optional(),
  event_id: z.string().optional(),
  value: z.number().optional(),
  currency: z.string().optional(),
  fbp: z.string().optional(),
  user_data: z.record(z.unknown()).optional(),
  custom_data: z.record(z.unknown()).optional(),
  action_source: z.string().default('website')
});

router.post('/', async (req, res) => {
  try {
    // Validar a requisição
    const validationResult = TrackEventSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(400).json({ 
        success: false, 
        error: validationResult.error.format() 
      });
    }
    
    // Preparar os dados do evento com valores padrão se necessário
    const eventData = {
      ...validationResult.data,
      event_id: validationResult.data.event_id || uuidv4(),
      event_time: validationResult.data.event_time || Math.floor(Date.now() / 1000)
    };

    // Adicionar o job à fila BullMQ
    await queue.add('capi', eventData, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 1000 // delay inicial de 1 segundo
      }
    });

    return res.status(200).json({
      success: true,
      message: 'Evento adicionado à fila para processamento',
      event_id: eventData.event_id
    });
  } catch (error) {
    console.error('Erro ao processar evento:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro interno ao processar evento',
      error: (error as Error).message
    });
  }
});

export default router;
