"use client";

import React, { createContext, useContext, useMemo, useState } from "react";
import { STORAGE_KEYS } from "@/utils/storage";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import useToggle from "@/hooks/useToggle";
import { Employee, NewEmployee } from "@/utils/EmployeeTypes";
import { validateEmployee } from "@/utils/validators";

interface EmployeeContextValue {
  allEmployees: {
    employees: Employee[];
    createNewEmployee: (data: NewEmployee) => void;
    updateEmployeeDetails: (data: Employee) => void;
    filtered: Employee[];
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
    addModal: ReturnType<typeof useToggle>;
    editing: Employee | null;
    setEditing: (emp: Employee | null) => void;
    confirm: ReturnType<typeof useToggle>;
    toDelete: Employee | null;
    askDelete: (emp: Employee) => void;
    confirmDelete: () => void;
  }
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
  const { getLocalStorage, setLocalStorage, deleteLocalStorage, localStorageIsReady } =
    useLocalStorage<Employee[]>(STORAGE_KEYS.EMPLOYEES, seed);
  const [employees, setEmployees] = useState<Employee[]>(() => getLocalStorage(STORAGE_KEYS.EMPLOYEES) || seed);
  const [searchQuery, setSearchQuery] = useState("");
  const [editing, setEditing] = useState<Employee | null>(null);
  const addModal = useToggle(false);
  const confirm = useToggle(false);
  const [toDelete, setToDelete] = useState<Employee | null>(null);
  const [sort, setSortState] = useState<{ field: keyof Employee; order: "asc" | "desc" }>({
    field: "firstName",
    order: "asc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;


  React.useEffect(() => {
    if (localStorageIsReady) {
      setLocalStorage(STORAGE_KEYS.EMPLOYEES, employees);
    }
  }, [employees, localStorageIsReady, setLocalStorage]);

  // Create
  function createNewEmployee(data: NewEmployee) {
    const errs = validateEmployee(data);
    if (Object.keys(errs).length) return;

    const id = crypto.randomUUID();
    const newEmp: Employee = { id, ...data };
    setEmployees(prev => [newEmp, ...prev]);
    addModal.close();
  }

  // Update
  function updateEmployeeDetails(data: Employee) {
    setEmployees(prev => prev.map(e => e.id === data.id ? data : e));
    setEditing(null);
  }

  // Delete
  function askDelete(emp: Employee) {
    setToDelete(emp);
    confirm.open();
  }

  function confirmDelete() {
    if (!toDelete) return;
    setEmployees(prev => prev.filter(e => e.id !== toDelete.id));
    confirm.close();
    setToDelete(null);
    // If no employees left, clear from storage
    if (employees.length === 1) {
      deleteLocalStorage(STORAGE_KEYS.EMPLOYEES);
    }
  }

  // Filter
  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return employees;
    return employees.filter(emp =>
      [emp.firstName, emp.lastName, emp.address, emp.mobile].some(value => value.toLowerCase().includes(q)) ||
      String(emp.age).includes(q)
    );
  }, [employees, searchQuery]);

  // Sorting logic
  const setSort = (field: keyof Employee) => {
    setSortState(prev =>
      prev.field === field
        ? { ...prev, order: prev.order === "asc" ? "desc" : "asc" }
        : { field, order: "asc" }
    );
  };

  const sortedEmployees = React.useMemo(() => {
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

  // Pagination
  const totalPages = Math.ceil(sortedEmployees.length / itemsPerPage);
  const paginatedEmployees = sortedEmployees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (!localStorageIsReady) return null;

  return (
    <EmployeeContext.Provider value={{
      allEmployees: {
        employees,
        createNewEmployee,
        updateEmployeeDetails,
        filtered
      },
      search: {
        searchQuery,
        setSearchQuery,
      },
      pageinfo: {
        currentPage,
        setCurrentPage,
        itemsPerPage,
        totalPages,
        paginatedEmployees,
      },
      shorting: {
        sort,
        setSort
      },
      modalAction: {
        addModal,
        editing,
        setEditing,
        confirm,
        toDelete,
        askDelete,
        confirmDelete,
      }
    }} > {children}</EmployeeContext.Provider>
  );
};

export function useEmployees() {
  const ctx = useContext(EmployeeContext);
  if (!ctx) throw new Error("useEmployees must be used inside EmployeeProvider");
  return ctx;
}
