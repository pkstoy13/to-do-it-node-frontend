"use client";
import { useState, useEffect } from "react";
import axios from "../../utils/axios";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

const TodosPage = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [username, setUsername] = useState("");
  const router = useRouter();

  const [editingTodoId, setEditingTodoId] = useState(null); // Track the ID of the todo being edited
  const [editTodoTitle, setEditTodoTitle] = useState("");

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await axios.get("/todos");
        console.log(response.data);
        setTodos(response.data);
      } catch (error) {
        console.error("Error fetching todos:", error);
      }
    };
    fetchTodos();
  }, []);

  const handleAddTodo = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/todos", { title: newTodo });
      console.log("Added New Todo:", response.data);
      setTodos([...todos, response.data]);
      setNewTodo("");
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  const handleDeleteTodo = async (_id) => {
    console.log("Deleting todo with ID:", _id);
    try {
      await axios.delete(`/todos/${_id}`);
      setTodos(todos.filter((todo) => todo._id !== _id)); // Update to filter by _id
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  // Start editing a todo
  const handleEditTodo = (_id, currentTitle) => {
    setEditingTodoId(_id); // Set the current todo as the one being edited
    setEditTodoTitle(currentTitle); // Set the current title in the input field
  };

  // Save the edited todo
  const handleSaveTodo = async (_id) => {
    console.log("Updating todo with ID:", _id);
    try {
      const response = await axios.put(`/todos/${_id}`, {
        title: editTodoTitle,
      });
      setTodos(
        todos.map(
          (todo) =>
            todo._id === _id ? { ...todo, title: editTodoTitle } : todo // Update to use _id
        )
      );
      setEditingTodoId(null); // Exit edit mode
      setEditTodoTitle(""); // Clear input field
    } catch (error) {
      console.error("Error saving todo:", error);
    }
  };

  // Cancel the editing process
  const handleCancelEdit = () => {
    setEditingTodoId(null); // Exit edit mode
    setEditTodoTitle(""); // Clear input field
  };

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token"); // Clear the token from localStorage
    router.push("/"); // Redirect user to the home page
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-3xl p-2">
        {username ? `${username}'s Todos` : "My Todos"}{" "}
        <button
          onClick={handleLogout}
          className="hover:bg-slate-200 text-lg p-2"
        >
          Logout
        </button>
      </h1>

      <form onSubmit={handleAddTodo}>
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new todo"
          required
          className="p-2 pr-24 text-xl rounded-md bg-zinc-200 mr-2"
        />
        <button type="submit" className="hover:bg-slate-200 p-2">
          Add Todo
        </button>
      </form>

      <ul>
        {todos.map((todo) => (
          <li
            className="text-xl flex justify-end mt-4 items-center"
            key={todo._id}
          >
            {" "}
            {/* Change key to _id */}
            {/* Check if the current todo is in edit mode */}
            {editingTodoId === todo._id ? ( // Change to _id
              <div className="flex items-center">
                <input
                  type="text"
                  value={editTodoTitle}
                  onChange={(e) => setEditTodoTitle(e.target.value)}
                  className="p-2 text-xl rounded-md bg-zinc-200 mr-2"
                />
                <button
                  onClick={() => handleSaveTodo(todo._id)} // Change to _id
                  className="hover:bg-slate-200 p-2"
                >
                  Save
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="hover:bg-slate-200 p-2 ml-2"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div>
                {todo.title}
                <button
                  onClick={() => handleEditTodo(todo._id, todo.title)} // Change to _id
                  className="hover:bg-slate-200 ml-24 p-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteTodo(todo._id)} // Change to _id
                  className="hover:bg-slate-200 p-2 ml-4"
                >
                  Delete
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodosPage;
