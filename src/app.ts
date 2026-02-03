import express from 'express';
import battleRoutes from './routes/playerRoutes';
import { errorHandler } from './middlewares/errorHandler';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/player', battleRoutes);

app.use(errorHandler);

export default app;
