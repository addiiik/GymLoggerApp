import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import jwt from 'jsonwebtoken';

export const addSession = async (req: Request, res: Response): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Authorization header missing or malformed' });
    return;
  }

  const token = authHeader.split(' ')[1];

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET || '') as { id: string };
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token', error });
    return;
  }

  const userId = decoded.id;
  const { sessionName, sessionDate } = req.body;

  if (!sessionName || typeof sessionName !== 'string') {
    res.status(400).json({ message: 'Session name is required and must be a string' });
    return;
  }

  let sessionTime = new Date();
  if (sessionDate) {
    const parsedDate = new Date(sessionDate);
    if (isNaN(parsedDate.getTime())) {
      res.status(400).json({ message: 'Invalid session date format' });
      return;
    }
    sessionTime = parsedDate;
  }

  try {
    const newSession = await prisma.session.create({
      data: {
        name: sessionName,
        time: sessionTime,
        userId,
      },
      include: {
        exercises: {
          include: {
            sets: true,
          },
        },
      },
    });

    res.status(201).json({ session: newSession });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create session', error });
  }
};

export const addExercise = async (req: Request, res: Response): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Authorization header missing or malformed' });
    return;
  }

  const token = authHeader.split(' ')[1];

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET || '') as { id: string };
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token', error });
    return;
  }

  const userId = decoded.id;
  const { sessionId, exerciseName } = req.body;

  if (!sessionId || !exerciseName) {
    res.status(400).json({ message: 'Session ID and exercise type are required' });
    return;
  }

  try {
    const session = await prisma.session.findFirst({
      where: {
        id: sessionId,
        userId
      }
    });

    if (!session) {
      res.status(404).json({ message: 'Session not found or does not belong to this user' });
      return;
    }

    const newExercise = await prisma.exercise.create({
      data: {
        name: exerciseName,
        sessionId
      }
    });

    res.status(201).json({ exercise: newExercise });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add exercise', error });
  }
};

export const addSet = async (req: Request, res: Response): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Authorization header missing or malformed' });
    return;
  }

  const token = authHeader.split(' ')[1];

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET || '') as { id: string };
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token', error });
    return;
  }

  const userId = decoded.id;
  const { exerciseId, setType, weight, reps } = req.body;

  if (!exerciseId || !setType || weight === undefined || reps === undefined) {
    res.status(400).json({ message: 'Exercise ID, set type, weight, and reps are required' });
    return;
  }

  const validSetTypes = ['WARMUP', 'REGULAR', 'SUPERSET'];
  if (!validSetTypes.includes(setType)) {
    res.status(400).json({ message: 'Invalid set type. Must be WARMUP, REGULAR, or SUPERSET' });
    return;
  }
  
  if (typeof weight !== 'number' || typeof reps !== 'number') {
    res.status(400).json({ message: 'Weight and reps must be numbers' });
    return;
  }

  try {
    const exercise = await prisma.exercise.findFirst({
      where: {
        id: exerciseId,
        session: {
          userId
        }
      },
      include: {
        session: true
      }
    });

    if (!exercise) {
      res.status(404).json({ message: 'Exercise not found or does not belong to this user' });
      return;
    }

    const newSet = await prisma.set.create({
      data: {
        type: setType,
        weight,
        reps,
        exerciseId
      }
    });

    res.status(201).json({ set: newSet });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add set', error });
  }
};