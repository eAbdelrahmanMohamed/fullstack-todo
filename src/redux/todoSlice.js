import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000/api/todos";
export const fetchTodos = createAsyncThunk("todos/fetchTodos", async () => {
  const token = localStorage.getItem("token");
  const email = JSON.parse(atob(token.split(".")[1])).email;

  const res = await axios.get("http://localhost:5000/api/todos/fetchTodos", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return { userId: email, todos: res.data };
});

export const addTodo_endpoint = createAsyncThunk(
  "todos/addTodo",
  async ({ userId, text }) => {
    const token = localStorage.getItem("token");
    const res = await axios.post(
      `${API_URL}/addTodo`,
      { userId, text },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return { userId, todo: res.data };
  }
);

export const toggleTodo_endpoint = createAsyncThunk(
  "todos/toggleTodo",
  async ({ userId, id, currentStatus }) => {
    const token = localStorage.getItem("token");
    const res = await axios.patch(
      `${API_URL}/toggleTodo/${id}`,
      { toggle: !currentStatus },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return { userId, todo: res.data };
  }
);

export const updateTodo_endpoint = createAsyncThunk(
  "todos/updateTodo",
  async ({ userId, id, text }) => {
    const token = localStorage.getItem("token");
    const res = await axios.patch(
      `${API_URL}/updateTodo/${id}`,
      { text },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return { userId, todo: res.data };
  }
);

export const deleteTodo_endpoint = createAsyncThunk(
  "todos/deleteTodo",
  async ({ userId, id }) => {
    const token = localStorage.getItem("token");
    await axios.delete(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return { userId, id };
  }
);

const initialState = {};

const todoSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state[action.payload.userId] = action.payload.todos;
      })
      .addCase(addTodo_endpoint.fulfilled, (state, action) => {
        const { userId, todo } = action.payload;
        if (!state[userId]) state[userId] = [];
        state[userId].push(todo);
      })
      .addCase(toggleTodo_endpoint.fulfilled, (state, action) => {
        const todos = state[action.payload.userId];
        const index = todos.findIndex(
          todo => todo._id === action.payload.todo._id
        );
        if (index !== -1) todos[index] = action.payload.todo;
      })
      .addCase(updateTodo_endpoint.fulfilled, (state, action) => {
        const todos = state[action.payload.userId];
        const index = todos.findIndex(
          todo => todo._id === action.payload.todo._id
        );
        if (index !== -1) todos[index] = action.payload.todo;
      })
      .addCase(deleteTodo_endpoint.fulfilled, (state, action) => {
        state[action.payload.userId] = state[action.payload.userId].filter(
          todo => todo._id !== action.payload.id
        );
      });
  }
});

export default todoSlice.reducer;
