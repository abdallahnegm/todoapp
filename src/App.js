import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [todos, setTodos] = useState([]);
  const [todo, setTodo] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [filter, setFilter] = useState("all");

  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationId, setCelebrationId] = useState(0);

  useEffect(() => {
    const storedTodos = localStorage.getItem("todos");

    if (storedTodos) {
      try {
        const parsedTodos = JSON.parse(storedTodos);

        if (Array.isArray(parsedTodos)) {
          setTodos(parsedTodos);
        }
      } catch {
        setTodos([]);
      }
    }

    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("todos", JSON.stringify(todos));
    }
  }, [todos, isLoaded]);

  const saveTodo = () => {
    if (!todo.trim()) return;

    const newItem = {
      completed: false,
      todo: todo.trim(),
    };

    setTodos((prevTodos) => [...prevTodos, newItem]);
    setTodo("");
    setFilter("all");
  };

  const handleItemDone = (index) => {
    const isCompleting = !todos[index].completed;

    const updatedTodos = todos.map((item, i) =>
      i === index ? { ...item, completed: !item.completed } : item,
    );

    setTodos(updatedTodos);

    if (isCompleting) {
      setShowCelebration(true);
      setCelebrationId((prev) => prev + 1);
    }
  };

  useEffect(() => {
    if (!showCelebration) return;

    const timer = setTimeout(() => {
      setShowCelebration(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, [showCelebration, celebrationId]);

  const handleDeleteItem = (index) => {
    const updatedTodos = todos.filter((item, i) => i !== index);

    setTodos(updatedTodos);
  };

  const completedTodos = todos.filter((item) => item.completed).length;
  const totalTodos = todos.length;

  const progress =
    totalTodos === 0 ? 0 : Math.round((completedTodos / totalTodos) * 100);

  const filteredTodos = todos.filter((item) => {
    if (filter === "active") return !item.completed;
    if (filter === "completed") return item.completed;

    return true;
  });

  return (
    <div className="App">
      {showCelebration && (
        <div className="celebration-burst" key={celebrationId}>
          {Array.from({ length: 24 }).map((_, index) => (
            <span key={index}></span>
          ))}
        </div>
      )}

      <h2>Todo List</h2>

      <p className="subtitle">Organize your tasks and stay productive.</p>

      <div className="progress-section">
        <div className="progress-info">
          <span>Your Progress</span>
          <span>{progress}%</span>
        </div>

        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <div className="progress-stats">
          <span>{completedTodos} Completed</span>
          <span>{totalTodos - completedTodos} Remaining</span>
        </div>
      </div>

      <div className="to-do-container">
        <div className="filters">
          <button
            className={filter === "all" ? "active-filter" : ""}
            onClick={() => setFilter("all")}
          >
            All ({totalTodos})
          </button>

          <button
            className={filter === "active" ? "active-filter" : ""}
            onClick={() => setFilter("active")}
          >
            Active ({totalTodos - completedTodos})
          </button>

          <button
            className={filter === "completed" ? "active-filter" : ""}
            onClick={() => setFilter("completed")}
          >
            Completed ({completedTodos})
          </button>
        </div>

        <ul>
          {filteredTodos.length > 0 ? (
            filteredTodos.map((item) => {
              const originalIndex = todos.indexOf(item);

              return (
                <div key={originalIndex} className="item">
                  <li
                    className={item.completed ? "done" : ""}
                    onClick={() => handleItemDone(originalIndex)}
                  >
                    {item.todo}
                  </li>

                  <span
                    className="trash"
                    onClick={() => handleDeleteItem(originalIndex)}
                  >
                    ❌
                  </span>
                </div>
              );
            })
          ) : (
            <div className="empty-state">
              <div className="empty-icon">{totalTodos === 0 ? "📝" : "🎉"}</div>

              <h3>
                {totalTodos === 0
                  ? "No tasks yet!"
                  : filter === "active"
                    ? "All caught up!"
                    : "No completed tasks"}
              </h3>

              <p>
                {totalTodos === 0
                  ? "Add your first task and start being productive."
                  : filter === "active"
                    ? "You've completed all your tasks. Great job!"
                    : "Complete a task and it will appear here."}
              </p>
            </div>
          )}
        </ul>

        <input
          placeholder="What needs to be done?"
          value={todo}
          onChange={(e) => setTodo(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") saveTodo();
          }}
        />

        <button className="add-btn" onClick={saveTodo}>
          + Add Task
        </button>
      </div>
    </div>
  );
}

export default App;
