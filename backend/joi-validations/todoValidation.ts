import Joi from "joi";

export const createTodoSchema = Joi.object({
  text: Joi.string().required(),
  userId: Joi.string().required(),
});

export const updateTodoSchema = Joi.object({
  text: Joi.string(),
  toggle: Joi.boolean(),
});
