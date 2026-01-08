import React, { useEffect, useRef, useState } from "react";
import "../components/task.css";
import SideBar from "./SideBar";

const API_BASE = "http://localhost:3001";

const Task = () => {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [priority, setPriority] = useState("high");
  const inputRef = useRef(null);

  const getToken = () => localStorage.getItem("accessToken");

  // ---------------- FETCH TASKS ----------------
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/tasks`, {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch tasks");

        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error("Error fetching tasks:", error.message);
      }
    };

    fetchTasks();
  }, []);

  // ---------------- ADD / UPDATE TASK ----------------
  const handleAdd = async () => {
    if (!task.trim()) return;

    try {
      if (editIndex !== null) {
        // UPDATE
        const taskId = tasks[editIndex]._id;

        const response = await fetch(`${API_BASE}/api/tasks/${taskId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
          body: JSON.stringify({ title: task, priority }),
        });

        if (!response.ok) throw new Error("Update failed");

        const updatedTask = await response.json();
        const updatedTasks = [...tasks];
        updatedTasks[editIndex] = updatedTask.task || updatedTask;
        setTasks(updatedTasks);
        setEditIndex(null);
      } else {
        // ADD
        const response = await fetch(`${API_BASE}/api/tasks`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
          body: JSON.stringify({ title: task, priority }),
        });

        if (!response.ok) throw new Error("Create failed");

        const newTask = await response.json();
        setTasks([newTask.task || newTask, ...tasks]);
      }

      setTask("");
    } catch (error) {
      console.error("Task action failed:", error.message);
    }
  };

  // ---------------- DELETE TASK ----------------
  const handleDelete = async (indexToDelete) => {
    const taskId = tasks[indexToDelete]._id;

    try {
      const response = await fetch(`${API_BASE}/api/tasks/${taskId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      if (!response.ok) throw new Error("Delete failed");

      setTasks(tasks.filter((_, index) => index !== indexToDelete));
    } catch (error) {
      console.error("Error deleting task:", error.message);
    }
  };

  // ---------------- TOGGLE COMPLETE ----------------
  const toggleComplete = async (indexToToggle) => {
    const taskToUpdate = tasks[indexToToggle];

    try {
      const response = await fetch(`${API_BASE}/api/tasks/${taskToUpdate._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ completed: !taskToUpdate.completed }),
      });

      if (!response.ok) throw new Error("Toggle failed");

      const updatedTask = await response.json();
      setTasks(
        tasks.map((item, index) =>
          index === indexToToggle ? updatedTask.task || updatedTask : item
        )
      );
    } catch (error) {
      console.error("Toggle failed:", error.message);
    }
  };

  // ---------------- EDIT ----------------
  const handleEdit = (index) => {
    setTask(tasks[index].title);
    setPriority(tasks[index].priority);
    setEditIndex(index);
    inputRef.current?.focus();
  };

  // ---------------- UI ----------------
  return (
    <>
      <h2 className="headingTask">
        🗓️ Daily Productivity Task Tracker: Action Items and Completion Status
      </h2>

      <div className="task-add-row">
        <input
          ref={inputRef}
          type="text"
          className="input-task"
          placeholder="Enter Task Here"
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />

        <select
          className="priority-select"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        <button className="btn-task-add" onClick={handleAdd}>
          {editIndex !== null ? "Update" : "Add"}
        </button>
      </div>

      <div className="task-header">
        <span>Status</span>
        <span>Priority</span>
        <span>Task</span>
        <span>Actions</span>
      </div>

      <ul className="task-list">
        {tasks.map((item, index) => (
          <li key={item._id} className="task-row">
            <input
              type="checkbox"
              checked={item.completed}
              onChange={() => toggleComplete(index)}
            />

            <span className={`priority ${item.priority}`}>
              {item.priority}
            </span>

            <span className={item.completed ? "completed" : ""}>
              {item.title}
            </span>

            <div>
              <button onClick={() => handleEdit(index)}>Edit</button>
              <button onClick={() => handleDelete(index)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};

export default Task;
