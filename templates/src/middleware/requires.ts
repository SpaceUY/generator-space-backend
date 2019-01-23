import { Request, Response, NextFunction } from 'express';

/**
 * Middleware for Express. Checks to make sure the required items are present in the request.
 * @param options set of items the request must contain
 */
export default function requires(options: RequiresOptions) {
  const { body, query, params } = options;
  return (req: Request, res: Response, next: NextFunction) => {
    let isValid: boolean = true;

    if (body && body.length > 0) {
      body.forEach(str => {
        if (req.body[str] === undefined) {
          if (isValid) {
            isValid = false;
            return res
              .status(400)
              .json({ success: false, message: `Missing required body parameter: ${str}` });
          }
        }
      });
    }
    if (query && query.length > 0) {
      query.forEach(str => {
        if (req.query[str] === undefined) {
          if (isValid) {
            isValid = false;
            return res
              .status(400)
              .json({ success: false, message: `Missing required query parameter: ${str}` });
          }
        }
      });
    }
    if (params && params.length > 0) {
      params.forEach(str => {
        if (req.params[str] === undefined) {
          if (isValid) {
            isValid = false;
            return res
              .status(400)
              .json({ success: false, message: `Missing required body parameter: ${str}` });
          }
        }
      });
    }
    if (isValid) next();
  };
}

interface RequiresOptions {
  body?: string[];
  query?: string[];
  params?: string[];
}
