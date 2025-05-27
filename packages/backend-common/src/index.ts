import dotenv from 'dotenv';
import path from 'path';

// Adjust the path to point to the root .env

// Since .env is inside src, path should be just __dirname + '/.env'
dotenv.config({ path: path.resolve(__dirname, '../.env') });

export const JWT_SECRET = process.env.JWT_SECRET || "1231231";
