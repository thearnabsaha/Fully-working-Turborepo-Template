import express from 'express';
const app = express();
import dotenv from 'dotenv';
dotenv.config();
const port = process.env.PORT || 3001;
import cookieParser from 'cookie-parser';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import { SignUpSchema, SignInSchema } from '@workspace/common/types'
import { JWT_SECRET } from '@workspace/backend-common/config'
import { User,connectDB } from '@workspace/nosqldb/client'
// npm install express cors cookie-parser dotenv helmet morgan
// npm install -D @types/express @types/cors @types/cookie-parser @types/morgan
import { prisma } from '@workspace/sqlDb/client'
const morganFormat = ':method :url :status :response-time ms';

app.use(morgan(morganFormat));
app.use(helmet());

app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
}));

// app.options('*', cors({
//   origin: process.env.CORS_ORIGIN,
//   credentials: true,
// }));

app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(express.static('public'));
app.use(cookieParser());
connectDB()
app.get('/', (req, res) => {
  res.send(JWT_SECRET);
});
app.post('/signup', async (req, res) => {
  const result = SignUpSchema.safeParse(req.body);
  if (!result.success) {
    res.send(result.error.format());
  } else {
    const user=await prisma.user.createMany({
      data:req.body
    });
    await User.create(req.body)
    res.send(result);
  }
});
app.post('/signin', (req, res) => {
  const result = SignInSchema.safeParse(req.body);
  if (!result.success) {
    res.send(result.error.format());
  } else {
    res.send(result);
  }
});

app.listen(port, () => console.log('> Server is up and running on port: ' + port));