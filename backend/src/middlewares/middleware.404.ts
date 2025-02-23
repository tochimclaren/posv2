import { Request, Response, NextFunction } from 'express';

export const notFoundError = (req: Request, res: Response, next: NextFunction) => {
    res.status(404).json({
        error: {
            message: `Route ${req.originalUrl} not found`,
            status: 404,
        },
    });
};