import express from 'express';
import env from 'dotenv';
import DB_Init from './entities/DB_init.js';
import createDBRouter from './routes/createDBRouter.js';
import StudentRouter from './routes/StudentRouter.js';
import ProfessorRouter from './routes/ProfessorRouter.js';
import RequestRouter from './routes/RequestRouter.js';
import SessionRouter from './routes/SessionRouter.js';
import AuthRouter from './routes/AuthRouter.js';
import UniversitySessionRouter from './routes/UniversitySessionRouter.js';
import path from 'path';
import { fileURLToPath } from 'url';

env.config();

let app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsPath = path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadsPath));

DB_Init();
// Debug logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});
app.use('/api', createDBRouter);
app.use('/api', AuthRouter); // /api/login
app.use('/api/students', StudentRouter);
app.use('/api/professors', ProfessorRouter);
app.use('/api/requests', RequestRouter);
app.use('/api/sessions', SessionRouter);
app.use('/api/university-sessions', UniversitySessionRouter);

let PORT = process.env.PORT || 9000;

app.listen(PORT);
console.log(`Server is running on port ${PORT}`);