import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import jwt from 'jsonwebtoken';

export const deleteSession = async (req: Request, res: Response): Promise<void> => {
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
  const { sessionId } = req.body;

  if (!sessionId) {
    res.status(400).json({ message: 'Session ID is required' });
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

    await prisma.session.delete({
      where: {
        id: sessionId
      }
    });

    res.status(200).json({ message: 'Session deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete session', error });
  }
};

export const deleteExercise = async (req: Request, res: Response): Promise<void> => {
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
  const { exerciseId } = req.body;

  if (!exerciseId) {
    res.status(400).json({ message: 'Exercise ID is required' });
    return;
  }

  try {
    const exercise = await prisma.exercise.findFirst({
      where: {
        id: exerciseId,
        session: {
          userId
        }
      }
    });

    if (!exercise) {
      res.status(404).json({ message: 'Exercise not found or does not belong to this user' });
      return;
    }

    await prisma.exercise.delete({
      where: {
        id: exerciseId
      }
    });

    res.status(200).json({ message: 'Exercise deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete exercise', error });
  }
};

export const deleteSet = async (req: Request, res: Response): Promise<void> => {
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
  const { setId } = req.body;

  if (!setId) {
    res.status(400).json({ message: 'Set ID is required' });
    return;
  }

  try {
    const set = await prisma.set.findFirst({
      where: {
        id: setId,
        exercise: {
          session: {
            userId
          }
        }
      }
    });

    if (!set) {
      res.status(404).json({ message: 'Set not found or does not belong to this user' });
      return;
    }

    await prisma.set.delete({
      where: {
        id: setId
      }
    });

    res.status(200).json({ message: 'Set deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete set', error });
  }
};