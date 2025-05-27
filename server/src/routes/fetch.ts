import { Router } from 'express';
import { fetchSessions } from '../controllers/fetchController';

const router = Router();

router.get('/sessions', fetchSessions);

export default router;
