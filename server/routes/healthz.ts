
import { Router } from 'express';

const router = Router();

// Rota de verificação de saúde
router.get('/', (_, res) => {
  res.json({ ok: true });
});

export default router;
