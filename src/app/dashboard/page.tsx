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
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import Loader from "@/components/Loader/Loader";
import { useRouter } from "next/navigation";

function DashboardPage() {
  const { modalAction } = useEmployees();
  const { logout } = useAuth();
  const router = useRouter();

  async function handleLogOut() {
    try {
      await logout()
      router.push("/login");
    } catch (err: any) {
      console.log("error", err)
    }
  }

  return (
    <ProtectedRoute>
      <div className="page">
        <div className="topbar">
          <div className="container">
            <div className="flex items-center justify-between">
              <h2 className="topbar-title">Employee Dashboard</h2>
              <Button
                variant="textOnly"
                type="button"
                onButtonClick={handleLogOut}
                children={"Log Out"}
                className="text-white font-bold text-[20px]"
                isTestID={"log-out-btn-id"}
              />
            </div>
          </div>
        </div>

        <div className="container">
          <div className="toolbar">
            <h2 className="section-title">Employee List</h2>
            <Button
              children={"+ Add New Employee"}
              onButtonClick={modalAction.employeeFormModal.open}
              type="button"
              variant="primary"
              arialabel="add new employee"
              className=""
            />
          </div>
          {/* Search bar */}
          <SearchBar />
          <div style={{ height: 14 }} />

          {/* Employee table */}
          <EmployeeTable />
        </div>

        {/* Add */}
        <Modal open={modalAction.employeeFormModal.isOpen} onClose={modalAction.employeeFormModal.close} title="Add Employee">
          <EmployeeForm />
        </Modal>

        {/* Edit */}
        <Modal open={!!modalAction.editing} onClose={() => modalAction.setEditing(null)} title="Edit Employee">
          {modalAction.editing && (
            <EmployeeForm />
          )}
        </Modal>

        {/* Confirm Delete */}
        <ConfirmDialog
          open={modalAction.confirmEmployeeDeleteAction.isOpen}
          title="Delete Employee"
          message={`Are you sure you want to delete "${modalAction.toDeleteRef.current?.firstName} ${modalAction.toDeleteRef.current?.lastName}"?`}
          onCancel={() => { modalAction.confirmEmployeeDeleteAction.close(); modalAction.setEditing(null); }}
          onConfirm={modalAction.confirmDelete}
          confirmText="Delete"
        />

        {/* Loader */}
        <Loader loaderFullScreen={true} isLoading={modalAction.isLoading} size="lg" />
      </div>
    </ProtectedRoute>
  );
}

export default DashboardPage