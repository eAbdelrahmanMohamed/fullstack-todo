import express from "express";
import {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  toggleTodo
} from "../controllers/todoController";
import authenticate from "../middleware/auth";

const router = express.Router();

router.use(authenticate)// as unknown as express.RequestHandler);

router.get("/fetchTodos", getTodos)// as unknown as express.RequestHandler);
router.post("/addTodo", createTodo as unknown as express.RequestHandler);
router.patch("/toggleTodo/:id", toggleTodo as unknown as express.RequestHandler);
router.patch("/updateTodo/:id", updateTodo as unknown as express.RequestHandler);
router.delete("/:id", deleteTodo as unknown as express.RequestHandler);

export default router;
