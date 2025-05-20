import React, { useState, useEffect } from "react";
import "./ToDoList.css";

function ToDoList() {
    const [tasks, setTasks] = useState(() => {
        const savedTasks = localStorage.getItem('tasks');
        return savedTasks ? JSON.parse(savedTasks) : [];
    });
    const [newTask, setNewTask] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [filter, setFilter] = useState("all"); // all, active, completed
    const [editingTask, setEditingTask] = useState(null);
    const [priority, setPriority] = useState("medium"); // low, medium, high
    const [category, setCategory] = useState("personal"); // Added category state
    const [categoryFilter, setCategoryFilter] = useState("all"); // Added category filter

    // Predefined categories
    const categories = [
        "personal",
        "work",
        "shopping",
        "health",
        "education",
        "other"
    ];

    useEffect(() => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }, [tasks]);

    // Storage management functions
    function saveToStorage() {
        try {
            localStorage.setItem('tasks', JSON.stringify(tasks));
            alert('Tasks saved successfully!');
        } catch (error) {
            alert('Failed to save tasks: ' + error.message);
        }
    }

    function clearStorage() {
        if (window.confirm('Are you sure you want to clear all tasks? This cannot be undone.')) {
            try {
                localStorage.removeItem('tasks');
                setTasks([]);
                alert('Storage cleared successfully!');
            } catch (error) {
                alert('Failed to clear storage: ' + error.message);
            }
        }
    }

    function handleInputChange(event) {
        setNewTask(event.target.value);
    }

    function addTask() {
        if (newTask.trim() !== "") {
            const task = {
                id: Date.now(),
                text: newTask,
                completed: false,
                priority: priority,
                category: category, // Added category to task
                createdAt: new Date().toISOString()
            };
            setTasks(t => [...t, task]);
            setNewTask("");
            setPriority("medium");
            // Keep the category selected for consecutive tasks
        }
    }

    function deleteTask(id) {
        setTasks(tasks.filter(task => task.id !== id));
    }

    function toggleTask(id) {
        setTasks(tasks.map(task =>
            task.id === id ? { ...task, completed: !task.completed } : task
        ));
    }

    function editTask(id, newText) {
        setTasks(tasks.map(task =>
            task.id === id ? { ...task, text: newText } : task
        ));
    }

    const handleEditInputChange = (id, newText) => {
        setTasks(tasks.map(task =>
            task.id === id ? { ...task, text: newText } : task
        ));
    };

    const finishEditing = () => {
        setEditingTask(null);
    };

    function moveTaskUp(index) {
        if (index > 0) {
            const updatedTasks = [...tasks];
            [updatedTasks[index], updatedTasks[index - 1]] =
                [updatedTasks[index - 1], updatedTasks[index]];
            setTasks(updatedTasks);
        }
    }

    function moveTaskDown(index) {
        if (index < tasks.length - 1) {
            const updatedTasks = [...tasks];
            [updatedTasks[index], updatedTasks[index + 1]] =
                [updatedTasks[index + 1], updatedTasks[index]];
            setTasks(updatedTasks);
        }
    }

    const filteredTasks = tasks
        .filter(task => task.text.toLowerCase().includes(searchTerm.toLowerCase()))
        .filter(task => {
            if (filter === "active") return !task.completed;
            if (filter === "completed") return task.completed;
            return true;
        })
        .filter(task => {
            if (categoryFilter === "all") return true;
            return task.category === categoryFilter;
        });

    return (
        <div className="to-do-list">
            <div className="container">
                <h1>Your To-Do List</h1>
                <p className="subtitle">Organize your tasks with ease</p>
                
                <div className="add-task-section">
                    <input
                        type="text"
                        placeholder="Enter a task..."
                        value={newTask}
                        onChange={handleInputChange}
                        onKeyPress={(e) => e.key === 'Enter' && addTask()}
                    />
                    <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                        className="priority-select"
                    >
                        <option value="low">Low Priority</option>
                        <option value="medium">Medium Priority</option>
                        <option value="high">High Priority</option>
                    </select>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="category-select"
                    >
                        {categories.map(cat => (
                            <option key={cat} value={cat}>
                                {cat.charAt(0).toUpperCase() + cat.slice(1)}
                            </option>
                        ))}
                    </select>
                    <button className="add-button" onClick={addTask}>Add Task</button>
                </div>

                <div className="filter-section">
                    <input
                        type="text"
                        placeholder="Search tasks..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="filter-select"
                    >
                        <option value="all">All Tasks</option>
                        <option value="active">Active</option>
                        <option value="completed">Completed</option>
                    </select>
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="category-filter-select"
                    >
                        <option value="all">All Categories</option>
                        {categories.map(cat => (
                            <option key={cat} value={cat}>
                                {cat.charAt(0).toUpperCase() + cat.slice(1)}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="storage-section">
                    <button className="storage-button save-button" onClick={saveToStorage}>
                        💾 Save Tasks
                    </button>
                    <button className="storage-button clear-button" onClick={clearStorage}>
                        🗑️ Clear Storage
                    </button>
                </div>

                <ul className="task-list">
                    {filteredTasks.map((task, index) => (
                        <li key={task.id} className={`task-item ${task.completed ? 'completed' : ''} priority-${task.priority} category-${task.category}`}>
                            {editingTask === task.id ? (
                                <input
                                    type="text"
                                    value={task.text}
                                    onChange={(e) => handleEditInputChange(task.id, e.target.value)}
                                    onBlur={finishEditing}
                                    onKeyPress={(e) => e.key === 'Enter' && finishEditing()}
                                    autoFocus
                                />
                            ) : (
                                <>
                                    <div className="task-row">
                                        <input
                                            type="checkbox"
                                            checked={task.completed}
                                            onChange={() => toggleTask(task.id)}
                                            className="task-checkbox"
                                        />
                                        <div className="task-content">
                                            <span className="task-text" onClick={() => setEditingTask(task.id)}>
                                                {task.text}
                                            </span>
                                            <span className="task-category">{task.category}</span>
                                        </div>
                                    </div>
                                    <div className="task-actions">
                                        <button
                                            className="move-button"
                                            onClick={() => moveTaskUp(index)}
                                            disabled={index === 0}
                                        >
                                            ▲
                                        </button>
                                        <button
                                            className="move-button"
                                            onClick={() => moveTaskDown(index)}
                                            disabled={index === tasks.length - 1}
                                        >
                                            ▼
                                        </button>
                                        <button
                                            className="delete-button"
                                            onClick={() => deleteTask(task.id)}
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default ToDoList;