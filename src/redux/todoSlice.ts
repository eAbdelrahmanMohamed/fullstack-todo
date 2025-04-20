import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

// Define types for Todo and UserId
interface Todo {
  _id: string;
  text: string;
  completed: boolean;
}

interface TodoState {
  [userId: string]: Todo[]; // Maps userId to an array of todos
}

interface AddTodoPayload {
  userId: string;
  text: string;
}

interface ToggleTodoPayload {
  userId: string;
  id: string;
  currentStatus: boolean;
}

interface UpdateTodoPayload {
  userId: string;
  id: string;
  text: string;
}

interface DeleteTodoPayload {
  userId: string;
  id: string;
}

// Define async thunk action types
interface AsyncThunkConfig {
  rejectValue: string;
}

// Fetch Todos action
export const fetchTodos = createAsyncThunk<{ userId: string; todos: Todo[] }, void, AsyncThunkConfig>(
  "todos/fetchTodos",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return thunkAPI.rejectWithValue("No token found");
      }
      const email = JSON.parse(atob(token.split(".")[1])).email;

      const res = await axios.get(`http://localhost:5000/api/todos/fetchTodos`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return { userId: email, todos: res.data };
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Error fetching todos");
    }
  }
);

// Add Todo action
export const addTodo_endpoint = createAsyncThunk<{ userId: string; todo: Todo }, AddTodoPayload, AsyncThunkConfig>(
  "todos/addTodo",
  async ({ userId, text }, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const res = await axios.post(
        `http://localhost:5000/api/todos/addTodo`,
        { userId, text },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return { userId, todo: res.data };
    } catch (err: any) {
      return thunkAPI.rejectWithValue("Failed to add todo");
    }
  }
);

// Toggle Todo action
export const toggleTodo_endpoint = createAsyncThunk<{ userId: string; todo: Todo }, ToggleTodoPayload, AsyncThunkConfig>(
  "todos/toggleTodo",
  async ({ userId, id, currentStatus }, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const res = await axios.patch(
        `http://localhost:5000/api/todos/toggleTodo/${id}`,
        { toggle: !currentStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return { userId, todo: res.data };
    } catch (err: any) {
      return thunkAPI.rejectWithValue("Failed to toggle todo");
    }
  }
);

// Update Todo action
export const updateTodo_endpoint = createAsyncThunk<{ userId: string; todo: Todo }, UpdateTodoPayload, AsyncThunkConfig>(
  "todos/updateTodo",
  async ({ userId, id, text }, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const res = await axios.patch(
        `http://localhost:5000/api/todos/updateTodo/${id}`,
        { text },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return { userId, todo: res.data };
    } catch (err: any) {
      return thunkAPI.rejectWithValue("Failed to update todo");
    }
  }
);

// Delete Todo action
export const deleteTodo_endpoint = createAsyncThunk<{ userId: string; id: string }, DeleteTodoPayload, AsyncThunkConfig>(
  "todos/deleteTodo",
  async ({ userId, id }, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      await axios.delete(`http://localhost:5000/api/todos/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return { userId, id };
    } catch (err: any) {
      return thunkAPI.rejectWithValue("Failed to delete todo");
    }
  }
);

// Initial State: Empty object to store todos by userId
const initialState: TodoState = {};

const todoSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.fulfilled, (state, action: PayloadAction<{ userId: string; todos: Todo[] }>) => {
        state[action.payload.userId] = action.payload.todos;
      })
      .addCase(addTodo_endpoint.fulfilled, (state, action: PayloadAction<{ userId: string; todo: Todo }>) => {
        const { userId, todo } = action.payload;
        if (!state[userId]) state[userId] = [];
        state[userId].push(todo);
      })
      .addCase(toggleTodo_endpoint.fulfilled, (state, action: PayloadAction<{ userId: string; todo: Todo }>) => {
        const todos = state[action.payload.userId];
        const index = todos.findIndex(
          (todo) => todo._id === action.payload.todo._id
        );
        if (index !== -1) todos[index] = action.payload.todo;
      })
      .addCase(updateTodo_endpoint.fulfilled, (state, action: PayloadAction<{ userId: string; todo: Todo }>) => {
        const todos = state[action.payload.userId];
        const index = todos.findIndex(
          (todo) => todo._id === action.payload.todo._id
        );
        if (index !== -1) todos[index] = action.payload.todo;
      })
      .addCase(deleteTodo_endpoint.fulfilled, (state, action: PayloadAction<{ userId: string; id: string }>) => {
        const { userId, id } = action.payload;
        if (state[userId]) {
          state[userId] = state[userId].filter((todo) => todo._id !== id);
        }
      });
  },
});

export default todoSlice.reducer;
