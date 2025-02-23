import Joi from "joi"

export const productSchema = Joi.object({
    name: Joi.string().required(),
    price: Joi.number().required().default(1),
    isAvailable: Joi.boolean().default(true)
})