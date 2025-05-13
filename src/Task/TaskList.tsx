import { FilterMatchMode } from "primereact/api";
import { Column } from "primereact/column";
import { DataTable, DataTableFilterMeta } from "primereact/datatable";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { useState } from "react";
import { TaskItem } from "./TaskItem";
import { Task } from "./types";

interface TaskListProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
  onStatusToggle: (task: Task) => void;
}

export const TaskList = ({
  tasks,
  onEdit,
  onDelete,
  onStatusToggle,
}: TaskListProps) => {
  const [filters, setFilters] = useState<DataTableFilterMeta>({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    status: { value: null, matchMode: FilterMatchMode.EQUALS },
  });

  const statuses = ["pending", "completed"];

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
      <TaskItem
        task={rowData}
        onEdit={onEdit}
        onDelete={onDelete}
        onStatusToggle={onStatusToggle}
      />
    );
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
  );
};
