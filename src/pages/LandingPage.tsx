import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTodos,
  addTodo_endpoint as addTodo,
  updateTodo_endpoint as updateTodo,
  toggleTodo_endpoint as toggleTodo,
  deleteTodo_endpoint as deleteTodo,
} from "../redux/todoSlice";
import { logout } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Joi from "joi";
import { AppDispatch } from "../redux/store"; // Import AppDispatch

type Todo = {
  _id: string;
  text: string;
  completed: boolean;
};


const schema = Joi.object({
  text: Joi.string().min(1).required().messages({
    "string.empty": "Todo cannot be empty",
    "string.min": "Todo should be at least 1 character",
  }),
});

const LandingPage = () => {
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  const dispatch = useDispatch<AppDispatch>(); // Type the dispatch here
  const navigate = useNavigate();

  const user = useSelector((state: any) => state.auth.email) || JSON.parse(localStorage.getItem("user")!);
  const token = localStorage.getItem("token");
  const todos :Todo[] = useSelector((state: any) => (user ? state.todos[user] || [] : [])); // Fetch todos by user

  useEffect(() => {
    if (!user && !token) {
      navigate("/login"); // Redirect if not authenticated
    }
  }, [user, token, navigate]);

  useEffect(() => {
    if (user) {
      dispatch(fetchTodos()); // Fetch todos when user changes
    }
  }, [user, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token"); // Clear token from localStorage
    localStorage.removeItem("user"); // Optionally clear user data from localStorage
    navigate("/login"); // Redirect to login page
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">To-Do List</h2>
        <button onClick={handleLogout} className="bg-red-500 text-white p-2 rounded">
          Logout ({user?.email})
        </button>
      </div>

      <Formik
        initialValues={{ text: "" }}
        validate={(values) => {
          const { error } = schema.validate(values, { abortEarly: false });
          const errors: { text?: string } = {};
          if (error) {
            error.details.forEach((detail) => {
              const errors: { [key: string]: string } = {};
              errors[detail.path[0]] = detail.message;
            });
          }
          return errors;
        }}
        onSubmit={(values, { resetForm }) => {
          dispatch(addTodo({ userId: user, text: values.text }));
          resetForm();
        }}
      >
        {({ handleSubmit }) => (
          <Form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 mt-4">
            <div className="w-full">
              <Field
                name="text"
                type="text"
                className="p-2 border rounded w-full"
                placeholder="Add a todo"
              />
              <ErrorMessage name="text" component="div" className="text-red-500 text-sm mt-1" />
            </div>
            <button
              type="submit"
              className="bg-green-500 text-white p-2 rounded min-w-[80px]"
            >
              Add
            </button>
          </Form>
        )}
      </Formik>

      <ul className="mt-4">
        {todos.map((todo :Todo) => (
          <li key={todo._id} className="flex items-center justify-between p-2 border-b">
            <div className="flex items-center justify-between p-2 w-full">
              {isEditing === todo._id ? (
                <input
                  className="border p-1 mr-2 w-full"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />
              ) : (
                <span className={`flex-1 ${todo.completed ? "line-through text-gray-400" : ""}`}>
                  {todo.text}
                </span>
              )}

              <div className="ml-2 flex-shrink-0 flex gap-2">
                {isEditing === todo._id ? (
                  <button
                    onClick={() => {
                      dispatch(updateTodo({ userId: user, id: todo._id, text: editText }));
                      setIsEditing(null);
                    }}
                    className="bg-blue-500 text-white p-1 rounded"
                  >
                    Save
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setIsEditing(todo._id);
                      setEditText(todo.text);
                    }}
                    className="bg-green-500 text-white p-1 rounded"
                  >
                    Update
                  </button>
                )}
                <button
                  onClick={() =>
                    dispatch(toggleTodo({ userId: user, id: todo._id, currentStatus: todo.completed }))
                  }
                  className="bg-yellow-500 text-white p-1 rounded"
                >
                  Toggle
                </button>

                <button
                  onClick={() => dispatch(deleteTodo({ userId: user, id: todo._id }))}
                  className="bg-red-500 text-white p-1 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LandingPage;
