const express = require("express");
const router = express.Router();
const Todo = require("../models/Todo");

router.get("/:userId", async (req, res) => {
  const todos = await Todo.find({ userId: req.params.userId });
  res.json(todos);
});

router.post("/", async (req, res) => {
  const { userId, text } = req.body;
  const newTodo = await Todo.create({ userId, text });
  res.json(newTodo);
});

router.patch("/:id", async (req, res) => {
    const { text, toggle } = req.body;
  
    try {
      const todo = await Todo.findById(req.params.id);
      if (!todo) return res.status(404).json({ message: "Todo not found" });
  
      if (toggle !== undefined) {
        if (typeof toggle !== "boolean") {
          return res.status(400).json({ message: "The 'toggle' should be true or false (boolean)" });
        }
        todo.completed = toggle;
      }
  
      if (typeof text === "string") {
        todo.text = text;
      }
  
      await todo.save();
      res.json(todo);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  });
  

router.delete("/:id", async (req, res) => {
  await Todo.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
});

module.exports = router;
