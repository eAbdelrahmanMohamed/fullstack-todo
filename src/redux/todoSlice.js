var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
// Fetch Todos action
export const fetchTodos = createAsyncThunk("todos/fetchTodos", (_, thunkAPI) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            return thunkAPI.rejectWithValue("No token found");
        }
        const email = JSON.parse(atob(token.split(".")[1])).email;
        const res = yield axios.get(`http://localhost:5000/api/todos/fetchTodos`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return { userId: email, todos: res.data };
    }
    catch (err) {
        return thunkAPI.rejectWithValue(((_b = (_a = err.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || "Error fetching todos");
    }
}));
// Add Todo action
export const addTodo_endpoint = createAsyncThunk("todos/addTodo", ({ userId, text }, thunkAPI) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = localStorage.getItem("token");
        if (!token)
            throw new Error("No token found");
        const res = yield axios.post(`http://localhost:5000/api/todos/addTodo`, { userId, text }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return { userId, todo: res.data };
    }
    catch (err) {
        return thunkAPI.rejectWithValue("Failed to add todo");
    }
}));
// Toggle Todo action
export const toggleTodo_endpoint = createAsyncThunk("todos/toggleTodo", ({ userId, id, currentStatus }, thunkAPI) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = localStorage.getItem("token");
        if (!token)
            throw new Error("No token found");
        const res = yield axios.patch(`http://localhost:5000/api/todos/toggleTodo/${id}`, { toggle: !currentStatus }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return { userId, todo: res.data };
    }
    catch (err) {
        return thunkAPI.rejectWithValue("Failed to toggle todo");
    }
}));
// Update Todo action
export const updateTodo_endpoint = createAsyncThunk("todos/updateTodo", ({ userId, id, text }, thunkAPI) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = localStorage.getItem("token");
        if (!token)
            throw new Error("No token found");
        const res = yield axios.patch(`http://localhost:5000/api/todos/updateTodo/${id}`, { text }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return { userId, todo: res.data };
    }
    catch (err) {
        return thunkAPI.rejectWithValue("Failed to update todo");
    }
}));
// Delete Todo action
export const deleteTodo_endpoint = createAsyncThunk("todos/deleteTodo", ({ userId, id }, thunkAPI) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = localStorage.getItem("token");
        if (!token)
            throw new Error("No token found");
        yield axios.delete(`http://localhost:5000/api/todos/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return { userId, id };
    }
    catch (err) {
        return thunkAPI.rejectWithValue("Failed to delete todo");
    }
}));
// Initial State: Empty object to store todos by userId
const initialState = {};
const todoSlice = createSlice({
    name: "todos",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTodos.fulfilled, (state, action) => {
            state[action.payload.userId] = action.payload.todos;
        })
            .addCase(addTodo_endpoint.fulfilled, (state, action) => {
            const { userId, todo } = action.payload;
            if (!state[userId])
                state[userId] = [];
            state[userId].push(todo);
        })
            .addCase(toggleTodo_endpoint.fulfilled, (state, action) => {
            const todos = state[action.payload.userId];
            const index = todos.findIndex((todo) => todo._id === action.payload.todo._id);
            if (index !== -1)
                todos[index] = action.payload.todo;
        })
            .addCase(updateTodo_endpoint.fulfilled, (state, action) => {
            const todos = state[action.payload.userId];
            const index = todos.findIndex((todo) => todo._id === action.payload.todo._id);
            if (index !== -1)
                todos[index] = action.payload.todo;
        })
            .addCase(deleteTodo_endpoint.fulfilled, (state, action) => {
            const { userId, id } = action.payload;
            if (state[userId]) {
                state[userId] = state[userId].filter((todo) => todo._id !== id);
            }
        });
    },
});
export default todoSlice.reducer;
