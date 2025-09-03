"use client";

import React, { createContext, useContext, useMemo, useState } from "react";
import { STORAGE_KEYS } from "@/utils/storage";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import useToggle from "@/hooks/useToggle";
import { Employee, NewEmployee } from "@/utils/EmployeeTypes";
import { validateEmployee } from "@/utils/validators";

interface EmployeeContextValue {
  employees: Employee[];
  filtered: Employee[];
  query: string;
  setQuery: (val: string) => void;
  highlight: string | null;

  addModal: ReturnType<typeof useToggle>;
  editing: Employee | null;
  setEditing: (emp: Employee | null) => void;

  confirm: ReturnType<typeof useToggle>;
  toDelete: Employee | null;
  askDelete: (emp: Employee) => void;
  confirmDelete: () => void;

  createEmployee: (data: NewEmployee) => void;
  updateEmployee: (data: Employee) => void;
  // Shorting
  sortField: keyof Employee | null;
  sortOrder: "asc" | "desc";
  setSort: (field: keyof Employee) => void;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  itemsPerPage: number;
  totalPages: number;
  paginatedEmployees: Employee[];
}

const EmployeeContext = createContext<EmployeeContextValue | null>(null);

// seed data
const seed: Employee[] = [
  {
    id: "e1", firstName: "Pierre", lastName: "Fontaine", age: 32, joiningDate: "2023-01-10",
    address: "New York, USA", mobile: "5550101010"
  },
  {
    id: "e2", firstName: "Rajesh", lastName: "Royal", age: 28, joiningDate: "2022-06-20",
    address: "Ajmer, IN", mobile: "9876543210"
  },
];

export const EmployeeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [employees, setEmployees, ready] = useLocalStorage<Employee[]>(STORAGE_KEYS.EMPLOYEES, seed);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<Employee | null>(null);
  const addModal = useToggle(false);
  const confirm = useToggle(false);
  const [toDelete, setToDelete] = useState<Employee | null>(null);
  const [highlight, setHighlight] = useState<string | null>(null);

  const [sortField, setSortField] = useState<keyof Employee | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filter
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return employees;
    return employees.filter(e =>
      [e.firstName, e.lastName, e.address, e.mobile].some(v => v.toLowerCase().includes(q)) ||
      String(e.age).includes(q)
    );
  }, [employees, query]);

  // Create
  function createEmployee(data: NewEmployee) {
    const errs = validateEmployee(data);
    if (Object.keys(errs).length) return;

    const id = crypto.randomUUID();
    const newEmp: Employee = { id, ...data };
    setEmployees(prev => [newEmp, ...prev]);
    addModal.setFalse();
    setHighlight(id);
    setTimeout(() => setHighlight(null), 2000);
  }

  // Update
  function updateEmployee(data: Employee) {
    setEmployees(prev => prev.map(e => e.id === data.id ? data : e));
    setEditing(null);
    setHighlight(data.id);
    setTimeout(() => setHighlight(null), 2000);
  }

  // Delete
  function askDelete(emp: Employee) {
    setToDelete(emp);
    confirm.setTrue();
  }

  function confirmDelete() {
    if (!toDelete) return;
    setEmployees(prev => prev.filter(e => e.id !== toDelete.id));
    confirm.setFalse();
    setToDelete(null);
  }
  
  // Sorting logic
  const setSort = (field: keyof Employee) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const sortedEmployees = React.useMemo(() => {
    if (!sortField) return filtered;
    return [...filtered].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [filtered, sortField, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(sortedEmployees.length / itemsPerPage);
  const paginatedEmployees = sortedEmployees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (!ready) return null;

  return (
    <EmployeeContext.Provider value={{
      employees, filtered, query, setQuery,
      addModal, editing, setEditing,
      confirm, toDelete, askDelete, confirmDelete,
      createEmployee, updateEmployee, highlight, sortField,
      sortOrder,
      setSort,
      currentPage,
      setCurrentPage,
      itemsPerPage,
      totalPages,
      paginatedEmployees,
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
