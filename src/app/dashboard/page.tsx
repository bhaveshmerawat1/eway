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

function DashboardPage() {
  const {modalAction} = useEmployees();

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
            onClick={modalAction.addModal.open}
            type="button"
            variant="primary"
            arialabel="add new employee"
          />
        </div>
        {/* Search bar */}
        <SearchBar />
        <div style={{ height: 14 }} />

        {/* Employee table */}
        <EmployeeTable />
      </div>

      {/* Add */}
      <Modal open={modalAction.addModal.isOpen} onClose={modalAction.addModal.close} title="Add Employee">
        <EmployeeForm />
      </Modal>

      {/* Edit */}
      <Modal open={!!modalAction.editing} onClose={()=>modalAction.setEditing(null)} title="Edit Employee">
        {modalAction.editing && (
          <EmployeeForm />
        )}
      </Modal>

      {/* Confirm Delete */}
      <ConfirmDialog
        open={modalAction.confirm.isOpen}
        title="Delete Employee"
        message={`Are you sure you want to delete "${modalAction.toDelete?.firstName} ${modalAction.toDelete?.lastName}"?`}
        onCancel={() => { modalAction.confirm.close(); modalAction.setEditing(null); }}
        onConfirm={modalAction.confirmDelete}
        confirmText="Delete"
      />
    </div>
  );
}

export default DashboardPage