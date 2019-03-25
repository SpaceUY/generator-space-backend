import { Request, Response, NextFunction } from 'express';

export default function cors(options: CorsOptions): corsMiddleware {
  return (req, res, next) => {
    if (req.method === 'OPTIONS') {
      res.header(
        'Access-Control-Allow-Origin',
        options.origin,
      );
      res.header(
        'Access-Control-Allow-Methods',
        options.methods.join(', '),
      );
      res.header(
        'Access-Control-Allow-Headers',
        options.headers.join(', '),
        );
      return res.sendStatus(200);
    }
    next();
  };
}

export type corsMiddleware = (req: Request, res: Response, next: NextFunction) => void;
export type corsMethods = 'GET' | 'PUT' | 'POST' | 'DELETE' | 'OPTIONS';
export interface CorsOptions {
  origin: string;
  methods: corsMethods[];
  headers: string[];
}
