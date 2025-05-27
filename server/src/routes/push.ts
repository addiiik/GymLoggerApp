import { Router } from 'express';
import { addSession } from '../controllers/pushController';
import { addExercise } from '../controllers/pushController';
import { addSet } from '../controllers/pushController';

const router = Router();

router.post('/session', addSession);
router.post('/exercise', addExercise);
router.post('/set', addSet);

export default router;
