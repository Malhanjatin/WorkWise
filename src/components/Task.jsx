import React, { useEffect, useRef, useState } from "react";
import "../components/task.css";
import SideBar from "./SideBar";
const Task = () => {
  const [task, setTask] = useState("");


  const [tasks, setTasks] = useState(() => {
  const saved = localStorage.getItem("tasks");   // Use a lazy initializer for tasks so localStorage loads BEFORE first render.
  return saved ? JSON.parse(saved) : [];
});
  const [editIndex, setEditIndex] = useState(null);

  const [priority, setPriority] = useState('high');
  const inputRef = useRef(null);

  const handleChange = (e) => {
    setTask(e.target.value);
  };

  const handleEdit = (index) => {
    console.log(tasks[index]);
    setTask(tasks[index].text);
    setEditIndex(index);
    inputRef.current?.focus();
  };

  const handleDelete = (indexToDelete) => {
    const updatedTask = tasks.filter((_, index) => index !== indexToDelete);
    setTasks(updatedTask);
  };

  const handleAdd = () => {
    if (task.trim() === "") return;

    if (editIndex !== null) {
      const updated = [...tasks];
      updated[editIndex].text = task;
       updated[editIndex].priority = priority || "medium";
      setTasks(updated);
      setEditIndex(null);
    } else {
      setTasks([...tasks, { text: task, completed: false ,priority:priority|| "medium"}]);
    }
    setTask("");
  };

  const toggleComplete = (indexToToggle) => {
    const updatedtasks = tasks.map((item, index) => {
      if (index === indexToToggle) {
        return { ...item, completed: !item.completed };
      }
      return item;
    });
    setTasks(updatedtasks);
  };
useEffect(()=>{
const savedData= localStorage.getItem('tasks')
if(savedData) setTasks(JSON.parse(savedData))
},[])
useEffect(()=>{
    localStorage.setItem("tasks", JSON.stringify(tasks))
},[tasks])
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
          onChange={handleChange}
          value={task}
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
   {/* Header like the image */}
      <div className="task-header">
        <span className="status">Status</span>
        <span className="priority">Priority</span>
        <span className="task">Task</span>
        <span>Actions</span>
      </div>

      <ul className="task-list">
        {tasks.map((item, index) => (
          <li key={index} className="task-row">
            <div className="col-status">
              <input
                type="checkbox"
                checked={item.completed}
                onChange={() => {
                  toggleComplete(index);
                }}
              />
            </div>
    {/* PRIORITY */}
            <div className={`col-priority ${item.priority?.toLowerCase()}`}>{item.priority}</div>


            {/* TASK TEXT */}
            <div className="col-text">
              <span className={item.completed ? "completed" : ""}>
                {item.text}
              </span>
            </div>
       {/* ACTIONS */}


            <div className="col-actions">
              <button
                className="btn-task-edit"
                onClick={() => handleEdit(index)}
              > Edit</button>
              <button
                className="btn-task-delete"
                onClick={() => handleDelete(index)}
              >Delete</button>
            </div>
          </li>
       
        ))}
      </ul>
  
    </>
  );
};

export default Task;
