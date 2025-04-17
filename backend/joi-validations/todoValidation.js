const Joi = require("joi");

const createTodoSchema = Joi.object({
  userId: Joi.string().required(),
  text: Joi.string().min(1).required()
});

const updateTodoSchema = Joi.object({
  text: Joi.string().optional(),
  toggle: Joi.boolean().optional()
});

module.exports = { createTodoSchema, updateTodoSchema };
