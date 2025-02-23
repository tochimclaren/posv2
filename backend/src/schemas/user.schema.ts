import Joi, { ObjectSchema } from 'joi';

// Define the schema for the user data
export const userLoginSchema: ObjectSchema = Joi.object({
    username: Joi.string().min(3).max(30).required(),
    password: Joi.string().min(8).required(),
});

export const userSchema: ObjectSchema = Joi.object({
    username: Joi.string().min(3).max(30).required(),
    password: Joi.string().min(8).required(),
    role: Joi.string()
});