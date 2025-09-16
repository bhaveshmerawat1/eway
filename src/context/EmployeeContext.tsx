"use client";

import React, { createContext, useContext, useMemo, useState, useRef, MutableRefObject, useEffect } from "react";
import useToggle from "@/hooks/useToggle";
import { validateEmployee } from "@/utils/validators";
import { ApiResponse, Employee } from "@/utils/EmployeeTypes";
import axios from "axios";

export interface NewEmployee {
  firstName: string;
  lastName: string;
  age: number;
  address: string;
  mobile: string;
}

interface EmployeeContextValue {
  allEmployees: {
    employees: Employee[];
    createNewEmployee: (data: Omit<Employee, "id">) => Promise<void>;
    updateEmployeeDetails: (data: Employee) => Promise<void>;
    filtered: Employee[];
    fetchEmployees: () => Promise<void>;
  },
  search: {
    searchQuery: string;
    setSearchQuery: (val: string) => void;
  },
  pageinfo: {
    currentPage: number;
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
    itemsPerPage: number;
    totalPages: number;
    paginatedEmployees: Employee[];
  },
  shorting: {
    sort: { field: keyof Employee; order: "asc" | "desc" };
    setSort: (field: keyof Employee) => void;
  },
  modalAction: {
    employeeFormModal: ReturnType<typeof useToggle>;
    editing: Employee | null;
    setEditing: (emp: Employee | null) => void;
    confirmEmployeeDeleteAction: ReturnType<typeof useToggle>;
    toDeleteRef: MutableRefObject<Employee | null>;
    askToEmpDelete: (emp: Employee) => void;
    confirmDelete: () => Promise<void>;
    isLoading:boolean
    setIsLoading:(val:boolean)=>void
  }
}

const EmployeeContext = createContext<EmployeeContextValue | null>(null);

export const EmployeeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editing, setEditing] = useState<Employee | null>(null);
  const employeeFormModal = useToggle(false);
  const confirmEmployeeDeleteAction = useToggle(false);
  const toDeleteRef = useRef<Employee | null>(null);
  const [sort, setSortState] = useState<{ field: keyof Employee; order: "asc" | "desc" }>({
    field: "firstName",
    order: "asc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [isLoading, setIsLoading] = useState(false);


  // 🔹 Fetch employees from API
  async function fetchEmployees() {
    const res = await axios.get<ApiResponse<Employee[]>>("/api/employees");
    if (res.data.success && res.data.data) {
      setEmployees(res.data.data);
    } else {
      console.error("Failed to fetch employees:", res.data.error);
    }
  }

  useEffect(() => {
    fetchEmployees();
  }, []);

  // 🔹 Create
  async function createNewEmployee(data: NewEmployee) {
    setIsLoading(true)
    const errs = validateEmployee(data);
    if (Object.keys(errs).length) return;
    const res = await fetch("api/employees", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    console.log("create new employee api call ===================",data)
    if (res.ok) {
      const newEmp = await res.json();
      console.log("fetch latest emp ===================", newEmp)
      setEmployees(prev => [newEmp, ...prev]);
      setIsLoading(false)
    }
    employeeFormModal.close();
    setIsLoading(false)
  }

  // 🔹 Update
  async function updateEmployeeDetails(data: Employee) {
    setIsLoading(true)
    const id = data.id
    try {
      const res = await fetch(`/api/employees/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      console.log("update employee ===============",data)
      if (!res.ok) throw new Error("Failed to update employee");
      const updated = await res.json();
      // update state so UI reflects changes
      setEmployees((prev) =>
        prev.map((emp) => (emp.id === updated.id ? updated : emp))
      );
      setEditing(null);
      setIsLoading(false)
    } catch (error) {
      console.error("❌ Error updating employee:", error);
      setIsLoading(false)
    }
  }

  // 🔹 Delete
  function askToEmpDelete(emp: Employee) {
    toDeleteRef.current = emp;
    confirmEmployeeDeleteAction.open();
  }

  async function confirmDelete() {
    setIsLoading(true)
    const idToDelete = toDeleteRef?.current?.id
    if (!idToDelete) return;
    try {
      const res = await fetch(`/api/employees/${idToDelete}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete employee");

      // Update state after successful delete
      setEmployees((prev) => prev.filter((e) => e.id !== idToDelete));
      confirmEmployeeDeleteAction.close();
      toDeleteRef.current = null;
      setIsLoading(false)
    } catch (error) {
      console.error("❌ Error deleting employee:", error);
      setIsLoading(false)
    }
  }

  // 🔹 Filter
  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return employees;
    return employees.filter(emp =>
      [emp.firstName, emp.lastName, emp.address, emp.mobile].some(value =>
        value.toLowerCase().includes(q)
      ) || String(emp.age).includes(q)
    );
  }, [employees, searchQuery]);

  // 🔹 Sorting
  const setSort = (field: keyof Employee) => {
    setSortState(prev =>
      prev.field === field
        ? { ...prev, order: prev.order === "asc" ? "desc" : "asc" }
        : { field, order: "asc" }
    );
  };

  const sortedEmployees = useMemo(() => {
    if (!sort.field) return filtered;
    const { field, order } = sort;
    return [...filtered].sort((a, b) => {
      const aValue = a[field];
      const bValue = b[field];
      if (aValue < bValue) return order === "asc" ? -1 : 1;
      if (aValue > bValue) return order === "asc" ? 1 : -1;
      return 0;
    });
  }, [filtered, sort]);

  // 🔹 Pagination
  const totalPages = Math.ceil(sortedEmployees.length / itemsPerPage);
  const paginatedEmployees = sortedEmployees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <EmployeeContext.Provider value={{
      allEmployees: { employees, createNewEmployee, updateEmployeeDetails, filtered, fetchEmployees },
      search: { searchQuery, setSearchQuery },
      pageinfo: { currentPage, setCurrentPage, itemsPerPage, totalPages, paginatedEmployees },
      shorting: { sort, setSort },
      modalAction: { employeeFormModal, editing, setEditing, confirmEmployeeDeleteAction, askToEmpDelete, confirmDelete, toDeleteRef,isLoading,setIsLoading}
    }}>
      {children} 
    </EmployeeContext.Provider>
  );
};

export function useEmployees() {
  const ctx = useContext(EmployeeContext);
  if (!ctx) throw new Error("useEmployees must be used inside EmployeeProvider");
  return ctx;
}
