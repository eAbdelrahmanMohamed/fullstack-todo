import { Request, Response } from "express";
import { AuthenticatedRequest } from "../types/express/AuthenticatedRequest";

import Todo from "../models/Todo";
import {
  createTodoSchema,
  updateTodoSchema
} from "../joi-validations/todoValidation";



export const getTodos = async (req: Request, res: Response) => {
  try {
    const todos = await Todo.find({ userId: req.user?.email });
    res.json(todos);
  } catch (err) {
    console.error("Error fetching todos:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const createTodo = async (req: AuthenticatedRequest, res: Response)  => {
  const { error } = createTodoSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const newTodo = await Todo.create({ ...req.body, userId: req.user?.email });
    res.status(201).json(newTodo);
  } catch (err) {
    console.error("Error creating todo:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateTodo = async (req: AuthenticatedRequest, res: Response) => {
  const { error } = updateTodoSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) return res.status(404).json({ message: "Todo not found" });

    if (todo.userId !== req.user?.email) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    if (req.body.toggle !== undefined) {
      todo.completed = req.body.toggle;
    }
    if (typeof req.body.text === "string") {
      todo.text = req.body.text;
    }

    await todo.save();
    res.json(todo);
  } catch (err) {
    console.error("Error updating todo:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const toggleTodo = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    if (todo.userId !== req.user?.email) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    if (typeof req.body.toggle === "boolean") {
      todo.completed = req.body.toggle;
    }

    await todo.save();
    res.json(todo);
  } catch (err) {
    console.error("Error in toggleTodo:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteTodo = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) return res.status(404).json({ message: "Todo not found" });

    if (todo.userId !== req.user?.email) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    await Todo.findByIdAndDelete(req.params.id);
    res.sendStatus(204);
  } catch (err) {
    console.error("Error deleting todo:", err);
    res.status(500).json({ message: "Server error" });
  }
};
