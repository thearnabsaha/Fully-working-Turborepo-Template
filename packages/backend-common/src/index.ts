import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../.env') });

export const JWT_SECRET = process.env.JWT_SECRET || "1231231";
