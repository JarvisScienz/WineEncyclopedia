import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
const secretKey = process.env.SECRET_KEY as string;

export function verifyToken(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(' ')[1] || req.cookies?.token;

    if (!token) {
        return res.status(401).json({ message: 'Token mancante. Accesso non autorizzato.' });
    }
    
    jwt.verify(token, secretKey, (err: any, decoded: any) => {
        if (err) {
        return res.status(403).json({ message: 'Token non valido. Accesso non autorizzato.' });
        }
    
        (req as any).user = decoded;
        next();
    });
}

