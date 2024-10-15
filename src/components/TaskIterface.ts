export interface Task {
  id: string; // Firestore document ID
  taskName: string; // Task name
  taskDescription: string; // Task description
  dueDate: string; // Due date of the task
  status: string; // Status of the task (e.g., 'To Do', 'Doing', 'Done')
  createdAt: string; // Timestamp for when the task was created
  reasonOfDeletion: string; // Reason for deleting the task
}
