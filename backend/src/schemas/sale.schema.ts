import Joi from "joi";


export const saleSchema = Joi.array().items(
    Joi.object({
        id: Joi.string().required(),
        name: Joi.string(),
        quantity: Joi.number().required().default(1),
        price: Joi.number().required()
    })
);