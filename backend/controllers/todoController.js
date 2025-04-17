const Todo = require("../models/Todo");
const {
  createTodoSchema,
  updateTodoSchema
} = require("../joi-validations/todoValidation");

exports.getTodos = async (req, res) => {
  const todos = await Todo.find({ userId: req.user.email }); // this will now work
  res.json(todos);
};

exports.createTodo = async (req, res) => {
  const { error } = createTodoSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const newTodo = await Todo.create(req.body);
  res.status(201).json(newTodo);
};

exports.updateTodo = async (req, res) => {
  const { error } = updateTodoSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const todo = await Todo.findById(req.params.id);
  if (!todo) return res.status(404).json({ message: "Todo not found" });

  if (req.body.toggle !== undefined) todo.completed = req.body.toggle;
  if (typeof req.body.text === "string") todo.text = req.body.text;

  await todo.save();
  res.json(todo);
};

exports.toggleTodo = async (req, res) => {
    try {
      const todo = await Todo.findById(req.params.id);
      if (!todo) {
        return res.status(404).json({ message: "Todo not found" });
      }
  
      if (todo.userId !== req.user.email) {
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
  
exports.deleteTodo = async (req, res) => {
  await Todo.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
};
