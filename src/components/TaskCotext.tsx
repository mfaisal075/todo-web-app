import React, {useContext, createContext, useState, useEffect} from 'react';
import {Task} from './TaskIterface';
import {collection, doc, getDocs, updateDoc} from 'firebase/firestore';
import {FIRESTORE_DB} from '../../FirebaseConfig';
import {Alert} from 'react-native';

const TaskContext = createContext<TaskContextType | undefined>(undefined);

interface TaskContextType {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  deleteTask: (taskId: string, reason: string) => void;
  allTasksCount: number;
  newTasksCount: number;
  pendingTasksCount: number;
  completedTasksCount: number;
  deletedTasksCount: number;
  fetchTasks: () => Promise<void>;
}

export const TaskProvider = ({children}: any) => {
  const [tasks, setTasks] = useState<Task[]>([]);

  const fetchTasks = async () => {
    try {
      const tasksArray: Task[] = [];
      const querySnapshot = await getDocs(collection(FIRESTORE_DB, 'tasks'));
      querySnapshot.forEach(doc => {
        tasksArray.push({
          id: doc.id,
          taskName: doc.data().taskName, // Ensure consistency with field name
          taskDescription: doc.data().taskDescription,
          dueDate: doc.data().dueDate,
          status: doc.data().status,
          createdAt: doc.data().createdAt,
          reasonOfDeletion: doc.data().reasonOfDeletion,
        });
      });
      setTasks(tasksArray); // Set tasks state
    } catch (error) {
      console.log('Error fetching tasks: ', error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Function to delete a task from Firestore and update local state
  const deleteTask = async (taskId: string, reason: string) => {
    try {
      // Find the task in local state
      const selectedTask = tasks.find(task => task.id === taskId);

      if (!selectedTask) {
        Alert.alert('Error: Task not found');
        return;
      }

      // Update the task in Firestore with the reason for deletion and status
      const taskRef = doc(FIRESTORE_DB, 'tasks', taskId);
      await updateDoc(taskRef, {
        reasonOfDeletion: reason,
        status: 'Deleted',
      });

      // Remove the task from local state
      const updatedTasks = tasks.filter(task => task.id !== taskId);
      setTasks(updatedTasks);

      Alert.alert('Task successfully deleted with reason');
    } catch (error: any) {
      console.error('Error deleting task: ', error.message);
      Alert.alert('Error deleting task: ' + error.message);
    }
  };

  const allTasksCount = tasks.filter(
    task =>
      task.status === 'To Do' ||
      task.status === 'Doing' ||
      task.status === 'Done',
  ).length;
  const newTasksCount = tasks.filter(task => task.status === 'To Do').length;
  const pendingTasksCount = tasks.filter(
    task => task.status === 'To Do' || task.status === 'Doing',
  ).length;
  const completedTasksCount = tasks.filter(
    task => task.status === 'Done',
  ).length;
  const deletedTasksCount = tasks.filter(
    task => task.status === 'Deleted',
  ).length;

  return (
    <TaskContext.Provider
      value={{
        tasks,
        setTasks,
        deleteTask,
        newTasksCount,
        pendingTasksCount,
        completedTasksCount,
        deletedTasksCount,
        allTasksCount,
        fetchTasks
      }}>
      {children}
    </TaskContext.Provider>
  );
};

// Custom hook to use the TaskContext
export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};
