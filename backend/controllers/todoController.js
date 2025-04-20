"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const Todo = require("../models/Todo");
const { createTodoSchema, updateTodoSchema } = require("../joi-validations/todoValidation");
exports.getTodos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const todos = yield Todo.find({ userId: req.user.email }); // this will now work
    res.json(todos);
});
exports.createTodo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = createTodoSchema.validate(req.body);
    if (error)
        return res.status(400).json({ message: error.details[0].message });
    const newTodo = yield Todo.create(req.body);
    res.status(201).json(newTodo);
});
exports.updateTodo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = updateTodoSchema.validate(req.body);
    if (error)
        return res.status(400).json({ message: error.details[0].message });
    const todo = yield Todo.findById(req.params.id);
    if (!todo)
        return res.status(404).json({ message: "Todo not found" });
    if (req.body.toggle !== undefined)
        todo.completed = req.body.toggle;
    if (typeof req.body.text === "string")
        todo.text = req.body.text;
    yield todo.save();
    res.json(todo);
});
exports.toggleTodo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const todo = yield Todo.findById(req.params.id);
        if (!todo) {
            return res.status(404).json({ message: "Todo not found" });
        }
        if (todo.userId !== req.user.email) {
            return res.status(403).json({ message: "Unauthorized access" });
        }
        if (typeof req.body.toggle === "boolean") {
            todo.completed = req.body.toggle;
        }
        yield todo.save();
        res.json(todo);
    }
    catch (err) {
        console.error("Error in toggleTodo:", err);
        res.status(500).json({ message: "Server error" });
    }
});
exports.deleteTodo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield Todo.findByIdAndDelete(req.params.id);
    res.sendStatus(204);
});
