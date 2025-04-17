import { createSlice } from "@reduxjs/toolkit";

const storedTasks = JSON.parse(localStorage.getItem("todos")) || [];

const todoSlice = createSlice({
  name: "todos",
  initialState: storedTasks,
  reducers: {
    addTodo: (state, action) => {
      const newTodo = {
        id: Date.now(),
        text: action.payload,
        completed: false
      };
      const updatedState = [...state, newTodo];
      localStorage.setItem("todos", JSON.stringify(updatedState));
      return updatedState;
    },

    deleteTodo: (state, action) => {
      const updatedState = state.filter(todo => todo.id !== action.payload);
      localStorage.setItem("todos", JSON.stringify(updatedState));
      return updatedState;
    },

    toggleTodo: (state, action) => {
      const updatedState = state.map(todo =>
        todo.id === action.payload
          ? { ...todo, completed: !todo.completed }
          : todo
      );
      localStorage.setItem("todos", JSON.stringify(updatedState));
      return updatedState;
    },

    updateTodo: (state, action) => {
      const { id, text } = action.payload;
      const updatedState = state.map(todo =>
        todo.id === id ? { ...todo, text } : todo
      );
      localStorage.setItem("todos", JSON.stringify(updatedState));
      return updatedState;
    }
  }
});

export const { addTodo, deleteTodo, toggleTodo, updateTodo } = todoSlice.actions;
export default todoSlice.reducer;
