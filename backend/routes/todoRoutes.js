const express = require("express");
const router = express.Router();
const auth = require("./../middleware/auth");
const {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  toggleTodo
} = require("../controllers/todoController");

// ده عشان محدش يدخل من غير ما يعمل لوجن او يدخل على list بتاعه حد تانى
router.use(auth);
router.get("/fetchTodos", getTodos); // No need for `:id`
router.post("/addTodo", createTodo);
router.patch("/toggleTodo/:id", toggleTodo);
router.patch("/updateTodo/:id", updateTodo);
router.delete("/:id", deleteTodo);

module.exports = router;
