import { FilterMatchMode } from "primereact/api";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Column } from "primereact/column";
import { DataTable, DataTableFilterMeta } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { useEffect, useRef, useState } from "react";

interface Task {
  id: number;
  title: string;
  status: string;
  createdAt: Date;
}

const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [visible, setVisible] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", status: "pending" });
  const [editMode, setEditMode] = useState(false);
  const [editTaskId, setEditTaskId] = useState<number | null>(null);
  const [filters, setFilters] = useState<DataTableFilterMeta>({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    status: { value: null, matchMode: FilterMatchMode.EQUALS },
  });
  const toast = useRef<Toast>(null);
  const statuses = ["pending", "completed"];

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      const parsedTasks = JSON.parse(savedTasks).map((task: any) => ({
        ...task,
        createdAt: new Date(task.createdAt),
      }));
      setTasks(parsedTasks);
    }
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const statusBodyTemplate = (rowData: Task) => {
    return (
      <span className={`status-badge status-${rowData.status.toLowerCase()}`}>
        {rowData.status}
      </span>
    );
  };

  const dateBodyTemplate = (rowData: Task) => {
    return new Date(rowData.createdAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const actionBodyTemplate = (rowData: Task) => {
    return (
      <div className="flex gap-2">
        <Button
          icon="pi pi-pencil"
          rounded
          text
          severity="info"
          onClick={() => handleEdit(rowData)}
        />
        <Button
          icon="pi pi-trash"
          rounded
          text
          severity="danger"
          onClick={() => handleDelete(rowData.id)}
        />
        <Button
          icon={`pi pi-${rowData.status === "completed" ? "refresh" : "check"}`}
          rounded
          text
          severity={rowData.status === "completed" ? "warning" : "success"}
          onClick={() => toggleTaskStatus(rowData)}
        />
      </div>
    );
  };

  const toggleTaskStatus = (task: Task) => {
    const updatedTasks = tasks.map((t) => {
      if (t.id === task.id) {
        const newStatus = t.status === "completed" ? "pending" : "completed";
        return { ...t, status: newStatus };
      }
      return t;
    });
    setTasks(updatedTasks);
    toast.current?.show({
      severity: "success",
      summary: "Task Updated",
      detail: `Task marked as ${
        task.status === "completed" ? "pending" : "completed"
      }`,
      life: 3000,
    });
  };

  const handleEdit = (task: Task) => {
    setNewTask({ title: task.title, status: task.status });
    setEditTaskId(task.id);
    setEditMode(true);
    setVisible(true);
  };

  const handleDelete = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id));
    toast.current?.show({
      severity: "success",
      summary: "Task Deleted",
      detail: "Task has been deleted successfully",
      life: 3000,
    });
  };

  const validateTask = () => {
    if (!newTask.title.trim()) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Task title is required",
        life: 3000,
      });
      return false;
    }
    return true;
  };

  const handleAdd = () => {
    if (!validateTask()) return;

    if (editMode && editTaskId !== null) {
      const updatedTasks = tasks.map((task) =>
        task.id === editTaskId
          ? { ...task, title: newTask.title, status: newTask.status }
          : task
      );
      setTasks(updatedTasks);
      toast.current?.show({
        severity: "success",
        summary: "Task Updated",
        detail: "Task has been updated successfully",
        life: 3000,
      });
    } else {
      const task: Task = {
        id: tasks.length + 1,
        title: newTask.title,
        status: newTask.status,
        createdAt: new Date(),
      };
      setTasks([...tasks, task]);
      toast.current?.show({
        severity: "success",
        summary: "Task Added",
        detail: "New task has been added successfully",
        life: 3000,
      });
    }

    handleDialogClose();
  };

  const handleDialogClose = () => {
    setVisible(false);
    setNewTask({ title: "", status: "pending" });
    setEditMode(false);
    setEditTaskId(null);
  };

  const statusFilterTemplate = (options: any) => {
    return (
      <Dropdown
        value={options.value}
        options={statuses}
        onChange={(e) => options.filterCallback(e.value, options.index)}
        placeholder="Select a Status"
        className="p-column-filter"
      />
    );
  };

  return (
    <div className="p-4">
      <Toast ref={toast} />
      <Card>
        <div className="flex justify-content-between align-items-center mb-4">
          <h2 className="m-0">Tasks</h2>
          <Button
            label="Add Task"
            icon="pi pi-plus"
            onClick={() => setVisible(true)}
          />
        </div>

        <DataTable
          value={tasks}
          paginator
          rows={10}
          filters={filters}
          filterDisplay="menu"
          globalFilterFields={["title", "status"]}
          emptyMessage="No tasks found"
          className="p-datatable-sm"
          header={
            <div className="flex justify-content-end">
              <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText
                  onInput={(e) =>
                    setFilters({
                      ...filters,
                      global: {
                        value: (e.target as HTMLInputElement).value,
                        matchMode: FilterMatchMode.CONTAINS,
                      },
                    })
                  }
                  placeholder="Search tasks..."
                />
              </span>
            </div>
          }
        >
          <Column
            field="title"
            header="Title"
            sortable
            filter
            filterPlaceholder="Search by title"
          />
          <Column
            field="status"
            header="Status"
            body={statusBodyTemplate}
            sortable
            filter
            filterElement={statusFilterTemplate}
          />
          <Column
            field="createdAt"
            header="Created At"
            sortable
            body={dateBodyTemplate}
          />
          <Column
            body={actionBodyTemplate}
            header="Actions"
            style={{ width: "12rem" }}
          />
        </DataTable>
      </Card>

      <Dialog
        visible={visible}
        onHide={handleDialogClose}
        header={editMode ? "Edit Task" : "Add New Task"}
        modal
        className="p-fluid"
      >
        <div className="flex flex-column gap-3 pt-3">
          <div className="field">
            <label htmlFor="title">Title</label>
            <InputText
              id="title"
              value={newTask.title}
              onChange={(e) =>
                setNewTask({ ...newTask, title: e.target.value })
              }
            />
          </div>
          <div className="field">
            <label htmlFor="status">Status</label>
            <Dropdown
              id="status"
              value={newTask.status}
              options={statuses}
              onChange={(e) => setNewTask({ ...newTask, status: e.value })}
              placeholder="Select a Status"
            />
          </div>
          <Button label={editMode ? "Update" : "Add"} onClick={handleAdd} />
        </div>
      </Dialog>

      <style>
        {`
          .status-badge {
            padding: 0.5rem;
            border-radius: 4px;
            text-transform: capitalize;
          }
          .status-pending {
            background-color: var(--yellow-100);
            color: var(--yellow-900);
          }
          .status-completed {
            background-color: var(--green-100);
            color: var(--green-900);
          }
          .p-column-filter {
            width: 100%;
          }
        `}
      </style>
    </div>
  );
};

export default Tasks;
