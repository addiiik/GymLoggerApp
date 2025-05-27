import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import jwt from 'jsonwebtoken';

export const fetchSessions = async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Authorization header missing or malformed' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || '') as { id: string };

    const sessions = await prisma.session.findMany({
      where: {
        userId: decoded.id,
      },
      include: {
        exercises: {
          include: {
            sets: true,
          },
        },
      },
      orderBy: {
        time: 'desc',
      },
    });

    res.json(sessions);
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token', error });
  }
};
