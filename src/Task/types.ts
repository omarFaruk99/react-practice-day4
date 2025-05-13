export interface Task {
  id: number;
  title: string;
  status: string;
  createdAt: Date;
}

export interface TaskFormData {
  title: string;
  status: string;
}
