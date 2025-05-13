export interface Task {
  id: number;
  title: string;
  status: string;
  createdAt: Date;
  createdBy: number; // ID of the user who created the task
  assignedTo: number; // ID of the user the task is assigned to
  description: string;
}

export interface TaskFormData {
  title: string;
  status: string;
  description: string;
  assignedTo?: number;
}

export interface TaskFormState {
  title: string;
  status: string;
  description: string;
  assignedTo?: number;
}
