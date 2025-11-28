// src/components/TaskList.tsx
import type { Task } from "../types";

// Define the type for the component's props
interface TaskListProps {
  tasks: Task[];
}

const TaskList: React.FC<TaskListProps> = ({ tasks }) => {
  if (tasks.length === 0) {
    return <p className="empty-message">Looks like you have a clear schedule!</p>;
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <div key={task.id} className="task-item">
          <input type="checkbox" checked={task.completed} readOnly />
          <div className="task-details">
            <span className="task-text">{task.text}</span>
            {task.deadline && <span className="task-deadline">Due: {task.deadline}</span>}
          </div>
          <span className="task-list-tag">{task.list}</span>
        </div>
      ))}
    </div>
  );
};

export default TaskList;
