import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { Task } from "../Task/types";
import { useAuth } from "./useData/AuthContext";

interface TaskContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, "id" | "createdAt" | "createdBy">) => void;
  updateTask: (task: Task) => void;
  deleteTask: (id: number) => void;
  toggleTaskStatus: (task: Task) => void;
  getMyTasks: () => Task[];
  getAssignedTasks: () => Task[];
  getAllTasks: () => Task[];
  canCreateTasks: boolean;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTaskContext must be used within a TaskProvider");
  }
  return context;
};

interface TaskProviderProps {
  children: ReactNode;
}

export const TaskProvider = ({ children }: TaskProviderProps) => {
  const { currentUser, isAdmin } = useAuth();
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const savedTasks = localStorage.getItem("tasks");
      if (savedTasks) {
        const parsedTasks = JSON.parse(savedTasks);
        return parsedTasks.map((task: any) => ({
          ...task,
          createdAt: new Date(task.createdAt),
        }));
      }
      return [];
    } catch (error) {
      console.error("Error loading tasks:", error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    } catch (error) {
      console.error("Error saving tasks:", error);
    }
  }, [tasks]);

  const addTask = (taskData: Omit<Task, "id" | "createdAt" | "createdBy">) => {
    if (!currentUser) {
      console.error("Must be logged in to add tasks");
      return;
    }

    if (!isAdmin()) {
      console.error("Only administrators can create tasks");
      return;
    }

    const newTask: Task = {
      ...taskData,
      id: Date.now(),
      createdAt: new Date(),
      createdBy: currentUser.id,
    };
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  const updateTask = (updatedTask: Task) => {
    if (!currentUser) {
      console.error("Must be logged in to update tasks");
      return;
    }

    // Allow admin to update any task
    if (!isAdmin() && updatedTask.assignedTo !== currentUser.id) {
      console.error("You can only update tasks assigned to you");
      return;
    }

    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
  };

  const deleteTask = (id: number) => {
    if (!currentUser) {
      console.error("Must be logged in to delete tasks");
      return;
    }

    // Find the task to check ownership
    const taskToDelete = tasks.find((task) => task.id === id);
    if (!taskToDelete) {
      console.error("Task not found");
      return;
    }

    // Allow deletion if user is admin or if the task is assigned to them
    if (!isAdmin() && taskToDelete.assignedTo !== currentUser.id) {
      console.error("You can only delete tasks assigned to you");
      return;
    }

    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };

  const toggleTaskStatus = (task: Task) => {
    if (!currentUser) {
      console.error("Must be logged in to update task status");
      return;
    }

    // Allow admin to toggle any task status
    if (!isAdmin() && task.assignedTo !== currentUser.id) {
      console.error("You can only update status of tasks assigned to you");
      return;
    }

    const newStatus = task.status === "completed" ? "pending" : "completed";
    updateTask({ ...task, status: newStatus });
  };

  const getMyTasks = () => {
    if (!currentUser) return [];
    // For admin, show created tasks. For users, show assigned tasks
    return isAdmin()
      ? tasks.filter((task) => task.createdBy === currentUser.id)
      : tasks.filter((task) => task.assignedTo === currentUser.id);
  };

  const getAssignedTasks = () => {
    if (!currentUser) return [];
    return tasks.filter((task) => task.assignedTo === currentUser.id);
  };

  const getAllTasks = () => {
    if (!currentUser) return [];
    // Only admin can see all tasks
    return isAdmin() ? tasks : [];
  };

  const value = {
    tasks: currentUser ? tasks : [],
    addTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    getMyTasks,
    getAssignedTasks,
    getAllTasks,
    canCreateTasks: isAdmin(),
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

export default TaskContext;
