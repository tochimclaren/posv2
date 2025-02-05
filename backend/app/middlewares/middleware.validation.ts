import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export const objectValidation = (schema: Joi.ObjectSchema) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const { error } = schema.validate(req.body);

      console.log(error)
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }
      next();
    } catch (err) {
      next(err);
    }
  };
};

export const arrayValidation = (schema: Joi.ArraySchema) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const { data } = req.body
      const { error } = schema.validate(data);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }
      next();
    } catch (err) {
      next(err);
    }
  };
};