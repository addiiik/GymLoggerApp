import { Router } from 'express';
import { deleteSession, deleteExercise, deleteSet } from '../controllers/dropController';

const router = Router();

router.delete('/session', deleteSession);
router.delete('/exercise', deleteExercise);
router.delete('/set', deleteSet);

export default router;