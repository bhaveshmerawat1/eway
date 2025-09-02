"use client";

import React from "react";
import "@/assets/styles/common.css";

import { useEmployees } from "@/context/EmployeeContext";

import SearchBar from "@/components/SearchBar";
import EmployeeTable from "@/components/EmployeeTable";
import Modal from "@/components/Modal";
import EmployeeForm from "@/components/EmployeeForm";
import ConfirmDialog from "@/components/ConfirmDialog";
import Button from "@/components/Button/Button";
import { Employee } from "@/utils/EmployeeTypes";

function DashboardPage() {
  const {
    query, setQuery, filtered,
    addModal, editing, setEditing,
    createEmployee, updateEmployee,
    confirm, toDelete, askDelete,
    confirmDelete, highlight
  } = useEmployees();

  return (
    <div className="page">
      <div className="topbar">
        <div className="container">
          <h2 className="topbar-title">Employee Dashboard</h2>
        </div>
      </div>

      <div className="container">
        <div className="toolbar">
          <h2 className="section-title">Employee List</h2>
          <Button
            children={"+ Add New Employee"}
            onClick={addModal.setTrue}
            type="button"
            variant="primary"
            arialabel="add new employee"
          />
        </div>
        {/* Search bar */}
        <SearchBar value={query} onChange={setQuery} />
        <div style={{ height: 14 }} />
        
        {/* Employee table */}
        <EmployeeTable
          data={filtered}
          onEdit={setEditing}
          onDelete={askDelete}
          highlightId={highlight}
        />
      </div>

      {/* Add */}
      <Modal open={addModal.open} onClose={addModal.setFalse} title="Add Employee">
        <EmployeeForm mode="create" onSubmit={createEmployee} />
      </Modal>

      {/* Edit */}
      <Modal open={!!editing} onClose={() => setEditing(null)} title="Edit Employee">
        {editing && (
          <EmployeeForm
            mode="edit"
            initial={editing}
            onSubmit={(d) => updateEmployee(d as Employee)}
          />
        )}
      </Modal>

      {/* Confirm Delete */}
      <ConfirmDialog
        open={confirm.open}
        title="Delete Employee"
        message={`Are you sure you want to delete "${toDelete?.firstName} ${toDelete?.lastName}"?`}
        onCancel={() => { confirm.setFalse(); setEditing(null); }}
        onConfirm={confirmDelete}
        confirmText="Delete"
      />
    </div>
  );
}

export default DashboardPage