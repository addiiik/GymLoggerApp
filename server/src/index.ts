import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import fetchRoutes from './routes/fetch';
import pushRoutes from './routes/push';
import dropRoutes from './routes/drop';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/fetch', fetchRoutes);
app.use('/api/push', pushRoutes);
app.use('/api/drop', dropRoutes);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
